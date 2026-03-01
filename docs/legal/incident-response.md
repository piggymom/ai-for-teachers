# Incident Response Plan — AI for Teachers

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

**Version:** 1.0
**Last Updated:** [DATE]
**Owner:** [ENTITY NAME]

---

## 1. Purpose

This plan defines how AI for Teachers responds to data security incidents, including breaches of personal data, unauthorized access, and service disruptions that affect user data.

---

## 2. Definitions

| Term | Definition |
|------|-----------|
| **Data Incident** | Any event that compromises the confidentiality, integrity, or availability of Personal Data |
| **Data Breach** | A Data Incident that results in unauthorized access to, disclosure of, or loss of Personal Data |
| **Near Miss** | An event that could have resulted in a Data Incident but did not |
| **Affected Users** | Teachers whose Personal Data was compromised |
| **Severity Levels** | See Section 5 |

---

## 3. Scope

This plan covers incidents involving:
- Teacher Personal Data (names, emails, profiles, conversation content, assessment data)
- Authentication credentials (OAuth tokens, session data)
- AI processing data (information sent to/received from Anthropic, OpenAI)
- Infrastructure (database, hosting, application code)

---

## 4. Incident Response Team

| Role | Responsibility | Contact |
|------|---------------|---------|
| **Incident Lead** | [Asher Scott] — Overall response coordination, decision-making | [EMAIL] / [PHONE] |
| **Technical Lead** | [Same or designated] — Investigation, containment, remediation | [EMAIL] |
| **Communications** | [Same or designated] — User and stakeholder notifications | [EMAIL] |
| **Legal Advisor** | [External counsel — TBD] — Legal obligations, notification requirements | [EMAIL] |

**Note:** As a small operation, one person may fill multiple roles. Designate a backup contact for each role.

---

## 5. Severity Levels

### Level 1 — Critical
**Examples:** Database breach exposing all user data, compromised API keys allowing unauthorized AI access, ransomware on infrastructure
**Response time:** Immediately (within 1 hour)
**Notification:** All affected users, relevant districts, law enforcement if applicable

### Level 2 — High
**Examples:** Unauthorized access to a single user's account, exposure of OAuth tokens, AI provider data breach affecting our data
**Response time:** Within 4 hours
**Notification:** Affected user(s), relevant district(s)

### Level 3 — Medium
**Examples:** Excessive logging of sensitive data discovered, misconfigured access control on a non-critical endpoint, subprocessor policy change
**Response time:** Within 24 hours
**Notification:** Internal only (unless user data was accessed)

### Level 4 — Low
**Examples:** Near miss, failed intrusion attempt, vulnerability discovered but not exploited
**Response time:** Within 72 hours
**Notification:** Internal only

---

## 6. Response Procedures

### Phase 1: Detection & Reporting

**How incidents may be detected:**
- User reports (via support contact form or email)
- Automated monitoring alerts (Vercel logs, Supabase alerts)
- Third-party notification (Anthropic, Supabase, Vercel reporting an incident)
- Internal discovery (during code review, testing, or maintenance)
- Security researcher disclosure

**Reporting channels:**
- Email: [SECURITY EMAIL]
- Support form: [URL]

**Upon detection:**
1. Document: What happened, when, who discovered it, initial scope estimate
2. Classify severity level (Section 5)
3. Notify Incident Lead immediately for Level 1-2; within 24 hours for Level 3-4

### Phase 2: Containment

**Immediate actions by severity:**

| Severity | Actions |
|----------|---------|
| Critical | Revoke all API keys, rotate database credentials, consider taking service offline, preserve logs/evidence |
| High | Revoke affected credentials, disable compromised accounts, preserve evidence |
| Medium | Patch the vulnerability, restrict access to affected systems |
| Low | Document and schedule fix |

**Specific containment actions:**

| Scenario | Containment |
|----------|------------|
| Database breach | Rotate DATABASE_URL, revoke Supabase access, check for data exfiltration |
| API key compromise | Rotate ANTHROPIC_API_KEY, OPENAI_API_KEY, and any other exposed keys immediately |
| OAuth token exposure | Invalidate all sessions, force re-authentication |
| Unauthorized account access | Disable the affected account, notify the user |
| Subprocessor breach (Anthropic/OpenAI) | Assess what data was exposed, follow subprocessor's incident guidance |

### Phase 3: Investigation

1. **Determine scope:**
   - Which users are affected?
   - What data was accessed or exposed?
   - How did the incident occur?
   - When did it start?
   - Is the incident ongoing?

