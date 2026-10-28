# Heena Arora Fashion

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
## Run locally

Create a `.env.local` file in the project root and add your Gemini API key. See `.env.example` for the supported variables:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-flash-latest
GEMINI_IMAGE_MODEL=gemini-nano-banana-2.1
```

The couture assistant sends messages to `/api/chat`, which calls Gemini on the server using `GEMINI_MODEL` (default: `gemini-flash-latest`). The AI Virtual Try-On sends garment and optional model-reference images to `/api/try-on`, which uses Gemini's image-generation/editing model configured by `GEMINI_IMAGE_MODEL` (default: `gemini-nano-banana-2.1`). The API key is never exposed to browser code. The try-on endpoint accepts JPEG, PNG, and WebP inputs, processes them for generation, and does not persist them in this app.

Image generation requires a valid Gemini API key, model availability for your account/region, and may incur provider charges or rate limits. Generated previews are not a guarantee of garment fit or appearance. Live generation requires server-side configuration and must be tested with an enabled API key.

## Run and verify

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

For Vercel, add `GEMINI_API_KEY` and optionally `GEMINI_MODEL` and `GEMINI_IMAGE_MODEL` as server environment variables, then redeploy.
