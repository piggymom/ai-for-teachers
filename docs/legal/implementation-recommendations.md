# Implementation Recommendations — AI for Teachers

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

---

## Code Changes Needed

### Before Pilot (Critical)

#### 1. Add Privacy Policy & Terms of Service Links to Signup Flow
**File:** `app/auth/signin/page.tsx`
**Change:** Add ToS/Privacy Policy links and acceptance checkbox before the Google sign-in button.
```
- Display links to published Privacy Policy and Terms of Service
- Add checkbox: "I have read and agree to the Terms of Service and Privacy Policy"
- Record consent with timestamp in new Consent table
- Block sign-in until checkbox is checked
```

#### 2. Add AI Disclosure in Skippy Chat Interface
**File:** `app/components/skippy-chat.tsx`
**Change:** Show first-time AI processing consent and persistent footer.
```
- First conversation: modal/banner acknowledging AI processing (see consent-flow.md)
- Persistent footer: "Skippy is AI-powered. Responses may be inaccurate. Review before classroom use."
- Record AI consent with timestamp
```

#### 3. Add "No Student PII" Guidance
**Files:** `app/components/skippy-chat.tsx`, onboarding flow
**Change:**
```
- Add reminder near chat input: "Do not share student names or identifiable information"
- Include acknowledgment in onboarding: "I agree not to share student PII"
```

#### 4. Add Consent Database Table
**File:** `prisma/schema.prisma`
**Change:** Add Consent model to track user agreements.
```prisma
model Consent {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // "tos_pp", "ai_processing", "audio_features", "pilot_participation"
  version   String
  granted   Boolean  @default(true)
  timestamp DateTime @default(now())

  @@index([userId])
  @@index([type])
}
```

#### 5. Sanitize Production Console Logs
**Files:** `app/api/skippy/route.ts`, `lib/ledger.ts`, `app/api/podcast/route.ts`, `app/api/contact/route.ts`
**Change:**
```
- Wrap sensitive console.log calls in NODE_ENV !== "production" checks
- Remove message content previews from production logs
- Remove diagnostic evidence from production logs
- Keep timing metrics and non-sensitive operational logs
```

#### 6. Add Rate Limiting
**File:** New middleware or per-route
**Change:**
```
- Add rate limiting to /api/skippy (e.g., 60 requests per user per hour)
- Add rate limiting to /api/podcast (e.g., 5 requests per user per hour)
- Add rate limiting to /api/tts (e.g., 30 requests per user per hour)
- Add rate limiting to /api/contact (e.g., 5 requests per IP per hour)
```

### Short-Term (Within 1 Month of Pilot Start)

#### 7. Implement Data Export (Download My Data)
**Files:** New API route `app/api/user/export/route.ts`, settings UI
**Change:**
```
- API endpoint that collects all user data (profile, messages, ledgers, artifacts, progress)
- Returns as downloadable JSON file
- Add button in user settings: "Download My Data"
```

#### 8. Implement Account Deletion
**Files:** New API route `app/api/user/delete/route.ts`, settings UI
**Change:**
```
- API endpoint that deletes user account (cascading deletes handle associated data)
- Confirmation dialog with warning
- Sign out after deletion
- Add button in user settings: "Delete My Account"
```

#### 9. Add Authentication Middleware
**File:** `middleware.ts` (new, at project root)
**Change:**
```
- Protect all /api/* routes (except /api/auth/*)
- Protect all /home/*, /week/* routes
- Redirect unauthenticated users to /auth/signin
```

#### 10. Publish Legal Documents
**Change:**
```
- Host Privacy Policy at /privacy (or /legal/privacy)
- Host Terms of Service at /terms (or /legal/terms)
- Host AI Disclosure at /ai-disclosure (or /legal/ai-disclosure)
- Add footer links on all pages
```

### Medium-Term (Within 3 Months)

#### 11. Field-Level Encryption for Sensitive Data
**Files:** `lib/auth.ts`, Prisma middleware or custom encryption layer
**Change:**
```
- Encrypt OAuth tokens (refresh_token, access_token, id_token) before storage
- Encrypt diagnosticEvidence field
- Decrypt on read
- Use a KMS or secure key management approach
```

#### 12. Re-Consent Flow for Policy Updates
**Files:** Auth/session middleware, consent UI
**Change:**
```
- On login, check if user's last consent version matches current version
- If outdated, show re-consent dialog before allowing access
- Record new consent
```

#### 13. Audit Logging
**File:** New middleware or utility
**Change:**
```
- Log data access events (who accessed what data, when)
- Store in separate audit log table
- Include: userId, action, resource, timestamp
```

---

## Process Changes Needed

### Before Pilot

- [ ] **Form LLC** — See entity-recommendations.md (estimated 1–4 weeks)
- [ ] **Engage legal counsel** — At minimum, have an attorney review the privacy policy and terms of service
- [ ] **Define data retention schedule** — Decide how long to keep conversations, assessments, artifacts
- [ ] **Create incident response contacts** — Designate who handles security incidents
- [ ] **Execute Supabase DPA** — Sign Supabase's standard DPA
- [ ] **Review Anthropic API terms** — Confirm compliance with acceptable use policy
- [ ] **Collect pilot consent forms** — All pilot participants sign consent form (digital or physical)
- [ ] **Purchase professional liability insurance** — Errors & omissions (E&O) coverage

### Short-Term

