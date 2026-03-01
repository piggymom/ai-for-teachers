# Privacy Policy — AI for Teachers

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

**Effective Date:** [DATE]
**Last Updated:** [DATE]

---

## 1. Introduction

AI for Teachers ("we," "us," or "our") operates the Skippy AI Tutor platform ("the Service"), a professional development tool that helps K-12 teachers learn to use AI effectively in their classrooms. This Privacy Policy explains how we collect, use, share, and protect your information when you use our Service.

This policy applies to all users of the Service, including participants in pilot programs.

**Contact:** [CONTACT EMAIL]

---

## 2. Information We Collect

### 2.1 Information You Provide Directly

**Account Information:**
- Name (from your Google account)
- Email address (from your Google account)
- Profile picture URL (from your Google account)

**Professional Profile (during onboarding):**
- Your teaching role (e.g., classroom teacher, specialist, administrator)
- Grade levels you teach
- Subjects you teach
- Your experience level with AI tools
- Professional constraints or concerns you face
- Your biggest time drains at work
- Your primary professional development goal and details

**Conversation Content:**
- Messages you send to Skippy (our AI tutor)
- Any professional artifacts you create with Skippy's help (e.g., prompt templates, lesson outlines, feedback workflows)

**Contact Information:**
- Name, email, and message content if you submit a support request

### 2.2 Information Collected Automatically

**Authentication Data:**
- Google OAuth tokens (used to keep you signed in)
- Session information

