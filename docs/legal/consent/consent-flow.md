# User Consent Flow — AI for Teachers

> **DRAFT — NOT LEGAL ADVICE.** These documents are templates created by AI and require review by qualified legal counsel before use. Consult with an attorney familiar with education law, privacy regulations, and business formation before deploying these policies.

---

## 1. Consent Points

### 1.1 Account Creation (Google Sign-In)

**When:** User clicks "Sign in with Google"

**What user agrees to:**
- Sharing their Google profile (name, email, photo) with AI for Teachers
- Creating an account on the platform
- Terms of Service and Privacy Policy

**Implementation:**

```
Before completing sign-in, display:

┌──────────────────────────────────────────┐
│  Welcome to AI for Teachers              │
│                                          │
│  By signing in, you agree to our:        │
│  • Terms of Service [link]               │
│  • Privacy Policy [link]                 │
│                                          │
│  ☐ I have read and agree to the Terms    │
│    of Service and Privacy Policy         │
│                                          │
│  [Sign in with Google]                   │
└──────────────────────────────────────────┘
```

**Record:** Store consent timestamp, version of ToS/PP agreed to, user ID.

### 1.2 First Skippy Conversation (AI Processing Consent)

**When:** User initiates their first conversation with Skippy

**What user agrees to:**
- Conversations will be processed by Anthropic's Claude AI
- Professional profile data will be used to personalize AI responses
- Readiness assessment will be conducted during conversations
- Conversation history will be stored

**Implementation:**

```
Before first message, display:

┌──────────────────────────────────────────┐
│  Before you start...                     │
│                                          │
│  Skippy is powered by Claude, an AI      │
│  from Anthropic. Here's what to know:    │
│                                          │
│  • Your messages are processed by AI     │
│    to generate personalized responses    │
│  • Your professional profile helps       │
│    tailor the experience to you          │
│  • Your readiness level is assessed      │
│    to adjust conversation complexity     │
│  • Conversations are stored so you       │
│    can pick up where you left off        │
│                                          │
│  Please do not share student names or    │
│  identifiable student information.       │
│                                          │
│  Learn more: AI Disclosure [link]        │
│                                          │
│  ☐ I understand and want to continue     │
│                                          │
│  [Start Conversation]                    │
└──────────────────────────────────────────┘
```

**Record:** Store AI consent timestamp, user ID.

### 1.3 Onboarding Profile (Data Collection Consent)

**When:** User completes the onboarding questionnaire

**What user agrees to:**
- Professional data will be stored
- Data will be used to personalize AI interactions
- Data will be sent to Anthropic as part of AI context

**Implementation:**

```
At start of onboarding form:

"The information you share helps Skippy personalize your
learning experience. This data is stored securely and
shared with our AI provider (Anthropic) to tailor
conversations to your teaching context.

All fields are optional — share what you're comfortable with."
```

**Record:** Implicit consent via form submission; recorded with profile creation timestamp.

### 1.4 Audio Features (Optional)

**When:** User enables voice/TTS or generates a podcast

**What user agrees to:**
- Text will be sent to OpenAI for speech synthesis
- Podcast content is derived from conversation data

**Implementation:**

```
First time enabling voice:

"Voice features use OpenAI's text-to-speech service.
Skippy's responses will be sent to OpenAI to generate
audio. Continue?"

[Enable Voice] [Not Now]
```

**Record:** Store audio consent timestamp, user ID.

---

## 2. How Consent is Recorded

### Database Schema Addition Needed

```prisma
model Consent {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // "tos_pp", "ai_processing", "audio_features", "pilot_participation"
  version   String   // Version of the document agreed to (e.g., "1.0")
  granted   Boolean  @default(true)
  timestamp DateTime @default(now())
  ipAddress String?  // Optional: IP at time of consent

  @@index([userId])
  @@index([type])
}
```

### Consent Record Example

```json
{
  "id": "clxyz...",
  "userId": "cluser...",
  "type": "tos_pp",
  "version": "1.0",
  "granted": true,
  "timestamp": "2026-03-15T10:30:00Z",
  "ipAddress": null
}
```

---

## 3. How to Withdraw Consent

### 3.1 Process

1. **User requests withdrawal** via:
   - Email to [CONTACT EMAIL] with subject "Withdraw Consent"
   - [Future: Self-service option in account settings]

2. **We acknowledge** within 5 business days

3. **We process the request:**

| Consent Type | Withdrawal Effect |
|-------------|-------------------|
| Terms of Service / Privacy Policy | Account deactivation (cannot use service without agreeing) |
| AI Processing | Skippy features disabled; existing conversations retained until account deletion requested |
| Audio Features | Voice/podcast features disabled; audio not generated |
| Pilot Participation | Removed from pilot program; data handling per privacy policy |

4. **We confirm** withdrawal is complete

### 3.2 Partial Withdrawal

Users may withdraw consent for specific processing while maintaining others:
- Withdraw audio consent → lose voice features, keep text chat
- Withdraw AI processing consent → effectively cannot use Skippy; account remains for data access/export
- Withdraw all consent → equivalent to account deletion request

### 3.3 Data After Withdrawal

- Data collected prior to withdrawal is retained per the retention policy unless deletion is also requested
- No new data processing occurs for withdrawn consent types
- User is informed of data handling at time of withdrawal

---

## 4. Re-Consent

### When policies change:

```
On next login after policy update:

┌──────────────────────────────────────────┐
│  Updated Policies                        │
│                                          │
│  We've updated our:                      │
│  • Privacy Policy [link to changes]      │
│  • Terms of Service [link to changes]    │
│                                          │
│  Key changes:                            │
│  • [Summary of material changes]         │
│                                          │
│  ☐ I have read and agree to the          │
│    updated policies                      │
│                                          │
│  [Continue]  [Delete My Account]         │
└──────────────────────────────────────────┘
```

**Record:** New consent record with updated version number.

---

## 5. Implementation Priority

1. **Before pilot:** Terms/Privacy consent on sign-in page
2. **Before pilot:** AI processing consent before first Skippy conversation
3. **Before pilot:** Consent database table and recording
4. **Short-term:** Audio feature consent
5. **Short-term:** Self-service consent withdrawal in account settings
6. **Medium-term:** Re-consent flow for policy updates

---

*Last reviewed: [DATE]*
