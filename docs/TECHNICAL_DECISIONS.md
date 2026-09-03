# LUMA AI Technical Decisions

This document records decisions that prevent accidental scope drift.

## Decision 1: OpenRouter as the AI gateway

**Status:** Planned

OpenRouter is the initial provider abstraction because LUMA's core product value is model switching.

The rest of the application should depend on an internal provider-neutral generation interface rather than OpenRouter-specific response shapes.

## Decision 2: Firebase for identity and application persistence

**Status:** Planned

Firebase is used for authentication and user-owned application data.

The final schema and security rules must be reviewed before production release.

## Decision 3: Model registry instead of hard-coded UI options

**Status:** Required

Model IDs are configuration. Components must consume `ModelDefinition` objects.

Reason: providers and free-model availability can change. LUMA should be able to replace models without rewriting the chat UI.

## Decision 4: Message tree instead of destructive editing

**Status:** Required

Regeneration and editing create new branches.

Reason: the user explicitly wants regeneration/editing to operate from the conversation point at which the action was requested.

## Decision 5: GitHub web release before PWA

**Status:** Required

PWA work is deliberately deferred until the web version is stable.

Reason: avoid adding service-worker/offline complexity before core product behavior is reliable.

## Decision 6: Personal-use first

**Status:** Required

The first target is the owner's personal workflow, not a public SaaS business.

This reduces unnecessary scope such as billing, teams, collaboration, and enterprise administration.

## Decision 7: Do not build an autonomous browser agent in v1

**Status:** Deferred

LUMA can provide web search and source links, but autonomous browser control is not part of the first release.

Reason: the product differentiator is model switching, not browser automation.

## Decision 8: Preserve user-visible simplicity

**Status:** Required

Advanced internals should not make the interface feel like a developer console.

The user should be able to switch models, attach files, search, and manage conversations without understanding provider infrastructure.

## Decision 9: Model switching must preserve history

**Status:** Required

Changing the selected model changes future generation. Historical messages retain the model metadata used to produce them.

## Decision 10: Generated previews are isolated

**Status:** Required

HTML/SVG previews are untrusted content and must not execute in the main application context.
