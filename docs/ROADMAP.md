# LUMA AI Development Roadmap

## Phase 0 - Foundation

- [ ] Choose frontend stack
- [ ] Establish project structure
- [ ] Configure environment variables
- [ ] Configure Firebase project
- [ ] Configure linting/formatting
- [ ] Establish design tokens
- [ ] Establish model registry

## Phase 1 - Core shell

- [ ] App layout
- [ ] Responsive sidebar
- [ ] New chat
- [ ] Chat history
- [ ] Account box
- [ ] Empty/loading/error states

## Phase 2 - Authentication and persistence

- [ ] Account creation
- [ ] Login
- [ ] Logout
- [ ] Account name change
- [ ] Account deletion
- [ ] Firestore conversation persistence
- [ ] Firebase security rules

## Phase 3 - AI core

- [ ] OpenRouter adapter
- [ ] API key settings
- [ ] Model selector
- [ ] Streaming response if supported by chosen stack
- [ ] Markdown rendering
- [ ] Code blocks
- [ ] Copy response
- [ ] Regenerate
- [ ] Automatic title generation

## Phase 4 - Conversation branching

- [ ] Message tree data model
- [ ] Active branch resolution
- [ ] Regeneration as sibling branch
- [ ] User-message editing as branch
- [ ] Branch-safe persistence
- [ ] Branch UI indicators where needed

## Phase 5 - Attachments

- [ ] File picker
- [ ] Drag and drop
- [ ] PDF preview
- [ ] Image preview
- [ ] Attachment cards
- [ ] Model capability checks
- [ ] Provider transport
- [ ] Post-send attachment display

## Phase 6 - Advanced response formats

- [ ] Tables
- [ ] Code copy
- [ ] Code download
- [ ] HTML preview
- [ ] SVG preview
- [ ] Safe preview isolation

## Phase 7 - Web search

- [ ] Search adapter
- [ ] Search-enabled request flow
- [ ] Source extraction
- [ ] Sources UI
- [ ] Per-response source persistence
- [ ] Search failure/retry states

## Phase 8 - Personal Intelligence and design

- [ ] AI call name
- [ ] Custom instructions
- [ ] Accent color
- [ ] Theme
- [ ] Font
- [ ] Persist settings

## Phase 9 - Quality pass

- [ ] Keyboard accessibility
- [ ] Mobile UX pass
- [ ] Tablet UX pass
- [ ] Error-state audit
- [ ] Loading-state audit
- [ ] Empty-state audit
- [ ] Security review
- [ ] Secret scanning
- [ ] Performance pass
- [ ] Cross-browser testing

## Phase 10 - GitHub release

- [ ] Production build
- [ ] Documentation review
- [ ] Setup instructions
- [ ] Environment variable documentation
- [ ] Known limitations
- [ ] License decision
- [ ] Initial public release

## Phase 11 - PWA

Post-GitHub release only.

- [ ] Web app manifest
- [ ] Service worker
- [ ] Installability
- [ ] Offline shell
- [ ] Local draft recovery
- [ ] Mobile install testing
- [ ] PWA-specific security review

## Future ideas, not first-release commitments

- [ ] Auto model selection
- [ ] Model comparison mode
- [ ] Conversation export/import
- [ ] More file types
- [ ] Local models
- [ ] Optional server-side API-key vault
- [ ] Advanced search controls
