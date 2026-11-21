# J.A.R.V.I.S. NOVA — REDESIGN 2.0

A mobile-first personal AI web app with a cinematic blue reactor identity, text chat, browser speech recognition, device speech synthesis, Hindi/English controls, PWA assets, and a separate Cloudflare Worker gateway.

## Included
- Static web app: `index.html`, `style.css`, `app.js`.
- Arc Reactor artwork and 192/512px launcher icons in `assets/`.
- PWA manifest and service worker.
- Cloudflare Pages config (`wrangler.toml`) and security headers (`_headers`).
- Cloudflare Worker source in `worker/`, configured for Groq's OpenAI-compatible API.
- No API key embedded in the frontend or repository.

## Deploy website to Cloudflare Pages
1. Upload the contents of this folder (not the ZIP) to a GitHub repository.
2. Cloudflare Dashboard > Workers & Pages > Create > Pages > Connect to Git.
3. Select the repository, use repository root, leave build command empty, and use `.` as build output directory if prompted.
4. Deploy and note the `https://...pages.dev` URL.

## Deploy AI Worker separately
1. Deploy `worker/index.js` as a separate Cloudflare Worker, using Wrangler from the `worker/` folder or the dashboard.
2. Add a Worker secret named `GROQ_API_KEY`. Never put this key in HTML, `app.js`, or GitHub.
3. Set Worker variable `ALLOWED_ORIGIN` to the exact Pages origin (recommended).
4. Deploy the Worker, copy its URL, paste it into JARVIS > Neural Link, and press Save.

### Wrangler
Install Wrangler (`npm install -g wrangler`), run `wrangler login`, then from `worker/` run `wrangler secret put GROQ_API_KEY`, configure `ALLOWED_ORIGIN` in the dashboard, and run `wrangler deploy`.

## Voice realism
The app uses voices installed on the phone/browser and lets you select one. It prefers a male-style named voice when detectable, but browser APIs cannot reliably identify voice gender or guarantee natural human sound. Install a high-quality English (India) or Hindi voice through Android Text-to-speech settings, reload the app, and select it. It does not clone the exact actor/film JARVIS voice.

## Limitations
- Voice recognition starts only after tapping the reactor and granting microphone permission.
- A PWA cannot reliably listen for a wake word with the screen off. That needs a native Android app/service and local wake-word engine, subject to Android background restrictions.
- This package is not an APK and is not deployed to your Cloudflare account.
- Provider keys, models, free quotas, and availability can change; unlimited free API usage is not promised.
- No device actions occur unless supported integrations and permissions are added.

## Privacy
The frontend stores only the Worker URL locally. The API key belongs in a Cloudflare Worker secret. Chat messages are sent to the configured AI provider when connected. Avoid sending sensitive information unless you accept the provider's data policies.


## Exact uploaded reactor artwork
The app reactor image and PWA launcher icons now use the user's latest uploaded blue-white triangular reactor image (square-cropped for icon formats). This replaces the previous artwork.

## Not completed by this package
This ZIP does not mean the user's Cloudflare account has been deployed, an API secret has been provisioned, a paid/free voice provider has been connected, or a native Android APK/wake-word service has been built. Those require account authorization, provider credentials, and a native Android build/signing workflow. Browser speech synthesis uses installed device voices; it cannot guarantee a natural human male voice or clone the film voice.
