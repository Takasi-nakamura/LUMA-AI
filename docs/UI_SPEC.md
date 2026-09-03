# LUMA AI UI Specification

## Global shell

```text
+--------------------------------------------------------------+
| Sidebar |                    Chat                             |
|         |                                                     |
| New     |              conversation messages                  |
| Chats   |                                                     |
|         |                                                     |
|         |                                                     |
| Account |              +-----------------------+              |
|         |              | message composer       |              |
+---------+              +-----------------------+--------------+
```

## Desktop

- Sidebar is visible by default.
- Chat content uses a readable maximum width.
- Composer remains visually attached to the conversation area.
- Avoid unnecessary full-width text blocks.

## Tablet

- Sidebar may be collapsed by default depending on available width.
- Composer controls must remain accessible without horizontal scrolling.

## Mobile

- Sidebar becomes a drawer/overlay.
- Tapping outside the drawer closes it.
- Chat occupies the available viewport width.
- Composer controls may use compact icon buttons and secondary menus.
- Touch targets must remain comfortably tappable.

## Sidebar states

### Expanded

Shows logo/brand, new chat, history, and account box.

### Collapsed

Shows only essential icons and an expand control.

### Mobile drawer

Opens above the chat and closes after selection or outside tap.

## Chat states

### Empty chat

Center area contains a concise welcome/empty state and the composer.

### Active chat

Messages are vertically ordered. The current branch is the visible active path.

### Loading

Show an assistant-generation state without pretending that a final response exists.

### Error

Show an actionable error with retry when possible.

## Message actions

Assistant:

- Copy
- Regenerate
- Sources when sources exist

User:

- Copy
- Edit

Actions should be discoverable without permanently cluttering the message surface. They may become more visible on hover/focus while remaining keyboard/touch accessible.

## Attachment cards

Before sending:

- Show filename
- Show type/icon
- Show compact preview when possible
- Show remove control

After sending:

- Keep a compact attachment card associated with the message
- Click/tap opens a preview surface

## Preview surface

Use a modal or dedicated overlay.

PDF:

- Render a safe preview when supported
- Provide close control

Image:

- Fit image to available viewport
- Preserve aspect ratio

HTML/SVG generated code:

- Render inside an isolated/sandboxed preview surface
- Never execute arbitrary generated content in the parent application context

## Settings

Use a tabbed layout:

```text
Settings
[ Account ] [ API ] [ Personal Intelligence ] [ Design ]
```

Settings must be usable on mobile. Tabs may become a segmented control or scrollable tab row.

## Visual rules

- Base palette: black, white, neutral grays
- Rounded cards and controls
- Consistent border radius scale
- Minimal shadows
- Clear typography hierarchy
- Strong focus states
- No unnecessary gradients or decorative elements that compete with chat content

## Accessibility

Minimum requirements:

- Keyboard navigation
- Visible focus states
- Semantic buttons and form controls
- Labels for icon-only controls
- Accessible modal dismissal
- Sufficient contrast
- Reduced-motion consideration
- Screen-reader-friendly message roles and status announcements

## Responsive acceptance criteria

The UI must remain usable at:

- Wide desktop
- Standard laptop
- Tablet portrait/landscape
- Mobile portrait
- Mobile landscape

No primary action should require horizontal page scrolling.
