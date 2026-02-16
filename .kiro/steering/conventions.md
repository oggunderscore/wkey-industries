# Development Conventions

## Code Generation Rules

- **No unit tests**: Do not generate unit test files or test cases unless explicitly requested by the user
- **No summary documents**: Do not create markdown files summarizing changes or documenting work unless explicitly requested
- **Minimal output**: Keep responses concise and focused on the actual implementation

## Code Style

- Use JavaScript (ES modules) throughout the project
- Prefer `const` over `let` when variables won't be reassigned
- Use async/await for asynchronous operations
- Keep components focused and single-purpose

## Component Conventions

- Use Svelte 5.0 runes syntax when appropriate
- Keep component files under 200 lines when possible
- Extract reusable logic into stores or utility functions
- Always check `browser` from `$app/environment` before accessing browser APIs

## Firebase Integration

- Always handle Firebase initialization errors gracefully
- Check if Firebase is configured before using auth features
- Use the centralized `authStore` for authentication state
- Never commit Firebase credentials to version control

## Styling

- Use CSS custom properties from `app.css` for theming
- Keep component-specific styles in `<style>` blocks
- Follow the vanish-ui design system patterns
- Maintain consistent spacing and transitions (0.2s ease)
