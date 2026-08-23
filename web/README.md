# Restoran (React)

React rebuild of the Restoran HTML template. Same look, separate from the original `.html` files. Built for **Cloudflare Pages**.

## Run locally

```bash
cd web
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

Output is `web/dist`.

## Deploy on Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages**.
3. Connect the repo.
4. Settings:
   - **Root directory:** `web`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Deploy.

SPA routes (`/about`, `/menu`, …) are handled by `public/_redirects`.

You can also drag-and-drop the `dist` folder onto Pages for a one-off upload.
