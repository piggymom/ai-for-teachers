# Data Processing Agreement (DPA) — AI for Teachers

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

**Effective Date:** [DATE]

This Data Processing Agreement ("DPA") is entered into between:

**Data Controller:** [SCHOOL/DISTRICT NAME] ("Controller")
**Data Processor:** [ENTITY NAME — AI for Teachers] ("Processor")

This DPA supplements the Terms of Service and governs the processing of personal data when the Controller's employees (teachers) use the AI for Teachers Service.

---

## 1. Definitions

- **Personal Data:** Any information relating to an identified or identifiable teacher using the Service
- **Processing:** Any operation performed on Personal Data (collection, storage, use, transmission, deletion)
- **Subprocessor:** A third party engaged by Processor to process Personal Data
- **Data Subject:** An individual teacher whose Personal Data is processed

---

## 2. Scope of Processing

### 2.1 Purpose
The Processor processes Personal Data solely to provide the AI for Teachers professional development Service to the Controller's teachers.

### 2.2 Categories of Data Subjects
- K-12 teachers employed by or affiliated with the Controller

### 2.3 Categories of Personal Data Processed

| Category | Examples |
|----------|----------|
| Identity data | Name, email address, profile photo URL |
| Professional data | Teaching role, grade levels, subjects, professional goals |
| Usage data | Conversation messages, progress, session metadata |
| Assessment data | AI-determined readiness levels, identified growth areas |
| Generated content | Artifacts (templates, outlines, workflows) |

### 2.4 Data NOT Processed
- Student personally identifiable information
- Teacher employment records, salary, or performance evaluations
- Health or biometric data
- Financial or payment data

---

## 3. Processor Obligations

The Processor shall:

### 3.1 Lawful Processing
- Process Personal Data only on documented instructions from the Controller
- Not process Personal Data for any purpose other than providing the Service
- Immediately inform the Controller if an instruction would violate applicable law

### 3.2 Confidentiality
- Ensure that persons authorized to process Personal Data are bound by confidentiality obligations
- Limit access to Personal Data to personnel who need it to provide the Service

### 3.3 Security Measures
Implement appropriate technical and organizational measures, including:

| Measure | Implementation |
|---------|---------------|
| Encryption in transit | TLS/HTTPS for all connections |
| Encryption at rest | Supabase database encryption |
| Access control | Google OAuth authentication, user-scoped data access |
| Data isolation | Each user can only access their own data |
| Secure infrastructure | Vercel hosting with SOC 2 compliance |
| Cascading deletion | Account deletion removes all associated data |

### 3.4 Subprocessors
- Notify the Controller before engaging new Subprocessors
- Ensure Subprocessors are bound by equivalent data protection obligations
- Remain liable for Subprocessor compliance

### 3.5 Data Subject Rights
- Assist the Controller in responding to Data Subject requests (access, correction, deletion, portability)
- Respond to requests within 30 days

### 3.6 Data Breach Notification
- Notify the Controller of any Personal Data breach without undue delay (and in any event within 72 hours of becoming aware)
- Provide details including: nature of breach, categories and approximate number of Data Subjects affected, likely consequences, and measures taken to address the breach
- Cooperate with the Controller's investigation and notification obligations

### 3.7 Audits
- Make available to the Controller information necessary to demonstrate compliance
- Allow for and contribute to audits conducted by the Controller or an auditor mandated by the Controller (with reasonable notice)

### 3.8 Return and Deletion
Upon termination of the Service:
- Return all Personal Data to the Controller in a standard format (JSON) upon request
- Delete all Personal Data within 30 days of termination (unless retention is required by law)
- Provide written confirmation of deletion

---

## 4. Subprocessors

The following Subprocessors are authorized as of the effective date:

