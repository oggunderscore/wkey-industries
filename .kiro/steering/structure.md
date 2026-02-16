# Project Structure

## Root Layout

```
/
├── src/                    # Main application source
├── vanish-ui/              # Shared design system (separate project)
├── static/                 # Static assets
├── build/                  # Production build output
├── .kiro/                  # Kiro configuration and steering
└── node_modules/           # Dependencies
```

## Source Directory (`/src`)

```
src/
├── routes/                 # SvelteKit file-based routing
│   ├── +page.svelte       # Homepage
│   ├── +layout.svelte     # Root layout
│   ├── +layout.js         # Layout load function
│   ├── +error.svelte      # Error page
│   └── login/             # Login route
├── lib/                    # Shared library code
│   ├── components/        # Reusable Svelte components
│   │   ├── AuthModal.svelte
│   │   ├── Login.svelte
│   │   └── LoadingSpinner.svelte
│   ├── stores/            # Svelte stores
│   │   └── authStore.js   # Authentication state management
│   └── firebase.js        # Firebase initialization
├── app.html               # HTML template
└── app.css                # Global styles
```

## Vanish-UI Design System (`/vanish-ui`)

Separate SvelteKit project containing shared components and utilities:

```
vanish-ui/src/lib/
├── components/            # UI components
│   ├── shared/           # Reusable UI primitives
│   │   ├── Checkbox.svelte
│   │   ├── Toggle.svelte
│   │   ├── Slider.svelte
│   │   ├── ColorPicker.svelte
│   │   └── ...
│   └── [feature components]
├── stores/               # Shared stores (auth, settings, theme, websocket)
└── utils/                # Utility functions (animations, theme)
```

## Code Organization Patterns

- **Components**: Place in `/src/lib/components/` for reusability
- **Stores**: Svelte stores in `/src/lib/stores/` for state management
- **Routes**: Use SvelteKit file-based routing in `/src/routes/`
- **Styles**: Global styles in `app.css`, component styles in `<style>` blocks
- **Browser-only code**: Check `browser` from `$app/environment` before accessing browser APIs
- **Environment variables**: Access via `import.meta.env.VITE_*`

## Styling Conventions

- Use CSS custom properties defined in `app.css` for theming
- Dark theme by default with purple accent (`--accent-primary: #a855f7`)
- Smooth transitions (0.2s ease) for interactive elements
- Respect `prefers-reduced-motion` for accessibility
