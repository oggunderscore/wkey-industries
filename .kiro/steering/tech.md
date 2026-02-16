# Tech Stack

## Core Technologies

- **Framework**: SvelteKit 2.0 with Svelte 5.0
- **Build Tool**: Vite 5.0
- **Adapter**: @sveltejs/adapter-static (for static site generation)
- **Authentication**: Firebase 12.9.0
- **Deployment**: Netlify
- **Language**: JavaScript (ES modules)

## Design System

The project uses the vanish-ui design system (located in `/vanish-ui` directory) which provides:
- Shared components and utilities
- Consistent theming with CSS custom properties
- Dark theme with purple accent colors
- Typography: Inter font family

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production (outputs to /build)
npm run preview      # Preview production build

# Vanish-UI (separate project)
cd vanish-ui
npm run dev          # Start vanish-ui dev server with --host flag
npm run check        # Type checking with svelte-check
```

## Environment Variables

Firebase configuration uses Vite environment variables (prefix: `VITE_`):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Store these in `.env` file (see `.env.example` for template).

## Build Configuration

- **Static Adapter**: Configured for SPA mode with fallback to `index.html`
- **Output**: `build` directory
- **Netlify**: Auto-configured via `netlify.toml`
