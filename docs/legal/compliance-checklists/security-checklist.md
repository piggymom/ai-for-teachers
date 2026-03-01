# Security Checklist — AI for Teachers

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

**Last Reviewed:** [DATE]

---

## Encryption

- [x] **Encryption in transit (HTTPS)** — Vercel enforces HTTPS for all traffic
- [x] **Encryption at rest (database)** — Supabase provides encryption at rest for PostgreSQL
- [ ] **Field-level encryption for sensitive data** — [TODO] OAuth tokens (refresh_token, access_token, id_token) stored as plaintext; diagnostic evidence and conversation content are unencrypted
- [x] **API keys stored as environment variables** — Not committed to code; .env in .gitignore

## Authentication & Access Control

- [x] **OAuth 2.0 authentication** — Google OAuth via NextAuth
- [x] **Session-based auth** — Database-backed sessions (not JWT)
- [x] **User-scoped data access** — API routes filter by authenticated userId
- [ ] **Middleware-level route protection** — [TODO] No Next.js middleware for auth; routes handle auth individually
- [ ] **Admin access controls** — [TODO] Define and restrict direct database access
- [ ] **Multi-factor authentication** — [N/A] Relies on Google account MFA settings
- [x] **No password storage** — OAuth only; no local passwords

## API Security

- [ ] **Rate limiting** — [TODO] No rate limiting on API routes currently
- [ ] **Input validation** — [PARTIAL] Basic validation exists; needs comprehensive review
- [x] **TTS text sanitization** — AI text sanitized before sending to OpenAI TTS
- [ ] **CORS configuration** — [TODO] Review and restrict CORS policies
- [x] **Debug endpoints restricted** — `/api/debug/*` returns 403 in production
- [ ] **API key rotation schedule** — [TODO] Define rotation schedule for Anthropic, OpenAI, HeyGen, Resend keys

## Application Security

- [ ] **Dependency vulnerability scanning** — [TODO] Set up automated scanning (npm audit, Snyk, or similar)
- [ ] **Content Security Policy (CSP)** — [TODO] Review and implement CSP headers
- [ ] **XSS protection** — [ASSESS] React provides some built-in protection; review custom rendering
- [ ] **CSRF protection** — [ASSESS] NextAuth provides CSRF tokens; verify coverage
- [ ] **SQL injection protection** — [x] Prisma ORM provides parameterized queries
- [ ] **Pre-commit secret scanning** — [TODO] Add hooks to prevent accidental credential commits

## Infrastructure

- [x] **Managed hosting (Vercel)** — SOC 2 compliant hosting provider
- [x] **Managed database (Supabase)** — SOC 2 compliant database provider
- [ ] **Backup strategy** — [ASSESS] Supabase provides daily backups on paid plans; verify configuration
- [ ] **Disaster recovery plan** — [TODO] Define RTO/RPO and recovery procedures
- [ ] **Environment separation** — [PARTIAL] NODE_ENV controls debug endpoints; ensure full separation

## Logging & Monitoring

- [ ] **Production log sanitization** — [TODO] Console logs contain message previews, user IDs, diagnostic data
- [ ] **Audit logging** — [TODO] Log access to sensitive data (who accessed what, when)
- [ ] **Anomaly detection** — [TODO] Alert on unusual patterns (mass data access, failed auth attempts)
- [ ] **Log retention policy** — [TODO] Define retention per Vercel log settings
- [x] **No PII in client-side logs** — Verified: sensitive data logged server-side only

## Incident Response

- [ ] **Incident response plan documented** — [IN PROGRESS] See incident-response.md
- [ ] **Incident contacts defined** — [TODO] Designate contacts for each role
- [ ] **Breach notification procedures** — [IN PROGRESS] See incident-response.md
- [ ] **Regular incident response drills** — [TODO] Schedule periodic tabletop exercises

## Third-Party Security

- [ ] **Anthropic security posture reviewed** — [TODO] Review SOC 2, data handling
- [ ] **OpenAI security posture reviewed** — [TODO] Review SOC 2, data handling
- [ ] **Supabase security posture reviewed** — [TODO] Review SOC 2, encryption, access controls
- [ ] **Vercel security posture reviewed** — [TODO] Review SOC 2, data handling
- [ ] **Subprocessor security requirements defined** — [TODO] Minimum security standards for providers

## Data Protection

- [x] **Cascading deletes** — User deletion removes all associated data from all tables
- [ ] **Data retention schedule** — [TODO] Define retention periods for each data type
- [ ] **Automated data purging** — [TODO] Implement scheduled deletion jobs
- [ ] **Data export capability** — [TODO] Implement for data portability requests
- [ ] **Account deletion UI** — [TODO] User-facing deletion option

---

## Priority Actions (Ordered)

### Before Pilot
1. Add rate limiting to `/api/skippy` and other API routes
2. Sanitize production console logs (remove message content, diagnostic evidence)
3. Add middleware-level authentication checks
4. Review and fix input validation across all API routes

### Short-Term
5. Implement field-level encryption for OAuth tokens
6. Set up automated dependency vulnerability scanning
7. Add pre-commit hooks for secret detection
8. Review CORS configuration
9. Define API key rotation schedule

### Medium-Term
10. Implement audit logging
11. Set up anomaly detection/alerting
12. Define and implement data retention schedule
13. Implement automated data purging
14. Build data export and account deletion features

### Long-Term
15. Engage professional security auditor for penetration testing
16. Implement Content Security Policy headers
17. Schedule regular security review cadence
18. Consider bug bounty program (when scale warrants)

---

*Last reviewed: [DATE]*