2. **Evidence preservation:**
   - Export and secure relevant Vercel logs
   - Export Supabase audit logs
   - Screenshot or export relevant system state
   - Do NOT modify or delete evidence

3. **Root cause analysis:**
   - What vulnerability was exploited?
   - Was it a code issue, configuration issue, or third-party issue?
   - Could it have been prevented?

### Phase 4: Notification

**Timeline requirements:**

| Audience | When | Method |
|----------|------|--------|
| Affected users | Within 72 hours of breach confirmation | Email |
| School districts (if DPA in place) | Within 72 hours of breach confirmation | Email + phone to designated contact |
| Law enforcement | If criminal activity suspected | Per legal counsel guidance |
| State AG (if required by state law) | Per state requirements (varies) | Per state-specific procedures |

**Notification must include:**
- Description of the incident
- Types of data affected
- What we're doing about it
- What the user can do (e.g., change Google password, monitor accounts)
- Contact information for questions
- Timeline of events

**Notification template:**

```
Subject: Important Security Notice — AI for Teachers

Dear [Name],

We are writing to inform you of a data security incident affecting your AI for Teachers account.

What happened: [Description]

When: [Date range]

What data was affected: [Specific data types]

What we are doing: [Actions taken — containment, investigation, remediation]

What you can do: [Recommended user actions]

We take the security of your data seriously and sincerely apologize for this incident.

If you have questions, please contact us at [EMAIL].

Sincerely,
[Name]
AI for Teachers
```

### Phase 5: Remediation

1. Fix the root cause
2. Verify the fix
3. Restore service (if taken offline)
4. Implement additional safeguards to prevent recurrence
5. Update security practices and documentation

### Phase 6: Post-Incident Review

Within 7 days of incident resolution:

1. **Document:**
   - Complete timeline of events
   - Root cause analysis
   - Actions taken
   - Users/data affected
   - Notifications sent

2. **Assess:**
   - Was the response timely and effective?
   - What worked well?
   - What needs improvement?

3. **Improve:**
   - Update this incident response plan if needed
   - Implement additional monitoring
   - Address any systemic issues discovered
   - Update security checklists

---

## 7. Specific Scenarios

### Scenario A: Anthropic Reports a Data Breach

1. Contact Anthropic's security team for details on scope
2. Determine if AI for Teachers data was affected
3. Assess what teacher data was potentially exposed (messages, profile context, assessments)
4. Follow standard notification procedures
5. Consider whether to pause AI features during investigation

### Scenario B: Supabase Reports a Database Breach

1. Immediately rotate database credentials
2. Audit database access logs
3. Determine scope of data exposure (all tables affected or specific ones)
4. All user data is potentially affected — treat as Level 1
5. Follow standard notification procedures

### Scenario C: Teacher Reports Seeing Another User's Data

1. Immediately investigate the report
2. Check for cross-user data leaks in API routes
3. If confirmed, disable affected endpoints
4. Determine how many users may be affected
5. Notify affected users

### Scenario D: API Keys Found in Public Repository

1. Rotate ALL API keys immediately (Anthropic, OpenAI, HeyGen, Resend, database)
2. Rotate NextAuth secret
3. Check API provider dashboards for unauthorized usage
4. Review git history for other exposed secrets
5. Implement pre-commit hooks to prevent future exposure

---

## 8. Prevention Measures

### Current
- HTTPS/TLS encryption for all traffic
- Google OAuth for authentication (no password storage)
- User-scoped data access in API routes
- Environment variables for all secrets
- `.gitignore` for `.env` files

### Planned Improvements
- [ ] Rate limiting on all API routes
- [ ] Field-level encryption for sensitive data (OAuth tokens, diagnostic evidence)
- [ ] Production log sanitization (remove message content from logs)
- [ ] Automated monitoring/alerting for unusual access patterns
- [ ] Regular dependency updates and vulnerability scanning
- [ ] Pre-commit hooks for secret detection
- [ ] Periodic security review schedule

---

## 9. Contact Information

**Security Incidents:** [SECURITY EMAIL]
**General Support:** [SUPPORT EMAIL]
**Legal Counsel:** [TBD — engage before pilot]

---

## 10. Review Schedule

This plan should be reviewed:
- Annually
- After any incident
- When significant changes are made to the Service's architecture or data processing

---

*This Incident Response Plan was last reviewed on [DATE].*
