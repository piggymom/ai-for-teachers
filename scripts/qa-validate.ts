/**
 * QA Validation Script
 * Tests configuration, imports, interpolation, and cross-file consistency.
 * Run with: npx tsx scripts/qa-validate.ts
 */

import { modulePrompts, weekConfigs, weekArtifactMeta, getWeekConfig, getModulePrompt, getWeekTitle } from "../lib/modules";

// ============================================================
// Test Utilities
// ============================================================

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(test: boolean, label: string) {
  if (test) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    failures.push(label);
    console.log(`  ✗ FAIL: ${label}`);
  }
}

// ============================================================
// 1. Module Prompt Validation
// ============================================================

console.log("\n=== 1. MODULE PROMPTS ===");

const expectedTitles: Record<number, string> = {
  0: "Getting Started",
  1: "Understanding AI in Teaching",
  2: "Prompting Fundamentals",
  3: "Lesson Planning with AI",
  4: "Feedback & Assessment",
  5: "Differentiation with AI",
  6: "Integration & Ethics",
};

for (let week = 0; week <= 6; week++) {
  const mod = modulePrompts[week];
  assert(!!mod, `Week ${week} exists in modulePrompts`);
  assert(mod?.week === week, `Week ${week} has correct week number`);
  assert(mod?.title === expectedTitles[week], `Week ${week} title: "${mod?.title}" === "${expectedTitles[week]}"`);
  assert(typeof mod?.prompt === "string" && mod.prompt.length > 100, `Week ${week} has substantial prompt (${mod?.prompt?.length} chars)`);
  assert(typeof mod?.openingMessage === "string" && mod.openingMessage.length > 20, `Week ${week} has opening message`);
  assert(mod?.openingMessage?.includes("{{name}}"), `Week ${week} opening message uses {{name}} placeholder`);
}

// ============================================================
// 2. Week Config Validation
// ============================================================

console.log("\n=== 2. WEEK CONFIGS ===");

const expectedConfigs: Record<number, { maxExchanges: number; trackFourC: boolean; artifactType: string | null }> = {
  0: { maxExchanges: 5, trackFourC: false, artifactType: "profile" },
  1: { maxExchanges: 15, trackFourC: false, artifactType: "understanding" },
  2: { maxExchanges: 18, trackFourC: true, artifactType: "prompt_template" },
  3: { maxExchanges: 18, trackFourC: true, artifactType: "lesson_template" },
  4: { maxExchanges: 18, trackFourC: true, artifactType: "feedback_template" },
  5: { maxExchanges: 18, trackFourC: true, artifactType: "differentiation_template" },
  6: { maxExchanges: 18, trackFourC: false, artifactType: "policy" },
};

for (let week = 0; week <= 6; week++) {
  const config = weekConfigs[week];
  const expected = expectedConfigs[week];
  assert(!!config, `Week ${week} has config entry`);
  assert(config?.maxExchanges === expected.maxExchanges, `Week ${week} maxExchanges: ${config?.maxExchanges} === ${expected.maxExchanges}`);
  assert(config?.trackFourC === expected.trackFourC, `Week ${week} trackFourC: ${config?.trackFourC} === ${expected.trackFourC}`);
  assert(config?.artifactType === expected.artifactType, `Week ${week} artifactType: "${config?.artifactType}" === "${expected.artifactType}"`);
}

// getWeekConfig fallback
const fallback = getWeekConfig(99);
assert(fallback.maxExchanges === 18, "Default config maxExchanges is 18");
assert(fallback.trackFourC === false, "Default config trackFourC is false");
assert(fallback.artifactType === null, "Default config artifactType is null");

// ============================================================
// 3. Artifact Metadata Validation
// ============================================================

console.log("\n=== 3. ARTIFACT METADATA ===");

const expectedMeta: Record<number, { type: string; displayName: string }> = {
  0: { type: "profile", displayName: "My Teaching Profile" },
  1: { type: "understanding", displayName: "My AI Understanding Card" },
  2: { type: "prompt_template", displayName: "My First Prompt Template" },
  3: { type: "lesson_template", displayName: "Lesson Planning Template" },
  4: { type: "feedback_template", displayName: "Feedback Template" },
  5: { type: "differentiation_template", displayName: "Differentiation Template" },
  6: { type: "policy", displayName: "My Personal AI Policy" },
};

