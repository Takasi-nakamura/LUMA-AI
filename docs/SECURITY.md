# LUMA AI Security Design

LUMA is a personal-use application, but it still handles authentication data, API credentials, private conversations, and potentially sensitive files. Security is therefore a first-class requirement.

## 1. API key handling

- Never hard-code OpenRouter API keys.
- Never commit API keys to Git.
- Never place API keys in URLs.
- Do not log API keys.
- Do not expose the full key in the settings UI after saving.
- Avoid sending API keys to analytics or error-reporting systems.

The exact storage strategy must be chosen based on the deployment architecture. If keys are stored client-side, document that the user-provided key is accessible to the browser environment. A server-side proxy/vault is safer for public deployment.

## 2. Firebase authorization

All user-owned Firestore data must be scoped to the authenticated user ID.

Security rules must prevent:

- Cross-user reads
- Cross-user writes
- Cross-user deletion
- Unauthorized modification of account-owned settings

Never trust a UID supplied by the client without checking the authenticated principal in Firebase Security Rules.

## 3. File security

Treat uploaded files as untrusted input.

- Enforce file type and size limits.
- Validate MIME types rather than trusting file extensions alone.
- Do not execute uploaded files.
- Sanitize metadata used in UI.
- Generate safe preview URLs.
- Revoke temporary object URLs when no longer needed.

## 4. HTML/SVG preview security

Generated HTML/SVG can contain active content.

Preview must be isolated from the main application. Use an appropriate sandboxed iframe or equivalent isolation boundary.

Do not inject arbitrary generated HTML into the main DOM with unrestricted `innerHTML`.

If a preview needs scripts, isolate them from application credentials, cookies, local storage, and parent DOM access.

## 5. Markdown rendering

AI-generated Markdown is untrusted content.

The renderer must sanitize unsafe HTML and dangerous URL schemes. Links should not be allowed to silently execute scripts or access privileged application contexts.

## 6. Web sources

Source URLs returned by search are untrusted external destinations.

- Display source domains clearly.
- Use safe link handling.
- Do not automatically execute source content.
- Do not treat web content as trusted application instructions.

## 7. Prompt/content boundaries

User files, web pages, and model outputs may contain instruction-like text. The application must treat them as content rather than trusted application configuration.

Personal Intelligence is user configuration and should be inserted into the request pipeline deliberately, not concatenated into arbitrary untrusted content without clear boundaries.

## 8. Error handling

Errors must not expose:

- API keys
- Firebase credentials
- Authorization tokens
- Private storage paths where unnecessary
- Full provider request headers
- Sensitive file contents

Use user-safe error messages and keep detailed diagnostics out of production UI unless explicitly sanitized.

## 9. Repository hygiene

Recommended repository protections:

- `.env` files ignored
- Example configuration contains placeholders only
- Secret scanning enabled where available
- No credentials in README, issues, screenshots, or test fixtures

## 10. Account deletion

Account deletion must address both identity and application data.

At minimum, define cleanup behavior for:

- Profile/settings
- Conversations
- Messages
- Attachment metadata
- Stored attachments

## 11. Threat model priorities

Highest priority:

1. API credential leakage
2. Cross-user Firebase access
3. Arbitrary code execution through previews
4. Unsafe Markdown/HTML rendering
5. Malicious attachment handling
6. Sensitive information leakage through logs/errors

## 12. Public release note

LUMA is initially intended for personal use. Before inviting external users, perform a dedicated security review of API-key storage, Firebase rules, attachment storage, preview isolation, and rate limiting.
