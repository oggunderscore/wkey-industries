# WKEY Industries Website

Modern Svelte-based website for wkey-industries.net, styled with the vanish-ui design system.

## Features

- Clean, modern dark theme inspired by vanish-ui
- Responsive design
- Smooth animations and hover effects
- Optimized for Netlify deployment
- Static site generation for fast loading

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Netlify

1. Push this repository to GitHub
2. Connect your GitHub repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Deploy!

Build settings are already configured in `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `build`

## Services

The website showcases three main services:
- **Photos**: Photo & Video Management (photos.wkey-industries.net)
- **Cloud**: File Storage & Collaboration (cloud.wkey-industries.net)
- **Map**: Interactive Mapping Service (map.wkey-industries.net)

## Design

The design uses the vanish-ui color scheme:
- Primary accent: Purple (#a855f7)
- Dark backgrounds with subtle gradients
- Smooth transitions and hover effects
- Modern, clean typography with Inter font