**Usage Data:**
- Your progress through the course (which weeks you've started/completed)
- Conversation metadata (timestamps, message counts)
- Days since your last visit

**Assessment Data:**
- Skippy assesses your readiness level using an educational framework (SOLO taxonomy) to personalize your learning experience
- This includes evidence from your conversations, identified areas for growth, and engagement signals

**Server Logs:**
- Standard web server logs may include IP addresses, browser type, and request timestamps (managed by our hosting provider, Vercel)

### 2.3 Information We Do NOT Collect

- Student information or student personally identifiable information (PII)
- Payment or financial information
- Precise geolocation data
- Information from children under 13
- Social media profiles beyond Google sign-in
- Browsing history outside our Service

---

## 3. How We Use Your Information

We use your information for the following purposes:

| Purpose | Data Used |
|---------|-----------|
| **Authenticate you** | Google account info, session tokens |
| **Personalize your learning** | Professional profile, conversation history, readiness assessment |
| **Provide AI tutoring** | Messages, profile context (sent to our AI provider to generate responses) |
| **Track your progress** | Week completion status, engagement metrics |
| **Create learning artifacts** | Conversation content (to extract useful templates and workflows you build) |
| **Generate audio recaps** | Conversation content (to create personalized podcast summaries) |
| **Improve the Service** | Aggregated, de-identified usage patterns |
| **Respond to support requests** | Contact form information |

We do **not** use your information to:
- Evaluate your job performance
- Share individual data with your school or district (unless required by law)
- Sell your data to third parties
- Train AI models (per our AI provider agreements)
- Make automated decisions that affect your employment

---

## 4. How We Share Your Information

### 4.1 AI Service Provider — Anthropic

To power the Skippy tutoring experience, we send certain data to Anthropic (the company behind Claude, our AI engine):

**What is sent:**
- Your first name and professional context (role, grades, subjects, goals, constraints)
- Your recent conversation messages (up to last 10 messages per request)
- Your readiness assessment data (to personalize AI responses)

**What is NOT sent:**
- Your email address
- Your authentication credentials
- Other users' data

**Anthropic's commitment:** Per Anthropic's API terms, data sent through the API is not used to train their AI models. Anthropic may retain API inputs/outputs for up to 30 days for trust and safety monitoring.

### 4.2 Text-to-Speech — OpenAI

For audio features (Skippy's voice, podcast recaps):
- AI-generated text (not your raw messages) is sent to OpenAI's text-to-speech service
- Podcast scripts derived from your conversations are sent for audio generation

### 4.3 Video Generation — HeyGen

For personalized welcome videos:
- A welcome script derived from your profile information is sent to HeyGen

### 4.4 Email — Resend

For support requests:
- Your name, email, and message are sent via Resend to our support email

### 4.5 Hosting — Vercel

- All traffic passes through Vercel's infrastructure
- Vercel processes server logs per their privacy policy

### 4.6 Database — Supabase

- All application data is stored in Supabase's hosted PostgreSQL database
- Data is encrypted at rest per Supabase's security practices

### 4.7 We Do NOT Share Data With

- Your school or district (unless you explicitly request it or law requires it)
- Advertisers
- Data brokers
- Other users

---

## 5. Data Security

We implement the following security measures:

- **Encryption in transit:** All data transmitted between your browser and our servers uses HTTPS/TLS encryption
- **Encryption at rest:** Database stored on Supabase with encryption at rest enabled
- **Authentication:** Google OAuth 2.0 with secure session management
- **Access control:** All data is scoped to your authenticated account; you cannot access other users' data
- **Cascading deletion:** When you delete your account, all associated data is removed
- **No public endpoints:** Nearly all data endpoints require authentication
- **Environment security:** API keys and secrets stored as environment variables, not in code

**Known limitations (being addressed):**
- OAuth tokens are stored without additional field-level encryption
- Production logging may contain message previews (being sanitized)
- No rate limiting currently in place (being implemented)

---

## 6. Data Retention

| Data Type | Retention Period |
|-----------|-----------------|
| Account information | Until you delete your account |
| Professional profile | Until you delete your account |
| Conversation history | Until you delete your account [CONSIDER: implement time-based retention] |
| Assessment data (readiness levels) | Until you delete your account |
| Artifacts | Until you delete them or your account |
| Progress records | Until you delete your account |
| Session tokens | Until they expire or you sign out |
| Server logs (Vercel) | Per Vercel's retention policy |

**[TODO: Define specific retention periods before pilot launch. Consider whether conversation data should be automatically purged after a set period, e.g., 12 months after course completion.]**

---

## 7. Your Rights

You have the following rights regarding your data:

### 7.1 Access Your Data
You can request a copy of all data we hold about you. Contact us at [CONTACT EMAIL].

**[TODO: Implement self-service data export before pilot launch.]**

### 7.2 Correct Your Data
You can update your professional profile at any time through the application. For corrections to other data, contact us at [CONTACT EMAIL].

### 7.3 Delete Your Data
You can request deletion of your account and all associated data. Contact us at [CONTACT EMAIL].

**[TODO: Implement self-service account deletion before pilot launch.]**

When you delete your account:
- Your user record, profile, all conversations, assessments, artifacts, and progress data are permanently removed from our database
- Data already sent to third-party APIs (Anthropic, OpenAI) is subject to those providers' retention policies
- Server logs containing your data will age out per hosting provider retention policies

### 7.4 Withdraw Consent
You can stop using the Service at any time. If you wish to withdraw consent for data processing, contact us to discuss your options.

### 7.5 Data Portability
You can request your data in a machine-readable format. Contact us at [CONTACT EMAIL].

**[TODO: Implement self-service data export in JSON format.]**

---

## 8. Children's Privacy

AI for Teachers is designed exclusively for adult educators. We do not knowingly collect information from children under 13 years of age. The Service is not directed at children and is not intended to be used by students.

If you believe a child under 13 has provided us with personal information, please contact us immediately at [CONTACT EMAIL] and we will promptly delete such information.

**Important note for teachers:** Please do not share student names or other student personally identifiable information in your conversations with Skippy. Discuss students in general terms (e.g., "a student in my class" rather than using names).

---

## 9. Sensitive Assessment Data

Skippy assesses your readiness level using the SOLO taxonomy framework to personalize your learning experience. This assessment:

- Is used solely to improve your tutoring experience
- Is not shared with your employer, school, or district
- Does not affect your employment or professional standing
- Can be deleted along with the rest of your data upon request
- Is based on your conversations, not external evaluations

---

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. When we make changes:

- We will update the "Last Updated" date at the top
- For significant changes, we will notify you via email or a prominent notice in the Service
- Your continued use after changes constitutes acceptance of the updated policy

---

## 11. Contact Us

If you have questions about this Privacy Policy or your data:

**Email:** [CONTACT EMAIL]
**Subject line:** Privacy Inquiry — AI for Teachers

We aim to respond to all privacy inquiries within 30 days.

---

## 12. Additional Disclosures

### For New York State Users
If you are a teacher in New York State, you may have additional rights under New York Education Law Section 2-d regarding the privacy of student data. Since AI for Teachers does not collect student data, these provisions do not directly apply. However, we are committed to meeting the spirit of these protections for all users.

### For California Users
If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA). Contact us to exercise these rights.

---

*This Privacy Policy was last reviewed on [DATE].*
