/**
 * Browser runner — uses Playwright to execute test scenarios
 * and capture everything the agents need to diagnose bugs.
 */

import { chromium } from "playwright";

export interface ConsoleLog {
  type: string;
  text: string;
}

export interface TestResult {
  url: string;
  pageTitle: string;
  consoleLogs: ConsoleLog[];
  consoleErrors: string[];
  networkErrors: string[];
  screenshot: string; // base64 PNG
  customCheckResult?: string;
}

/**
 * Run a browser test and capture all output.
 *
 * @param url - Page to navigate to
 * @param steps - Natural language description of steps (parsed into actions)
 */
export async function runBrowserTest(
  url: string,
  steps: string
): Promise<TestResult> {
  const consoleLogs: ConsoleLog[] = [];
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    // Grant mic permission so SpeechRecognition doesn't immediately fail
    permissions: ["microphone"],
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  // Capture console
  page.on("console", (msg) => {
    const entry = { type: msg.type(), text: msg.text() };
    consoleLogs.push(entry);
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  // Capture page errors
  page.on("pageerror", (err) => {
    consoleErrors.push(`[PageError] ${err.message}`);
  });

  // Capture failed network requests
  page.on("requestfailed", (req) => {
    networkErrors.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
  });

  try {
    // Navigate
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(1000); // Let JS settle

    // Execute steps
    await executeSteps(page, steps);

    // Capture results
    const pageTitle = await page.title();
    const screenshotBuffer = await page.screenshot({ fullPage: false });
    const screenshot = screenshotBuffer.toString("base64");

    await browser.close();

    return {
      url,
      pageTitle,
      consoleLogs: consoleLogs.slice(-50), // Last 50 entries
      consoleErrors,
      networkErrors,
      screenshot,
    };
  } catch (err) {
    // Still try to get a screenshot on failure
    let screenshot = "";
    try {
      const buf = await page.screenshot();
      screenshot = buf.toString("base64");
    } catch {
      // Can't screenshot
    }

    await browser.close();

    return {
      url,
      pageTitle: "(error)",
      consoleLogs: consoleLogs.slice(-50),
      consoleErrors: [
        ...consoleErrors,
        `[BrowserRunner] ${err instanceof Error ? err.message : String(err)}`,
      ],
      networkErrors,
      screenshot,
    };
  }
}

/**
 * Parse natural language steps into Playwright actions.
 * Keeps it simple — supports common patterns.
 */
async function executeSteps(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof chromium.launch>>["newPage"]>>,
  steps: string
) {
  const lines = steps
    .split(/[,;\n]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  for (const step of lines) {
    console.log(`  🎯 Step: "${step}"`);

    if (step.match(/^wait (\d+)s?$/)) {
      const seconds = parseInt(step.match(/(\d+)/)![1]);
      await page.waitForTimeout(seconds * 1000);
    } else if (step.match(/^click (.+)/)) {
      const target = step.match(/^click (.+)/)![1];
      await clickTarget(page, target);
    } else if (step.match(/^type ["'](.+)["']/)) {
      const text = step.match(/^type ["'](.+)["']/)![1];
      await page.keyboard.type(text);
    } else if (step === "load the page" || step === "load page") {
      // Already loaded — just wait a bit more
      await page.waitForTimeout(500);
    } else if (step.match(/^scroll (down|up)/)) {
      const direction = step.includes("down") ? 500 : -500;
      await page.mouse.wheel(0, direction);
      await page.waitForTimeout(300);
    } else if (step.match(/^check (.+)/)) {
      // Custom check — evaluate in page context
      const what = step.match(/^check (.+)/)![1];
      const result = await page.evaluate((w) => {
        return document.body.innerText.includes(w) ? `Found "${w}"` : `Not found: "${w}"`;
      }, what);
      console.log(`  📋 Check: ${result}`);
    } else {
      console.log(`  ⚠️  Unknown step: "${step}" — skipping`);
    }
  }
}

/**
 * Smart click — tries multiple strategies to find the target.
 */
async function clickTarget(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof chromium.launch>>["newPage"]>>,
  target: string
) {
  // Try by role/text first
  const buttonByText = page.getByRole("button", { name: new RegExp(target, "i") });
  if ((await buttonByText.count()) > 0) {
    await buttonByText.first().click();
    await page.waitForTimeout(500);
    return;
  }

  // Try by visible text
  const byText = page.getByText(target, { exact: false });
  if ((await byText.count()) > 0) {
    await byText.first().click();
    await page.waitForTimeout(500);
    return;
  }

  // Try by aria-label
  const byLabel = page.locator(`[aria-label*="${target}" i]`);
  if ((await byLabel.count()) > 0) {
    await byLabel.first().click();
    await page.waitForTimeout(500);
    return;
  }

  // Try by title
  const byTitle = page.locator(`[title*="${target}" i]`);
  if ((await byTitle.count()) > 0) {
    await byTitle.first().click();
    await page.waitForTimeout(500);
    return;
  }

  console.log(`  ⚠️  Could not find clickable element: "${target}"`);
}
