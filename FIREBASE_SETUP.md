# Firebase Authentication Setup

## Prerequisites
- A Firebase account (free tier works fine)
- Node.js and npm installed

## Setup Steps

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Enable Authentication
1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Save your changes

### 3. Get Your Firebase Config
1. Go to Project Settings (gear icon in the left sidebar)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "WKEY Industries Web")
5. Copy the Firebase configuration object

### 4. Configure Your App
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 5. Run the App
```bash
npm run dev
```

## Features
- User registration with email/password
- User login
- Protected routes (Cloud and Map services require authentication)
- Persistent authentication state
- Sign out functionality

## Security Notes
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use Firebase Security Rules to protect your data
- Consider adding email verification for production use
