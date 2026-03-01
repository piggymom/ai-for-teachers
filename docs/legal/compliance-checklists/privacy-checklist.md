# General Privacy Compliance Checklist — AI for Teachers

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

**Last Reviewed:** [DATE]

---

## Documentation

- [ ] **Privacy policy published** — [IN PROGRESS] Draft in privacy-policy.md; needs legal review and publication at accessible URL
- [ ] **Terms of service published** — [IN PROGRESS] Draft in terms-of-service.md; needs legal review and publication
- [ ] **AI disclosure published** — [IN PROGRESS] Draft in ai-disclosure.md; needs publication
- [ ] **Data audit completed** — [DONE] See data-audit.md
- [ ] **DPA template available** — [IN PROGRESS] Draft in data-processing-agreement.md

## Consent

- [ ] **Consent mechanism in signup flow** — [TODO] Add checkbox: "I have read and agree to the Terms of Service and Privacy Policy"
- [ ] **Consent recorded with timestamp** — [TODO] Store consent record in database (who, what, when)
- [ ] **AI-specific consent** — [TODO] First-time Skippy use: acknowledge AI processing
- [ ] **Pilot consent form** — [IN PROGRESS] Draft in consent/pilot-consent-form.md
- [ ] **Consent withdrawal process defined** — [TODO] Document how users withdraw consent and what happens to their data
- [ ] **Consent renewal on policy changes** — [TODO] Re-consent mechanism when policies change materially

## Data Subject Rights

- [ ] **Data access request process** — [TODO] Define process; implement self-service data export
- [ ] **Data correction process** — [PARTIAL] Profile is editable; no correction for conversation data
- [ ] **Data deletion process** — [TODO] Cascading deletes exist in schema; need user-facing UI
- [ ] **Data portability** — [TODO] Implement JSON data export
- [ ] **Response timeline defined** — [TODO] Commit to 30-day response time
- [ ] **Request tracking** — [TODO] Log and track data subject requests

## Data Minimization

- [x] **Only necessary data collected** — Professional profile fields serve the personalization purpose
- [ ] **Data retention policy defined** — [TODO] Define specific periods for each data type
- [ ] **Automated purging** — [TODO] Implement scheduled deletion of expired data
- [ ] **Minimal data sent to third parties** — [PARTIAL] Only necessary context sent to Anthropic, but full profile context is included
- [ ] **Log sanitization** — [TODO] Remove sensitive data from production console logs

## Third-Party Compliance

- [ ] **Anthropic DPA/terms reviewed** — [TODO] Review Anthropic's data handling terms
- [ ] **OpenAI DPA/terms reviewed** — [TODO] Review OpenAI's data handling terms
- [ ] **Supabase DPA reviewed** — [TODO] Review Supabase's DPA and security practices
- [ ] **Vercel DPA reviewed** — [TODO] Review Vercel's DPA and data handling
- [ ] **HeyGen terms reviewed** — [TODO] Review HeyGen's data handling
- [ ] **Resend terms reviewed** — [TODO] Review Resend's data handling
- [ ] **Google OAuth terms reviewed** — [TODO] Review Google API terms

## Specific Regulations

### COPPA
- [x] **Service not directed at children** — For adult teachers only
- [x] **No collection from children under 13** — Statement in privacy policy
- [ ] **Age gate (if needed)** — [ASSESS] Consider whether any access restriction is needed

### NY Education Law 2-d (if serving NYC teachers)
- [ ] **Requirements reviewed** — [TODO] Review NY Ed Law 2-d applicability to teacher data
- [ ] **Parents' Bill of Rights compliance** — [ASSESS] Determine if applicable when no student data involved
- [ ] **Data security standards met** — [TODO] Review against NIST Cybersecurity Framework requirements

### CCPA / State Privacy Laws
- [ ] **CCPA applicability assessed** — [TODO] Determine if revenue/user thresholds are met
- [ ] **"Do Not Sell" compliance** — [N/A if data is not sold] Confirm and document
- [ ] **Other state laws reviewed** — [TODO] If expanding beyond NY, review state-specific requirements

---

## Priority Actions

1. **Immediate:** Finalize and publish privacy policy and terms of service
2. **Before pilot:** Implement consent recording mechanism
3. **Before pilot:** Add AI processing acknowledgment to first-use flow
4. **Before pilot:** Create pilot consent form and have participants sign
5. **Short-term:** Implement data export and account deletion features
6. **Short-term:** Review all third-party provider terms and DPAs
7. **Medium-term:** Define and implement data retention schedule
8. **Medium-term:** Implement production log sanitization

---

*Last reviewed: [DATE]*