| Subprocessor | Purpose | Data Processed | Location | Terms |
|-------------|---------|---------------|----------|-------|
| **Anthropic** | AI tutoring (Claude API) | Teacher name, professional context, conversation messages, readiness assessment | United States | [Anthropic API Terms] |
| **OpenAI** | Text-to-speech audio | AI-generated text (not raw user messages), podcast scripts | United States | [OpenAI API Terms] |
| **HeyGen** | Welcome video generation | Personalized welcome script (derived from profile) | United States | [HeyGen Terms] |
| **Supabase** | Database hosting | All application data | United States (AWS) | [Supabase DPA] |
| **Vercel** | Application hosting | All HTTP traffic, server logs | United States | [Vercel DPA] |
| **Google** | Authentication (OAuth) | Name, email, profile photo | United States | [Google API Terms] |
| **Resend** | Support email delivery | Contact form submissions (name, email, message) | United States | [Resend Terms] |

The Controller consents to the use of these Subprocessors. The Processor will notify the Controller at least 30 days before engaging any new Subprocessor, and the Controller may object if the new Subprocessor does not meet adequate data protection standards.

---

## 5. Data Transfers

All Subprocessors are located in the United States. If data transfers to other jurisdictions become necessary, the Processor will:
- Notify the Controller in advance
- Ensure adequate protections are in place (e.g., Standard Contractual Clauses)
- Obtain Controller consent before proceeding

---

## 6. Controller Obligations

The Controller shall:

- Ensure that teachers are informed about the Service's data practices (referencing the Privacy Policy)
- Ensure that adequate consent or legal basis exists for processing teacher Personal Data
- Not instruct teachers to enter student personally identifiable information into the Service
- Notify the Processor promptly of any Data Subject requests received directly

---

## 7. Specific AI Processing Provisions

### 7.1 AI Model Training
Personal Data processed through the Service is NOT used to train AI models. Anthropic's API terms prohibit using API data for model training.

### 7.2 AI Assessment Data
The Service generates readiness assessments of teachers using the SOLO taxonomy framework. This assessment:
- Is used solely to personalize the learning experience
- Is not shared with the Controller unless the Data Subject consents
- Is not used for employment evaluation purposes
- Can be deleted upon Data Subject request

### 7.3 AI-Generated Content
Artifacts and content generated with AI assistance belong to the Data Subject (teacher). The Processor does not claim ownership or use individual artifacts for purposes other than providing the Service.

---

## 8. FERPA Provisions

### 8.1 Student Data
The Service is not designed to collect or process student education records. The Processor is not a "school official" under FERPA.

### 8.2 Teacher Obligations
Teachers should not share student PII through the Service. If student data is inadvertently shared:
- The Processor will not use such data for any purpose
- The Processor will delete identified student data upon notification
- The Processor will cooperate with the Controller's FERPA obligations

### 8.3 De-Identification
If the Processor uses any data for Service improvement, it will be aggregated and de-identified so that no individual teacher or student can be identified.

---

## 9. Term and Termination

### 9.1 Term
This DPA is effective from the date the Controller's teachers begin using the Service and remains in effect as long as Personal Data is being processed.

### 9.2 Survival
Obligations regarding confidentiality, data deletion, and breach notification survive termination.

---

## 10. Limitation of Liability

The liability of each party under this DPA is subject to the limitations set forth in the Terms of Service, except that neither party limits its liability for breaches of data protection obligations caused by willful misconduct or gross negligence.

---

## 11. Governing Law

This DPA is governed by the same law as the Terms of Service (State of [STATE]).

---

## 12. Contact

**Processor Contact for Data Protection:**
[ENTITY NAME]
[CONTACT EMAIL]
[PHONE — optional]

**Controller Contact:**
[SCHOOL/DISTRICT NAME]
[CONTACT PERSON]
[EMAIL]

---

## Signatures

**For the Controller:**

Name: ___________________________
Title: ___________________________
Date: ___________________________
Signature: ___________________________

**For the Processor:**

Name: ___________________________
Title: ___________________________
Date: ___________________________
Signature: ___________________________

---

*This Data Processing Agreement was last reviewed on [DATE].*
