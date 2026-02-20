# How Skippy Works

This diagram shows the five main things that happen during a Skippy conversation. The teacher chats naturally in a window; behind the scenes, Skippy combines several sources of knowledge to give a personalized reply, then quietly reflects on the conversation to stay helpful over time.

```mermaid
flowchart TD
    %% ── Teacher action ──────────────────────────────────────
    SEND(["Teacher sends a message"])

    %% ── Skippy prepares ─────────────────────────────────────
    SEND --> PREPARE["Skippy prepares a response"]

    PERSONALITY["Skippy's personality"]
    TOPIC["This week's lesson topic"]
    PROFILE["Teacher's profile"]
    HISTORY["Recent conversation history"]

    PERSONALITY --> PREPARE
    TOPIC --> PREPARE
    PROFILE --> PREPARE
    HISTORY --> PREPARE

    %% ── Skippy responds ─────────────────────────────────────
    PREPARE --> RESPOND(["Skippy responds"])
    RESPOND --> TEACHER(["Teacher reads the reply"])

    %% ── Skippy reflects (async) ─────────────────────────────
    RESPOND -.-> REFLECT["Skippy reflects on the conversation"]
    REFLECT -.-> PHASE["What phase is the teacher in?"]
    REFLECT -.-> SKILL["What's their skill level?"]
    REFLECT -.-> STUCK["Are they stuck or making progress?"]

    %% ── Artifact extraction ─────────────────────────────────
    REFLECT -.-> SAVE{"Has the teacher<br/>finished building<br/>something?"}
    SAVE -- Yes --> EXTRACT["Skippy saves the<br/>teacher's work as<br/>a reusable artifact"]

    %% ── Styling ─────────────────────────────────────────────
    classDef teacher fill:#dceefb,stroke:#4a90d9,color:#1a3a5c
    classDef skippy fill:#e8f5e9,stroke:#66bb6a,color:#1b5e20
    classDef input fill:#fff8e1,stroke:#fbc02d,color:#5d4037
    classDef reflection fill:#f3e5f5,stroke:#ab47bc,color:#4a148c

    class SEND,TEACHER teacher
    class PREPARE,RESPOND skippy
    class PERSONALITY,TOPIC,PROFILE,HISTORY input
    class REFLECT,PHASE,SKILL,STUCK,SAVE,EXTRACT reflection
```

**Legend**

| Color | Meaning |
|-------|---------|
| Blue | Teacher actions |
| Green | Skippy's main response |
| Yellow | Knowledge Skippy draws on |
| Purple | Skippy's quiet reflection (happens in the background) |