- [ ] **Establish consent record-keeping process** — How consents are stored, queried, and audited
- [ ] **Define data subject request process** — How to handle access/deletion/correction requests; who processes them, timeline
- [ ] **Execute Vercel DPA** — Sign Vercel's standard DPA
- [ ] **Review all third-party terms** — Complete review per third-party-review.md
- [ ] **Set up dependency vulnerability scanning** — npm audit or Snyk on CI
- [ ] **Add pre-commit hooks for secret scanning** — Prevent accidental credential commits

### Ongoing

- [ ] **Quarterly review of legal documents** — Update as service evolves
- [ ] **Annual security review** — Re-assess security posture and compliance
- [ ] **Monitor provider terms changes** — Watch for updates to Anthropic, OpenAI, Supabase, Vercel terms
- [ ] **Update subprocessor list** — When adding/removing third-party services

---

## Items Requiring Professional Legal Review

### Priority 1 — Before Pilot Launch

| # | Document / Issue | Why Legal Review is Essential |
|---|-----------------|-------------------------------|
| 1 | **Privacy Policy** (privacy-policy.md) | Must be legally accurate for the jurisdiction; errors create liability |
| 2 | **Terms of Service** (terms-of-service.md) | Limitation of liability, indemnification, and IP clauses need attorney drafting |
| 3 | **Pilot Consent Form** (consent/pilot-consent-form.md) | Must be legally valid consent; affects ability to use data |
| 4 | **Entity Formation** (entity-recommendations.md) | State-specific requirements; tax implications; operating agreement |
| 5 | **FERPA compliance posture** | Attorney should confirm that the "no student data" position is defensible given teachers may discuss students |

### Priority 2 — Before Scaling Beyond Pilot

| # | Document / Issue | Why Legal Review is Essential |
|---|-----------------|-------------------------------|
| 6 | **Data Processing Agreement** (data-processing-agreement.md) | Districts will negotiate DPAs; need attorney-reviewed template |
| 7 | **AI Disclosure** (ai-disclosure.md) | Evolving AI regulation; need to confirm compliance with emerging laws |
| 8 | **Incident Response Plan** (incident-response.md) | Notification obligations are legally defined; errors have consequences |
| 9 | **Anthropic acceptable use compliance** | Confirm SOLO taxonomy assessment doesn't violate "decisions affecting legal rights" |
| 10 | **Insurance coverage** | Professional liability, cyber liability — what coverage is appropriate |

### Priority 3 — Ongoing

| # | Document / Issue | Why Legal Review is Essential |
|---|-----------------|-------------------------------|
| 11 | **State-specific education privacy laws** | Each state has different requirements (NY Ed Law 2-d, CA, etc.) |
| 12 | **AI regulation compliance** | Rapidly evolving landscape; federal and state AI laws |
| 13 | **Nonprofit conversion** (if pursued) | Complex legal and tax process |
| 14 | **Intellectual property strategy** | Trademark for "Skippy" / "AI for Teachers"; copyright for curriculum |

---

## Estimated Timeline

```
Week 1-2:  Form LLC, engage attorney
Week 2-3:  Attorney reviews Privacy Policy + Terms of Service
Week 3:    Implement consent UI and database changes
Week 3:    Sanitize production logs, add rate limiting
Week 4:    Publish legal documents, collect pilot consents
Week 4:    PILOT LAUNCH
Week 5-8:  Implement data export, account deletion, auth middleware
Week 8-12: Field-level encryption, audit logging, re-consent flow
```

---

## Cost Estimates

| Item | Estimated Cost |
|------|---------------|
| LLC formation (NY) | $200–$800 (filing + publication) |
| Attorney review (Privacy Policy + ToS) | $1,000–$3,000 |
| Attorney review (DPA + consent forms) | $500–$1,500 |
| Professional liability insurance (annual) | $500–$2,000 |
| Cyber liability insurance (annual) | $500–$1,500 |
| **Total estimated pre-pilot legal costs** | **$2,700–$8,800** |

---

## Document Index

| # | Document | Path | Status |
|---|----------|------|--------|
| 1 | Data Audit | `docs/legal/data-audit.md` | Draft complete |
| 2 | Privacy Policy | `docs/legal/privacy-policy.md` | Draft — needs legal review |
| 3 | Terms of Service | `docs/legal/terms-of-service.md` | Draft — needs legal review |
| 4 | Data Processing Agreement | `docs/legal/data-processing-agreement.md` | Draft — needs legal review |
| 5 | AI Disclosure | `docs/legal/ai-disclosure.md` | Draft — needs legal review |
| 6 | FERPA Checklist | `docs/legal/compliance-checklists/ferpa-checklist.md` | Draft complete |
| 7 | Privacy Checklist | `docs/legal/compliance-checklists/privacy-checklist.md` | Draft complete |
| 8 | Security Checklist | `docs/legal/compliance-checklists/security-checklist.md` | Draft complete |
| 9 | Consent Flow | `docs/legal/consent/consent-flow.md` | Draft complete |
| 10 | Pilot Consent Form | `docs/legal/consent/pilot-consent-form.md` | Draft — needs legal review |
| 11 | Incident Response Plan | `docs/legal/incident-response.md` | Draft complete |
| 12 | Third-Party Review | `docs/legal/third-party-review.md` | Draft — needs review of actual terms |
| 13 | Entity Recommendations | `docs/legal/entity-recommendations.md` | Draft — needs attorney consultation |
| 14 | Implementation Recommendations | `docs/legal/implementation-recommendations.md` | This document |

---

*This document was last reviewed on [DATE].*
