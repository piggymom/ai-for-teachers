#!/usr/bin/env npx tsx
/**
 * Two-Agent Debug Loop
 *
 * Usage:
 *   npx tsx debug-loop/run.ts "the mic button shows blocked even though permission is granted"
 *
 * Optional flags:
 *   --url http://localhost:3000/week-0   (default: http://localhost:3000)
 *   --steps "click mic button, wait 3s"  (browser actions to reproduce)
 *   --max 5                              (max iterations, default 5)
 *   --file hooks/useSpeechToText.ts      (focus on specific file)
 */

import { config } from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { runBrowserTest, type TestResult } from "./browser";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, relative } from "path";

// Load env vars from .env.local
config({ path: resolve(__dirname, "..", ".env.local") });

const claude = new Anthropic();
const PROJECT_ROOT = resolve(__dirname, "..");
const CONTEXT_FILE = resolve(__dirname, "context.md");

// Parse CLI args
const args = process.argv.slice(2);
const bug = args.find((a) => !a.startsWith("--")) || "";
const url = getFlag("--url") || "http://localhost:3000";
const steps = getFlag("--steps") || "load the page";
const maxIterations = parseInt(getFlag("--max") || "5");
const focusFile = getFlag("--file");

function getFlag(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function readProjectFile(filePath: string): string {
  const full = resolve(PROJECT_ROOT, filePath);
  if (!existsSync(full)) return `[File not found: ${filePath}]`;
  return readFileSync(full, "utf-8");
}

function writeProjectFile(filePath: string, content: string) {
  const full = resolve(PROJECT_ROOT, filePath);
  // Safety: only write to files that already exist (no creating random paths)
  if (!existsSync(full)) {
    console.log(`  ⚠️  Skipping ${filePath} — file doesn't exist (won't create new files)`);
    return;
  }
  writeFileSync(full, content, "utf-8");
  console.log(`  ✏️  Wrote ${filePath}`);
}

function getProjectStructure(): string {
  // Give the implementer a map of the actual project
  const { execSync } = require("child_process");
  try {
    return execSync(
      'find app lib hooks components -type f -name "*.ts" -o -name "*.tsx" 2>/dev/null | head -60',
      { cwd: PROJECT_ROOT, encoding: "utf-8" }
    );
  } catch {
    return "(could not list project files)";
  }
}

function saveContext(context: string) {
  writeFileSync(CONTEXT_FILE, context, "utf-8");
}

// ─── IMPLEMENTER AGENT ──────────────────────────────────────────────────────

async function implementerAnalyze(context: string): Promise<string> {
  const response = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `You are a debugging implementer. You read bug descriptions, browser test results, and source code, then propose MINIMAL fixes.

RULES:
- Propose the SMALLEST possible change that fixes the bug
- Output your response in this exact format:

## Analysis
(1-3 sentences on what's wrong)

## Files to Read
file1.ts
file2.tsx

## Fix
(After you see the file contents, you'll propose the fix)

- Do NOT over-engineer. One change at a time.
- If you need to read files before proposing a fix, list them in "Files to Read"
- If you have enough context, skip "Files to Read" and go straight to "Fix"`,
    messages: [{ role: "user", content: context }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function implementerFix(
  context: string,
  fileContents: string
): Promise<{ filePath: string; content: string }[]> {
  const response = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `You are a debugging implementer. Based on the analysis and file contents, propose a MINIMAL fix.

Output your fix in this EXACT format (one or more blocks):

### FILE: path/to/file.ts
\`\`\`typescript
(complete file content with fix applied)
\`\`\`

RULES:
- Output the COMPLETE file content, not a diff
- Make the MINIMUM change needed
- Do NOT refactor, clean up, or add features
- Do NOT add comments explaining the fix
- One fix at a time — if the first doesn't work, you'll get another iteration`,
    messages: [{ role: "user", content: context + "\n\n## File Contents\n" + fileContents }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Parse FILE blocks
  const fixes: { filePath: string; content: string }[] = [];
  const filePattern = /### FILE: (.+?)\n```\w*\n([\s\S]*?)```/g;
  let match;
  while ((match = filePattern.exec(text)) !== null) {
    fixes.push({ filePath: match[1].trim(), content: match[2] });
  }

  return fixes;
}

// ─── TESTER AGENT ───────────────────────────────────────────────────────────

async function testerEvaluate(
  bugDescription: string,
  testResult: TestResult
): Promise<{ passed: boolean; explanation: string }> {
  const content: Anthropic.Messages.ContentBlockParam[] = [
    {
      type: "text",
      text: `## Bug Being Fixed
${bugDescription}

## Browser Test Results
- URL: ${testResult.url}
- Console Logs:\n${testResult.consoleLogs.map((l) => `  [${l.type}] ${l.text}`).join("\n") || "  (none)"}
- Console Errors:\n${testResult.consoleErrors.join("\n") || "  (none)"}
- Network Errors:\n${testResult.networkErrors.join("\n") || "  (none)"}
- Page Title: ${testResult.pageTitle}
- Custom Check Result: ${testResult.customCheckResult || "N/A"}

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
    max_tokens: 1000,
    system: `You evaluate whether a bug fix worked based on browser test results and a screenshot.

Output this EXACT format:
VERDICT: PASS or FAIL
EXPLANATION: (1-3 sentences on what you observe)
NEXT: (if FAIL, what to try next — 1 sentence)`,
    messages: [{ role: "user", content }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const passed = text.includes("VERDICT: PASS");
  return { passed, explanation: text };
}

// ─── MAIN LOOP ──────────────────────────────────────────────────────────────

async function main() {
  if (!bug) {
    console.log("Usage: npx tsx debug-loop/run.ts \"description of the bug\"");
    console.log("Flags: --url, --steps, --max, --file");
    process.exit(1);
  }

  console.log("\n🔧 Two-Agent Debug Loop");
  console.log(`   Bug: ${bug}`);
  console.log(`   URL: ${url}`);
  console.log(`   Steps: ${steps}`);
  console.log(`   Max iterations: ${maxIterations}`);
  if (focusFile) console.log(`   Focus file: ${focusFile}`);
  console.log("");

  const structure = getProjectStructure();
  let context = `## Bug Description\n${bug}\n\n## Reproduction\nURL: ${url}\nSteps: ${steps}\n\n## Project Structure (Next.js App Router)\n\`\`\`\n${structure}\`\`\`\n`;

  if (focusFile) {
    context += `\n## Focus File: ${focusFile}\n\`\`\`\n${readProjectFile(focusFile)}\n\`\`\`\n`;
  }

  for (let i = 0; i < maxIterations; i++) {
    console.log(`━━━ Iteration ${i + 1}/${maxIterations} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // Step 1: Implementer analyzes
    console.log("\n🤖 Implementer analyzing...");
    const analysis = await implementerAnalyze(context);
    console.log(analysis);

    // Step 2: Read any requested files
    const fileSection = analysis.match(/## Files to Read\n([\s\S]*?)(?=\n##|$)/);
    let fileContents = "";
    if (fileSection) {
      const files = fileSection[1]
        .trim()
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);
      for (const f of files) {
        const content = readProjectFile(f);
        fileContents += `### ${f}\n\`\`\`\n${content}\n\`\`\`\n\n`;
        console.log(`  📄 Read ${f} (${content.length} chars)`);
      }
    }

    // Step 3: Get the fix
    console.log("\n🤖 Implementer proposing fix...");
    const fixes = await implementerFix(context + "\n\n## Analysis\n" + analysis, fileContents);

    if (fixes.length === 0) {
      console.log("  ⚠️  No fix proposed — implementer may need more context");
      context += `\n### Iteration ${i + 1}\nNo fix proposed.\n`;
      continue;
    }

    // Step 4: Apply fixes
    for (const fix of fixes) {
      writeProjectFile(fix.filePath, fix.content);
    }

    // Step 5: Wait for dev server to pick up changes
    console.log("\n  ⏳ Waiting for dev server to reload (2s)...");
    await new Promise((r) => setTimeout(r, 2000));

    // Step 6: Run browser test
    console.log("\n🌐 Tester running browser check...");
    const testResult = await runBrowserTest(url, steps);
    console.log(
      `  Console: ${testResult.consoleLogs.length} logs, ${testResult.consoleErrors.length} errors`
    );

    // Step 7: Tester evaluates
    console.log("\n🤖 Tester evaluating...");
    const evaluation = await testerEvaluate(bug, testResult);
    console.log(evaluation.explanation);

    // Update context
    context += `\n### Iteration ${i + 1}\n`;
    context += `Fix: ${fixes.map((f) => f.filePath).join(", ")}\n`;
    context += `Console errors: ${testResult.consoleErrors.join("; ") || "none"}\n`;
    context += `Result: ${evaluation.explanation}\n`;

    saveContext(context);

    if (evaluation.passed) {
      console.log(`\n✅ Bug fixed in ${i + 1} iteration(s)!`);
      console.log(`   Files changed: ${fixes.map((f) => f.filePath).join(", ")}`);
      process.exit(0);
    }

    console.log("\n   ❌ Not fixed yet, iterating...\n");
  }

  console.log(`\n⛔ Failed to fix after ${maxIterations} iterations.`);
  console.log(`   Context saved to: ${relative(PROJECT_ROOT, CONTEXT_FILE)}`);
  process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
