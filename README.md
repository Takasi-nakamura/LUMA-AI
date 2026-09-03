# Luma AI

Luma is a personal, multi-model AI workspace. Its main advantage is the ability to switch OpenRouter models from the same chat UI.

## Implemented in v0.1
- Modern monochrome responsive chat UI
- Chat history, automatic titles, rename and delete confirmation
- OpenRouter API key settings stored locally in the browser
- Model switcher for the configured free model IDs
- Web search toggle via OpenRouter web plugin
- Image/PDF/text file attachment cards and image preview
- Markdown + GFM tables
- Code blocks with copy/save and HTML/SVG preview
- Copy/edit controls on user messages
- Regeneration from the selected conversation point
- Personal intelligence/custom instructions
- Theme, accent and font settings
- Optional Firebase email/password account flow
- PWA manifest foundation

## Local setup
1. `npm install`
2. Create `.env.local` with Firebase variables if account sync is desired:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. `npm run dev`
4. Open Luma and enter an OpenRouter API key under Settings → API.

## Security note
The OpenRouter key is intentionally a personal-use browser setting and is not committed to the repository. For public multi-user deployment, move provider calls behind a server-side proxy and add appropriate authentication/rate limiting.

## Roadmap
- Durable Firestore chat sync
- Robust PDF text extraction and multimodal document pipeline
- Source rendering for web-search annotations
- Installable PWA service worker/offline shell
- Model capability registry and automatic model selection
- Tests and CI
