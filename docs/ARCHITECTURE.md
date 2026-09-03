# LUMA AI Architecture

## 1. System overview

```text
Browser / PWA
    |
    +-- UI Layer
    |     +-- Sidebar
    |     +-- Chat
    |     +-- Composer
    |     +-- Settings
    |     +-- Preview surfaces
    |
    +-- Application Layer
    |     +-- Auth state
    |     +-- Conversation state
    |     +-- Branching engine
    |     +-- Model registry
    |     +-- Attachment manager
    |     +-- Search/source manager
    |
    +-- Persistence Layer
    |     +-- Firebase Authentication
    |     +-- Firestore (user/chat metadata and messages)
    |     +-- Storage where required for attachment persistence
    |
    +-- AI Gateway
          +-- OpenRouter
          +-- selected model
          +-- optional search provider/tool pipeline
```

## 2. Architectural principles

- Keep provider-specific code behind service adapters.
- Keep model IDs out of UI components.
- Keep conversation branching independent of the UI.
- Keep attachment previews independent of model transport.
- Never expose provider secrets in source control.
- Prefer small, testable modules over a monolithic chat component.

## 3. Recommended application layers

### Presentation

Responsible for rendering and interaction only.

Suggested component groups:

- `layout/`
- `sidebar/`
- `chat/`
- `composer/`
- `message/`
- `settings/`
- `attachments/`
- `preview/`
- `common/`

### Domain/application

Responsible for product behavior:

- conversation service
- message branching service
- model registry service
- generation service
- attachment service
- search/source service
- settings service

### Infrastructure

Responsible for external systems:

- Firebase adapter
- OpenRouter adapter
- search adapter
- storage adapter

The UI must not call OpenRouter or Firebase directly from arbitrary components.

## 4. AI request pipeline

```text
User submits message
        |
        v
Validate composer state
        |
        v
Resolve active conversation branch
        |
        v
Load personal intelligence
        |
        v
Resolve selected model from registry
        |
        v
Prepare attachments
        |
        v
Build provider-neutral request
        |
        +----> optional web search/tool phase
        |
        v
OpenRouter adapter
        |
        v
Selected model
        |
        v
Normalize response
        |
        +----> sources
        +----> attachments/metadata
        |
        v
Persist assistant message
        |
        v
Render response
```

## 5. Model registry

The UI requests models through a registry interface, for example:

```text
getAvailableModels()
getModel(id)
getDefaultModel()
getModelsByCapability(capability)
```

The registry is the single source of truth for display names and capabilities.

## 6. Conversation engine

A conversation is represented as a directed message tree.

```text
root
 |
 +-- user A
      |
      +-- assistant A1
      |
      +-- assistant A2  <- regeneration sibling

user B
 |
 +-- assistant B1

user A (edited)
 |
 +-- assistant A3       <- edited branch
```

The application derives the active context by walking parent references from the selected leaf to the root and reversing the result.

Do not mutate old messages when editing or regenerating. Create new message nodes.

## 7. Regeneration algorithm

1. Identify the assistant message selected for regeneration.
2. Identify its parent user message.
3. Resolve the active branch ending at that user message.
4. Reuse the same user input and attachments.
5. Use the currently selected model unless the product explicitly preserves the original model for that action.
6. Generate a new assistant sibling under the same user message.
7. Mark the new assistant message as the active branch candidate.
8. Persist the branch relationship.

The UI should make the current branch obvious when multiple sibling answers exist.

## 8. Edit algorithm

1. Identify the user message selected for editing.
2. Open its content in the composer.
3. On submit, create a new user message using the edited content.
4. Attach it to the same parent message as the original.
5. Preserve the original message and its descendants.
6. Generate the next assistant response from the new branch.

## 9. Attachment architecture

Attachment handling has four stages:

1. Selection
2. Local preview
3. Transport preparation
4. Persistence/display

Preview is client-side where possible.

The transport adapter determines whether a given model/provider supports the file type. Unsupported combinations must produce a clear UI error rather than silently dropping the attachment.

## 10. Web search architecture

Search must be abstracted behind a provider-neutral interface.

```text
search(query) -> SearchResult[]

SearchResult:
- title
- url
- snippet
- source/domain
- timestamp when available
```

The AI request layer may combine search results with the model context. Each assistant message stores the source metadata used for that response.

## 11. Persistence

Firebase Authentication manages identity.

Firestore is the preferred primary database for:

- user profile settings
- conversation metadata
- message tree
- model selection metadata
- source metadata

Binary attachment persistence may use Firebase Storage when persistence beyond the browser session is required.

## 12. Offline/PWA direction

PWA support is a post-GitHub-release phase.

The architecture should avoid browser-only assumptions that would block:

- service worker caching
- installable manifest
- responsive mobile UI
- resilient local draft state

PWA work must not compromise the server/provider security model.

## 13. Error boundaries

Every external operation should have explicit states:

- idle
- loading
- success
- retryable failure
- permanent/configuration failure

Important user-facing failures:

- authentication failure
- invalid API key
- provider rate limit
- provider/model unavailable
- unsupported attachment
- search failure
- malformed model response
- persistence failure
- preview failure

Never replace an error with an empty assistant response.
