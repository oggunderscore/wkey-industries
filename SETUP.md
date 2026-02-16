# WKEY Industries - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase (Optional)
If you want to enable authentication features:

1. Follow the instructions in `FIREBASE_SETUP.md`
2. Create a `.env` file with your Firebase credentials
3. Without Firebase config, the site will still work but authentication features will be disabled

### 3. Development
```bash
npm run dev
```
Visit `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```
Visit `http://localhost:4173`

## Features

### Design
- Dark, minimalistic interface with vibrant purple (#a855f7) theme
- Smooth animations and transitions
- Clean SVG icons (no emojis)
- Responsive design for mobile and desktop
- Subtle gradient effects and glows

### Authentication
- Firebase email/password authentication
- User registration and login
- Protected routes (Cloud and Map services require login)
- Persistent authentication state
- Account management

### Services
- **Photos**: Public access - Photo & Video Management
- **Cloud**: Requires login - File Storage & Collaboration  
- **Map**: Requires login - Interactive Mapping Service

## Project Structure
```
src/
├── lib/
│   ├── components/
│   │   └── AuthModal.svelte    # Authentication modal
│   ├── stores/
│   │   └── authStore.js        # Authentication state management
│   └── firebase.js             # Firebase configuration
├── routes/
│   ├── +layout.svelte          # Root layout
│   └── +page.svelte            # Home page
├── app.css                     # Global styles
└── app.html                    # HTML template
```

## Deployment
The site is configured for Netlify deployment using `@sveltejs/adapter-static`.

See `DEPLOYMENT.md` for deployment instructions.
