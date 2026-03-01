# FERPA Compliance Checklist — AI for Teachers

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

**Last Reviewed:** [DATE]

---

## Overview

FERPA (Family Educational Rights and Privacy Act) protects the privacy of student education records. While AI for Teachers serves teachers (not students), FERPA considerations arise if teachers discuss identifiable students during conversations with Skippy.

---

## Checklist

### Direct Student Data

- [x] **No student PII collected directly** — The platform does not have fields for student names, IDs, grades, or other student-specific data
- [x] **No student accounts** — Only teacher accounts exist; students cannot sign up
- [x] **No student-facing features** — The Service is not designed for student use
- [ ] **Content filter for student PII** — [TODO] Implement warning/filter when teachers type potential student names or identifiers in chat
- [x] **Privacy Policy states no student data collected** — Documented in privacy-policy.md

### Teacher Content About Students

- [ ] **Policy defined for incidental student references** — [TODO] Teachers must be instructed not to share student PII. Add guidance to onboarding and chat UI
- [ ] **In-app reminder** — [TODO] Add persistent reminder in chat interface: "Do not share student names or identifiable information"
- [ ] **Onboarding acknowledgment** — [TODO] Include in pilot consent form: teacher agrees not to share student PII
- [ ] **Handling procedure if student PII is shared** — [TODO] Define process: identify, flag, delete incidental student data

### Data Sharing

- [x] **No student data shared with third parties** — No student data exists to share
- [x] **Teacher data not shared with schools/districts** — Unless DPA requires it
- [ ] **DPA template available for districts** — [IN PROGRESS] See data-processing-agreement.md
- [ ] **Directory information handling documented** — [TODO] Not applicable (no student data), but document this explicitly

### Access Controls

- [x] **Authentication required** — Google OAuth for all data access
- [x] **User-scoped data** — Teachers can only access their own data
- [ ] **Admin access controls** — [TODO] Define who can access the database directly and under what circumstances
- [ ] **Audit logging** — [TODO] Implement logging of data access events

### School Official Exception

- [x] **Not claiming "school official" status** — AI for Teachers is not operating under the school official exception to FERPA
- [ ] **DPA addresses FERPA** — [IN PROGRESS] DPA template includes FERPA provisions

### Data Breach

- [ ] **Incident response includes FERPA considerations** — [IN PROGRESS] See incident-response.md
- [ ] **Notification procedures for districts** — [TODO] If student PII is inadvertently involved, procedures for notifying the school/district

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Teacher shares student name in chat | **High** | Medium | In-app guidance, onboarding acknowledgment, [future: content filter] |
| Student data stored in conversation logs | **High** (if above occurs) | High | Retention policy, deletion procedures, guidance |
| Conversation data sent to Anthropic containing student refs | **High** (if above occurs) | Medium | Anthropic does not train on API data; 30-day retention |
| District requires FERPA compliance proof | Medium | Medium | DPA template, this checklist, documentation |

---

## Action Items

1. **Before pilot:** Add "no student PII" guidance to onboarding flow and chat UI
2. **Before pilot:** Include acknowledgment in pilot consent form
3. **Short-term:** Define procedure for handling incidental student data
4. **Medium-term:** Consider content filtering for common PII patterns (names + grade combos)
5. **Ongoing:** Train on FERPA requirements as they evolve

---

*Last reviewed: [DATE]*