for (let week = 0; week <= 6; week++) {
  const meta = weekArtifactMeta[week];
  const expected = expectedMeta[week];
  assert(!!meta, `Week ${week} has artifact metadata`);
  assert(meta?.type === expected.type, `Week ${week} artifact type: "${meta?.type}" === "${expected.type}"`);
  assert(meta?.displayName === expected.displayName, `Week ${week} display name: "${meta?.displayName}" === "${expected.displayName}"`);
  assert(Array.isArray(meta?.tags) && meta.tags.length >= 2, `Week ${week} has ${meta?.tags?.length} tags`);

  // Artifact type consistency: weekConfig.artifactType should match weekArtifactMeta.type
  const config = weekConfigs[week];
  assert(config?.artifactType === meta?.type, `Week ${week} config/meta type match: "${config?.artifactType}" === "${meta?.type}"`);
}

// ============================================================
// 4. Prompt Content Validation
// ============================================================

console.log("\n=== 4. PROMPT CONTENT ===");

// Week 0 specific
const w0 = modulePrompts[0].prompt;
assert(w0.includes("NOT teach"), "Week 0: says NOT to teach");
assert(w0.includes("NOT explain how AI works"), "Week 0: no AI explanations");
assert(w0.includes("5 minutes") || w0.includes("3-5 exchanges"), "Week 0: short session");

// Week 1 specific
const w1 = modulePrompts[1].prompt;
assert(w1.includes("mental model"), "Week 1: mentions mental model");
assert(w1.includes("pattern") || w1.includes("prediction"), "Week 1: covers prediction concept");
assert(w1.includes("micro-prompt") || w1.includes("Micro-Prompt") || w1.includes("tiny experiment"), "Week 1: has micro-prompt bridge exercise");
assert(w1.includes("AI UNDERSTANDING CARD") || w1.includes("Understanding Card"), "Week 1: has AI Understanding Card artifact");
assert(w1.includes("Goal Alignment"), "Week 1: has Goal Alignment section");
assert(w1.includes("Missing Profile Data") || w1.includes("Handling Missing"), "Week 1: has missing profile data handling");

// Week 2 specific
const w2 = modulePrompts[2].prompt;
assert(w2.includes("Context") && w2.includes("Constraints") && w2.includes("Command") && w2.includes("Criteria"), "Week 2: has all 4C components");
assert(w2.includes("Goal Alignment"), "Week 2: has Goal Alignment section");

// Week 3 specific
const w3 = modulePrompts[3].prompt;
assert(w3.includes("Driver's Seat"), "Week 3: has Driver's Seat Model");
assert(w3.includes("iteration") || w3.includes("Iteration"), "Week 3: has iteration concept");
assert(w3.includes("ITERATION MOVES") || w3.includes("iteration moves"), "Week 3: artifact has iteration moves");
assert(w3.includes("prompting CONVERSATION") || w3.includes("prompting isn't one-and-done"), "Week 3: progressive difficulty in ORIENT");
assert(w3.includes("Goal Alignment"), "Week 3: has Goal Alignment section");

// Week 4 specific
const w4 = modulePrompts[4].prompt;
assert(w4.includes("Feedback Flow") || (w4.includes("ANALYZE") && w4.includes("DRAFT") && w4.includes("PERSONALIZE")), "Week 4: has Feedback Flow");
assert(w4.includes("calibrat") || w4.includes("Calibrat"), "Week 4: has calibration concept");
assert(w4.includes("anchor") || w4.includes("Anchor"), "Week 4: has anchor examples");
assert(w4.includes("ANCHOR EXAMPLES") || w4.includes("Anchor Examples"), "Week 4: artifact has anchor examples section");
assert(w4.includes("consistency") || w4.includes("consistent"), "Week 4: progressive difficulty in ORIENT");
assert(w4.includes("Goal Alignment"), "Week 4: has Goal Alignment section");

// Week 5 specific
const w5 = modulePrompts[5].prompt;
assert(w5.includes("Access") && w5.includes("Rigor"), "Week 5: has Access vs Rigor");
assert(w5.includes("Deliberate Variation") || w5.includes("deliberate variation"), "Week 5: has deliberate variation concept");
assert(w5.includes("VARIATION DIMENSIONS") || w5.includes("Variation Dimensions"), "Week 5: artifact has variation dimensions");
assert(w5.includes("Needs-to-Supports") || w5.includes("needs to specific AI"), "Week 5: has needs-to-supports matrix");
assert(w5.includes("complexity") || w5.includes("systematic"), "Week 5: progressive difficulty in ORIENT");
assert(w5.includes("Goal Alignment"), "Week 5: has Goal Alignment section");

