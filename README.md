# LUMA AI

LUMA is a personal AI chat application focused on a simple, modern chat experience with **easy AI model switching**.

## Core concept

LUMA is not intended to outperform ChatGPT as a general-purpose AI. Its main advantage is providing one clean interface where the user can switch between multiple models through OpenRouter.

## Planned features

- Modern, minimal black-and-white UI with rounded components
- Responsive layout for desktop, tablet, and mobile
- Collapsible conversation sidebar
- New chats and persistent chat history
- Automatic chat title generation
- Rename and delete chats with confirmation
- Firebase authentication and account management
- OpenRouter API key configuration
- Multiple selectable AI models
- Personal Intelligence / custom instructions
- Accent color, theme, and font settings
- File attachments
- PDF and image preview before and after sending
- AI access to attached files
- Markdown responses
- Code blocks with copy/download actions
- HTML and SVG preview
- Tables
- Copy and regenerate controls for AI responses
- Copy and edit controls for every user message
- Regeneration and editing from the selected conversation point
- Web search with source links shown at the end of responses
- PWA support after the GitHub development phase

## Model registry

Models are stored internally by model ID and displayed with user-friendly names in the UI. The initial registry is planned around these OpenRouter IDs:

- `nvidia/nemotron-3.5-lightning:free`
- `nvidia/nemotron-3-ultra-550b-a55b:free`
- `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`
- `google/gemma-4-26b-a4b-it:free`
- `nvidia/nemotron-3-super-120b-a12b:free`

The registry should remain configurable so models can be replaced when provider availability or limits change.

## Planned architecture

- Frontend: responsive web application
- Authentication and user data: Firebase
- AI gateway: OpenRouter
- Model selection: internal model registry
- Web search: provider-backed search integration
- File handling: client-side preview plus model-compatible attachment processing
- PWA: planned after the initial GitHub release

## Privacy and API keys

LUMA is intended for personal use. API credentials should never be hard-coded into the repository or committed to Git. Users provide their own OpenRouter API key through the settings UI.

## Status

🚧 **In development**

This repository currently contains the product plan and project specification. Implementation will be added incrementally.
