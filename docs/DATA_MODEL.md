# LUMA AI Data Model

The exact Firebase SDK implementation may change, but these logical entities are required.

## User

```text
User
- uid: string
- displayName: string
- email: string | optional
- createdAt: timestamp
- updatedAt: timestamp
- aiCallName: string | optional
- customInstructions: string | optional
- accentColor: string
- theme: string
- font: string
```

## API configuration

API credentials are sensitive configuration.

```text
ApiConfig
- provider: "openrouter"
- keyReference / encrypted representation: implementation-specific
- updatedAt: timestamp
```

Do not store raw API keys in logs, analytics, URLs, Git history, or ordinary error objects.

For the personal-use first release, the application may use a client-side storage strategy only if its security implications are explicitly documented. A server-side secret vault is preferable if the deployment model supports it.

## Conversation

```text
Conversation
- id: string
- ownerUid: string
- title: string
- createdAt: timestamp
- updatedAt: timestamp
- lastMessageAt: timestamp
- activeLeafMessageId: string | null
```

Indexes should support listing a user's conversations by most recent activity.

## Message

```text
Message
- id: string
- conversationId: string
- parentMessageId: string | null
- role: "user" | "assistant" | "system"
- content: string
- modelId: string | null
- modelDisplayName: string | null
- createdAt: timestamp
- branchState: "active" | "inactive"
- regeneratedFromId: string | null
- editedFromId: string | null
- attachments: AttachmentRef[]
- sources: SourceRef[]
```

The original message content must never be overwritten by edit/regeneration operations.

## AttachmentRef

```text
AttachmentRef
- id: string
- name: string
- mimeType: string
- size: number
- previewType: "image" | "pdf" | "unsupported"
- storageRef: string | null
- providerRef: string | null
- status: "local" | "uploaded" | "sent" | "failed"
```

## SourceRef

```text
SourceRef
- id: string
- title: string
- url: string
- domain: string | null
- snippet: string | null
- retrievedAt: timestamp | null
```

Sources are attached to the assistant message that used them.

## Model metadata

```text
ModelDefinition
- id: string
- displayName: string
- provider: string
- description: string
- capabilities: string[]
- availability: "enabled" | "disabled"
```

Model definitions should normally live in versioned application configuration rather than being user-specific data.

## Branch rules

### Regeneration

```text
user-1
  |
  +-- assistant-1
  |
  +-- assistant-2  (new regeneration)
```

### Editing

```text
user-1
  |
  +-- assistant-1

user-2 (edited replacement)
  |
  +-- assistant-2
```

Both original and edited branches remain recoverable.

## Data ownership

Every user-owned document must be scoped by authenticated UID.

No user should be able to read or modify another user's:

- conversations
- messages
- personal intelligence
- settings
- attachment metadata

## Deletion

Account deletion should trigger cleanup of user-owned application data according to the final Firebase security/data-retention design.

Conversation deletion should remove or orphan no data that remains visible to the user. Attachment cleanup must be handled explicitly where stored outside Firestore.
