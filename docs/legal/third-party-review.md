# Third-Party Agreements Review — AI for Teachers

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

**Last Reviewed:** [DATE]

---

## Overview

AI for Teachers depends on several third-party services. This document summarizes their relevant terms and identifies potential concerns.

**[ACTION REQUIRED]:** Review the actual current terms for each service. The summaries below are based on publicly available information as of early 2026 and may not reflect the latest updates.

---

## 1. Anthropic (Claude API)

**Service:** AI language model powering Skippy tutor
**Data Sent:** Teacher name, professional context, conversation messages (last 10), readiness assessment
**Billing:** Pay-per-token (API usage)

### Key Terms Summary

| Topic | Policy |
|-------|--------|
| **Data training** | API data is NOT used to train models (per Anthropic's usage policy) |
| **Data retention** | May retain API inputs/outputs for up to 30 days for trust & safety |
| **Data sharing** | Does not share customer data with third parties for advertising |
| **Security** | SOC 2 Type II certified |
| **Acceptable use** | Prohibited uses include: deception, surveillance, decisions that affect legal rights |
| **Content ownership** | Customer retains rights to inputs; Anthropic does not claim ownership of outputs |
| **Liability** | Standard limitation of liability; no warranty on output accuracy |

### Concerns & Actions

| # | Concern | Action |
|---|---------|--------|
| 1 | 30-day data retention for trust & safety — teacher conversations could be reviewed by Anthropic staff | Disclose in privacy policy; confirm exact retention terms with Anthropic |
| 2 | Acceptable use policy prohibits certain educational assessment uses | Verify that SOLO taxonomy readiness assessment does not violate "decisions affecting legal rights" clause |
| 3 | No uptime SLA for standard API tier | Consider impact on Service availability; disclose in Terms |
| 4 | Terms may change — model behavior can change between versions | Pin model version; monitor for terms changes |

### Links to Review
- [ ] Anthropic API Terms of Service: https://www.anthropic.com/api-terms
- [ ] Anthropic Usage Policy: https://www.anthropic.com/usage-policy
- [ ] Anthropic Privacy Policy: https://www.anthropic.com/privacy

---

## 2. OpenAI (TTS & Realtime API)

**Service:** Text-to-speech for Skippy voice, podcast generation, realtime voice (currently disabled)
**Data Sent:** AI-generated text (not raw user messages), podcast scripts, system prompts (for realtime)
**Billing:** Pay-per-character (TTS), pay-per-session (Realtime)

### Key Terms Summary

| Topic | Policy |
|-------|--------|
| **Data training** | API data is NOT used to train models (per API data usage policy) |
| **Data retention** | Inputs and outputs retained for up to 30 days for abuse monitoring |
| **Security** | SOC 2 Type II certified |
| **Content ownership** | Customer retains rights to outputs generated via API |
| **Usage limits** | Rate limits apply; burst usage may be throttled |

### Concerns & Actions

| # | Concern | Action |
|---|---------|--------|
| 1 | Podcast scripts are derived from conversation content — effectively sends conversation summaries to OpenAI | Disclose in privacy policy that audio features involve OpenAI |
| 2 | Realtime API (if enabled) would send full system prompt including teacher profile | Assess data exposure if realtime feature is re-enabled |
| 3 | TTS voice quality and availability may change | Not critical; cosmetic impact only |

### Links to Review
- [ ] OpenAI API Terms: https://openai.com/policies/terms-of-use
- [ ] OpenAI API Data Usage Policy: https://openai.com/policies/api-data-usage-policies
- [ ] OpenAI Privacy Policy: https://openai.com/policies/privacy-policy

---

## 3. Supabase (Database Hosting)

**Service:** PostgreSQL database hosting (all application data)
**Data Stored:** All user data — profiles, messages, assessments, artifacts, auth tokens
**Billing:** Usage-based plan

### Key Terms Summary

| Topic | Policy |
|-------|--------|
| **Data ownership** | Customer owns all data; Supabase processes on customer's behalf |
| **Encryption at rest** | AES-256 encryption |
| **Encryption in transit** | TLS 1.2+ |
| **DPA available** | Yes — Supabase offers a DPA for GDPR/compliance |
| **SOC 2** | SOC 2 Type II certified |
| **Data residency** | Configurable by region (currently US) |
| **Backups** | Daily backups on Pro plan and above |
| **Deletion** | Customer can delete project; data removed within retention period |

### Concerns & Actions

| # | Concern | Action |
|---|---------|--------|
| 1 | Verify which Supabase plan is active and whether daily backups are enabled | Check plan tier and backup settings |
| 2 | Supabase DPA should be signed if handling regulated data | Execute Supabase DPA |
| 3 | Direct database access (via connection string) has no built-in audit logging | Implement application-level audit logging |
| 4 | Supabase dashboard access = access to all user data | Restrict dashboard access; use strong authentication |

### Links to Review
- [ ] Supabase Terms of Service: https://supabase.com/terms
- [ ] Supabase Privacy Policy: https://supabase.com/privacy
- [ ] Supabase DPA: https://supabase.com/legal/dpa
- [ ] Supabase Security: https://supabase.com/security

---

## 4. Vercel (Application Hosting)

**Service:** Next.js application hosting, edge functions, logging
**Data Processed:** All HTTP traffic, server-side console logs
**Billing:** Usage-based plan

### Key Terms Summary

| Topic | Policy |
|-------|--------|
| **Data ownership** | Customer owns application data |
| **DPA available** | Yes — Vercel offers a DPA |
| **SOC 2** | SOC 2 Type II certified |
| **Log retention** | Varies by plan; runtime logs typically 1 hour on free/hobby, longer on Pro/Enterprise |
| **Data residency** | Configurable region selection |
| **CDN** | Edge network caches static assets globally |

### Concerns & Actions

| # | Concern | Action |
|---|---------|--------|
| 1 | Console logs containing sensitive data (message previews, diagnostics) are captured by Vercel | Sanitize production logs; verify Vercel log retention period |
| 2 | Verify log retention period on current plan | Check Vercel dashboard; may need to upgrade for longer retention (for incident investigation) or ensure shorter retention (for privacy) |
| 3 | Vercel DPA should be executed | Sign Vercel DPA |

### Links to Review
- [ ] Vercel Terms of Service: https://vercel.com/legal/terms
- [ ] Vercel Privacy Policy: https://vercel.com/legal/privacy-policy
- [ ] Vercel DPA: https://vercel.com/legal/dpa

---

## 5. Google (OAuth Authentication)

**Service:** Google OAuth 2.0 for user sign-in
**Data Received:** User name, email, profile photo, OAuth tokens
**Billing:** Free (within OAuth API limits)

### Key Terms Summary

| Topic | Policy |
|-------|--------|
| **Data received** | Name, email, profile photo (per requested scopes) |
| **Limited Use** | Must comply with Google API Services User Data Policy and Limited Use requirements |
| **Consent** | Users consent via Google's OAuth consent screen |
| **Verification** | OAuth apps may need Google verification for sensitive scopes |

### Concerns & Actions

| # | Concern | Action |
|---|---------|--------|
| 1 | Google's Limited Use policy restricts what you can do with OAuth data | Verify compliance — data should only be used for authentication purpose stated in consent screen |
| 2 | OAuth app may need verification if requesting sensitive scopes or serving many users | Check verification status; submit for review if needed before scaling |
| 3 | OAuth tokens stored in database without field-level encryption | Implement encryption for stored tokens |

### Links to Review
- [ ] Google API Terms of Service: https://developers.google.com/terms
- [ ] Google API Services User Data Policy: https://developers.google.com/terms/api-services-user-data-policy
- [ ] Google OAuth documentation: https://developers.google.com/identity/protocols/oauth2

---

## 6. HeyGen (Video Generation)

**Service:** AI avatar video generation for personalized welcome videos
**Data Sent:** Personalized welcome script (derived from teacher profile)
**Billing:** Pay-per-video or subscription

### Key Terms Summary

| Topic | Policy |
|-------|--------|
| **Data handling** | Scripts processed to generate video; review HeyGen's specific retention policy |
| **Content ownership** | Typically customer retains rights to generated videos |
| **Privacy** | Review HeyGen's privacy policy for data handling details |

### Concerns & Actions

| # | Concern | Action |
|---|---------|--------|
| 1 | Personalized scripts contain profile-derived information (name, role, subjects) | Review what profile data is included in scripts; minimize to essentials |
| 2 | HeyGen's data retention for generated scripts/videos is unclear | Review HeyGen terms; confirm retention and deletion policy |
| 3 | HeyGen is a less established service compared to Anthropic/OpenAI — higher risk of terms changes or service discontinuation | Have fallback plan; don't make welcome video a critical feature |

### Links to Review
- [ ] HeyGen Terms of Service: https://www.heygen.com/terms
- [ ] HeyGen Privacy Policy: https://www.heygen.com/privacy

---

## 7. Resend (Email Delivery)

**Service:** Transactional email for support contact form
**Data Sent:** Teacher name, email, message content, user ID
**Billing:** Free tier / paid plan

### Key Terms Summary

| Topic | Policy |
|-------|--------|
| **Data handling** | Processes email content for delivery |
| **Data retention** | Email logs retained per Resend's policy |
| **Security** | TLS encryption for email delivery |

### Concerns & Actions

| # | Concern | Action |
|---|---------|--------|
| 1 | Support messages may contain sensitive information | Minimize data in emails; consider in-app support instead |
| 2 | Resend retains email logs | Review retention period; disclose in privacy policy |

### Links to Review
- [ ] Resend Terms of Service: https://resend.com/legal/terms-of-service
- [ ] Resend Privacy Policy: https://resend.com/legal/privacy-policy

---

## Summary of Required Actions

### Immediate (Before Pilot)
1. Review Anthropic API Terms — confirm 30-day retention, verify assessment use is compliant
2. Review OpenAI API Terms — confirm data handling for TTS
3. Verify Supabase plan tier and backup configuration

### Short-Term
4. Execute DPAs with: Supabase, Vercel (and any others that offer them)
5. Review Google Limited Use policy compliance
6. Review HeyGen terms for data retention

### Ongoing
7. Monitor all providers for terms changes
8. Re-review annually or when terms are updated
9. Update subprocessor list in DPA when providers change

---

## Conflict/Concern Matrix

| Potential Conflict | Providers | Severity | Resolution |
|-------------------|-----------|----------|------------|
| Data retention longer than user expects | Anthropic (30d), OpenAI (30d) | Medium | Disclose in privacy policy |
| Assessment data used in ways that could violate acceptable use | Anthropic | Medium | Legal review of SOLO taxonomy use vs. "decisions affecting rights" |
| Sensitive data in logs captured by hosting provider | Vercel | High | Sanitize production logs |
| Profile data sent to video generation service | HeyGen | Low | Minimize script content |
| Email content retained by email provider | Resend | Low | Minimize sensitive data in support emails |

---

*This review was last updated on [DATE].*
