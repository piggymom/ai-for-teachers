#!/usr/bin/env npx tsx
/**
 * Watch mode — re-runs browser test on every file change.
 * Agents only kick in when an error is detected.
 *
 * Usage:
 *   npx tsx debug-loop/watch.ts --url http://localhost:3000/home --steps "load the page, wait 2s"
 *   npx tsx debug-loop/watch.ts --url http://localhost:3000/week-0 --steps "click mic button, wait 3s"
 *
 * Watches app/, lib/, hooks/ for changes. On each change:
 *   1. Waits for dev server to rebuild (2s)
 *   2. Runs browser test (screenshot + console)
 *   3. If errors found → calls tester agent for diagnosis
 *   4. Prints diagnosis to terminal
 *   5. If no errors → prints ✅ and waits for next change
 */

import { config } from "dotenv";
import { resolve } from "path";
import { watch } from "fs";
import Anthropic from "@anthropic-ai/sdk";
import { runBrowserTest, type TestResult } from "./browser";

config({ path: resolve(__dirname, "..", ".env.local") });

const claude = new Anthropic();
const PROJECT_ROOT = resolve(__dirname, "..");

// Parse args
const args = process.argv.slice(2);
const url = getFlag("--url") || "http://localhost:3000";
const steps = getFlag("--steps") || "load the page, wait 2s";
const watchDirs = (getFlag("--watch") || "app,lib,hooks").split(",");

function getFlag(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : undefined;
}

// Debounce — don't re-test on every single file save
let debounceTimer: NodeJS.Timeout | null = null;
let isRunning = false;

async function diagnose(testResult: TestResult): Promise<string> {
  const content: Anthropic.Messages.ContentBlockParam[] = [
    {
      type: "text",
      text: `A browser test just ran and found issues. Diagnose what's wrong.

## Test Results
- URL: ${testResult.url}
- Console Errors:\n${testResult.consoleErrors.map((e) => `  ${e}`).join("\n") || "  (none)"}
- Console Logs (last 20):\n${testResult.consoleLogs.slice(-20).map((l) => `  [${l.type}] ${l.text}`).join("\n") || "  (none)"}
- Network Errors:\n${testResult.networkErrors.join("\n") || "  (none)"}

## Screenshot`,
    },
  ];

  if (testResult.screenshot) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/png",
        data: testResult.screenshot,
      },
    });
  }

  const response = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: `You are a concise QA agent watching a dev session. When you see errors or visual issues, give a SHORT diagnosis (2-4 lines max). Format:

❌ ISSUE: (one line)
💡 CAUSE: (one line)
🔧 FIX: (one line)

If everything looks fine, just say: ✅ Page looks good.`,
    messages: [{ role: "user", content }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function runCheck() {
  if (isRunning) return;
  isRunning = true;

  const time = new Date().toLocaleTimeString();
  process.stdout.write(`\n[${time}] 🔍 Testing ${url}...`);

  try {
    const result = await runBrowserTest(url, steps);
    const hasErrors =
      result.consoleErrors.length > 0 ||
      result.networkErrors.length > 0;

    if (hasErrors) {
      console.log(" ⚠️  Issues found!");
      console.log(`   Console errors: ${result.consoleErrors.length}`);
      console.log(`   Network errors: ${result.networkErrors.length}`);

      // Quick errors dump
      for (const err of result.consoleErrors.slice(0, 3)) {
        console.log(`   ❌ ${err.slice(0, 120)}`);
      }

      // Ask agent to diagnose
      process.stdout.write("   🤖 Diagnosing...");
      const diagnosis = await diagnose(result);
      console.log("\n" + diagnosis.split("\n").map((l) => "   " + l).join("\n"));
    } else {
      console.log(" ✅ Clean — 0 errors");
    }
  } catch (err) {
    console.log(` ❌ Test runner failed: ${err instanceof Error ? err.message : err}`);
  }

  isRunning = false;
}

// Start watching
console.log("👁️  Debug Loop Watch Mode");
console.log(`   URL: ${url}`);
console.log(`   Steps: ${steps}`);
console.log(`   Watching: ${watchDirs.join(", ")}`);
console.log("   Press Ctrl+C to stop\n");

// Initial check
runCheck();

// Watch for file changes
for (const dir of watchDirs) {
  const fullDir = resolve(PROJECT_ROOT, dir);
  try {
    watch(fullDir, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      // Ignore non-source files
      if (!filename.endsWith(".ts") && !filename.endsWith(".tsx")) return;

      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        console.log(`\n   📝 ${dir}/${filename} changed`);
        runCheck();
      }, 3000); // 3s debounce — wait for dev server rebuild
    });
  } catch {
    console.log(`   ⚠️  Can't watch ${dir}/ — directory may not exist`);
  }
}