// Week 6 specific
const w6 = modulePrompts[6].prompt;
assert(w6.includes("Three Questions") || (w6.includes("WHERE") && w6.includes("HOW") && w6.includes("WHAT")), "Week 6: has Three Questions framework");
assert(w6.includes("Responsibility") || w6.includes("RESPONSIBILITIES"), "Week 6: has Responsibility Stack");
assert(w6.includes("Students Need") || w6.includes("students need to know"), "Week 6: has student-facing section");
assert(w6.includes("Completion Detection"), "Week 6: has completion detection section");
assert(w6.includes("Personal AI Policy") || w6.includes("PERSONAL AI POLICY"), "Week 6: has personal AI policy artifact");
assert(w6.includes("MY STUDENTS NEED TO KNOW") || w6.includes("Students Need"), "Week 6: artifact includes students section");
assert(w6.includes("Goal Alignment"), "Week 6: has Goal Alignment section");

// ============================================================
// 5. Conversation Phases Per Week
// ============================================================

console.log("\n=== 5. CONVERSATION PHASES ===");

// Week 0: No BUILD/REFINE/REFLECT
assert(!w0.includes("Phase 3: BUILD") && !w0.includes("REFINE") && !w0.includes("REFLECT"), "Week 0: no BUILD/REFINE/REFLECT phases");
assert(w0.includes("Bridge to Week 1") || w0.includes("Bridge"), "Week 0: has bridge to Week 1");

// Week 1: No REFINE
assert(w1.includes("DISCOVER") && w1.includes("ORIENT") && w1.includes("BUILD") && w1.includes("REFLECT") && w1.includes("BRIDGE"), "Week 1: has DISCOVER/ORIENT/BUILD/REFLECT/BRIDGE");
assert(w1.includes("No REFINE") || !w1.match(/Phase \d: REFINE/), "Week 1: no REFINE phase");

// Weeks 2-5: All phases including REFINE
for (const [weekNum, prompt] of [[3, w3], [4, w4], [5, w5]] as [number, string][]) {
  assert(
    prompt.includes("DISCOVER") && prompt.includes("ORIENT") && prompt.includes("BUILD") &&
    prompt.includes("REFINE") && prompt.includes("REFLECT") && prompt.includes("BRIDGE"),
    `Week ${weekNum}: has all 6 phases`
  );
}

// Week 6: CLOSE instead of BRIDGE, no REFINE
assert(w6.includes("DISCOVER") && w6.includes("ORIENT") && w6.includes("BUILD") && w6.includes("REFLECT"), "Week 6: has DISCOVER/ORIENT/BUILD/REFLECT");
assert(w6.includes("CLOSE") || w6.includes("Close"), "Week 6: has CLOSE phase");
assert(w6.includes("No REFINE"), "Week 6: explicitly no REFINE");

// ============================================================
// 6. Helper Function Validation
// ============================================================

console.log("\n=== 6. HELPER FUNCTIONS ===");

assert(getModulePrompt(0)?.title === "Getting Started", "getModulePrompt(0) returns Week 0");
assert(getModulePrompt(6)?.title === "Integration & Ethics", "getModulePrompt(6) returns Week 6");
assert(getModulePrompt(99) === null, "getModulePrompt(99) returns null");

assert(getWeekTitle(3) === "Lesson Planning with AI", "getWeekTitle(3) correct");
assert(getWeekTitle(99) === "Week 99", "getWeekTitle(99) falls back gracefully");

// ============================================================
// SUMMARY
// ============================================================

console.log("\n" + "=".repeat(50));
console.log(`RESULTS: ${passed} passed, ${failed} failed (${Math.round(passed / (passed + failed) * 100)}%)`);
if (failures.length > 0) {
  console.log("\nFAILURES:");
  failures.forEach(f => console.log(`  ✗ ${f}`));
}
console.log("=".repeat(50));

process.exit(failed > 0 ? 1 : 0);
