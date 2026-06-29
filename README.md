# JellyReader

A Progressive Web App (PWA) comic reader for Jellyfin. Connect to your Jellyfin server and read CBZ comics on any device.

## Features

- Jellyfin authentication
- Browse comic libraries
- Continue Reading
- Search comics
- Comic reader (single page and vertical scroll modes)
- LTR / RTL (manga) reading direction
- Reading progress sync
- Offline downloads (via Service Worker)
- Dark mode
- PWA installable on iOS, Android, Desktop

## Tech Stack

- React 19 + TypeScript
- Vite 8
- TailwindCSS 4
- TanStack Query
- React Router 7
- Dexie (IndexedDB)
- fflate (CBZ extraction)
- vite-plugin-pwa

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/`.

## Deployment (Cloudflare Pages)

1. Push this repo to GitHub / GitLab
2. In Cloudflare Pages, create a new project connected to the repo
3. Build command: `npm run build`
4. Build output: `dist`
5. Custom domain: `read.27012610.xyz`

### SPA Routing

Cloudflare Pages handles SPA routing via the `_redirects` file:
```
/*    /index.html   200
```

## Jellyfin Configuration

Default server: `https://jf.27012610.xyz`

The app works with any Jellyfin server that has comic/books libraries (CBZ files). No plugins required.

## Environment

No environment variables needed. Server URL is entered at login.

## License

MIT
