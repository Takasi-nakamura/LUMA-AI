# LUMA AI Product Specification

## 1. Product identity

**Name:** LUMA AI  
**Audience:** Personal use  
**Primary platform:** Responsive web application  
**Release plan:** GitHub development/release first, PWA conversion after the initial web release.

## 2. Product concept

LUMA is a personal AI chat application that provides a familiar, polished chat experience while making **AI model switching** its primary differentiator.

LUMA does not attempt to beat ChatGPT as a general-purpose AI. Its purpose is to provide one clean environment in which the user can use multiple AI models through OpenRouter without changing applications.

### Product principles

1. Model switching is the core feature.
2. The interface should feel simple even when the underlying system is capable.
3. Features must be useful, not technology demonstrations.
4. Conversation state must be predictable and recoverable.
5. User actions should work consistently on desktop, tablet, and mobile.
6. API credentials are user-provided and must never be hard-coded.

## 3. UI/UX requirements

### Visual language

- Modern
- Stylish but restrained
- Minimal
- Rounded corners
- Black-and-white base palette
- User-selectable accent color
- Theme setting
- User-selectable font
- Responsive on desktop, tablet, and mobile
- Avoid excessive empty space
- Chat text must remain readable without becoming oversized

### Conversation sidebar

Positioned on the left on wide screens.

Contains:

- New Chat button
- Chat history
- Per-chat overflow menu
  - Rename
  - Delete
- Delete confirmation modal centered on screen
- Account/profile box at the bottom

Sidebar behavior:

- Dedicated collapse/expand control
- Clicking outside the sidebar collapses it when appropriate
- Opening a chat on compact screens may automatically collapse the sidebar
- On mobile, sidebar becomes an overlay/drawer rather than consuming permanent width

### Chat history

- Persistent per-user chat list
- Automatic title generation after the initial meaningful user message
- Manual rename
- Delete with confirmation
- Most recently active chats appear first

## 4. Settings

Settings are divided into tabs.

### Account

Firebase-backed:

- Create account
- Log in
- Log out
- Change account/display name
- Delete account

### API

- Enter OpenRouter API key
- Save/update key
- Validate key when practical
- Never display the full secret after saving
- Never commit the key to Git

### Personal Intelligence

Fields:

- "What should the AI call you?"
- Custom instructions

Custom instructions are included in model requests according to the conversation/request pipeline.

### Design

- Accent color
- Theme
- Font

## 5. Chat composer

Layout from left to right:

1. Plus/attachment button
2. Main text input
3. Model selector
4. Send button

The composer must remain usable at compact widths. Controls may wrap or collapse into a secondary menu on narrow screens.

### Attachments

The plus button opens file selection.

Initial target types:

- PDF
- Images

Before sending:

- Attachment appears as a card above/within the composer
- User can click the card to preview
- User can remove the attachment

After sending:

- Attachment remains visible in the conversation
- User can click it to preview
- The selected model receives the attachment when supported

### Composer model selector

The user can switch models before sending a message. The selected model is stored with the user message so that historical messages remain auditable.

## 6. AI response UI

Responses support:

- Full Markdown
- Headings
- Lists
- Links
- Blockquotes
- Inline code
- Code blocks
- Tables

### Response actions

Every AI response provides:

- Copy
- Regenerate

Regenerate is **branch-aware**. It does not simply append a new answer to the latest conversation. It regenerates from the selected message state, preserving the conversation context up to that point.

### Code blocks

Code blocks provide:

- Copy
- Download

HTML and SVG blocks additionally provide a preview action.

Preview must be sandboxed and must not gain unintended access to the parent application.

## 7. User message UI

Every user message provides:

- Copy
- Edit

Edit is also branch-aware. Editing a message creates a new continuation from that point instead of silently rewriting unrelated later history.

## 8. Web search

When enabled/available, the AI may use web search.

Search-enabled responses must expose sources at the end of the response.

A dedicated **Sources** area/action provides the links used for that response.

Sources should be associated with the individual assistant message rather than being global conversation metadata.

## 9. Conversation branching model

LUMA treats a conversation as a message tree rather than a single immutable linear list.

Each message has:

- Unique ID
- Conversation ID
- Parent message ID
- Role
- Content
- Model information when applicable
- Attachments
- Timestamp
- Revision/branch metadata

Regeneration creates a sibling assistant message under the same parent user message.

Editing creates a new user-message branch from the edited message's parent.

The active branch determines the context sent to the model.

## 10. Model switching

Model selection is intentionally independent from the conversation UI.

The application maintains a model registry containing:

- Internal model ID
- User-facing display name
- Provider
- Capabilities
- Availability status
- Optional descriptive text

The registry must be replaceable without redesigning the chat UI.

Initial model IDs are documented in `docs/MODEL_REGISTRY.md`.

## 11. Non-goals for the first release

Do not expand the first release into:

- Autonomous browser agents
- Full coding IDE
- Multi-user collaboration
- Complex team/workspace management
- Payment/subscription system
- Native desktop applications
- Native mobile applications

These may be considered later only if the core product remains stable.

## 12. Definition of done

The first web release is considered complete when:

- A user can authenticate.
- A user can configure an OpenRouter API key.
- A user can start, continue, rename, and delete chats.
- A user can switch among configured models.
- Messages persist correctly.
- Edit and regenerate create correct branches.
- Attachments can be previewed before and after sending.
- Supported attachments reach the selected model correctly.
- Markdown, tables, and code render correctly.
- Code copy/download works.
- HTML/SVG previews are safely isolated.
- Web-search sources are visible when search is used.
- Settings persist.
- Responsive layouts work across target screen sizes.
- Secrets are not committed to the repository.
- Basic error/loading/empty states are implemented.
- The application can be released from the GitHub repository without requiring hidden local state.
