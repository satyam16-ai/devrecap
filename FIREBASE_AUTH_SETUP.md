# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the DevRecap application.

## Overview

The authentication system requires users to sign in with **Google** or **GitHub** when downloading **premium cards**. Non-premium cards can be downloaded without authentication.

### What counts as a Premium Card?
A card is considered premium if ANY of the following are enabled:
- Premium Mode toggle is ON
- Custom background image is uploaded
- Custom quote is added
- Non-default theme is selected
- Non-default font is selected

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "DevRecap")
   - Enable/disable Google Analytics (optional)
   - Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Register app:
   - App nickname: `DevRecap Web`
   - Check **"Also set up Firebase Hosting"** (optional)
   - Click **"Register app"**
3. Copy the Firebase configuration object - you'll need these values

## Step 3: Enable Authentication Providers

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google**:
   - Click on "Google"
   - Toggle "Enable"
   - Set project support email
   - Click "Save"
3. Enable **GitHub**:
   - Click on "GitHub"
   - Toggle "Enable"
   - You'll need to create a GitHub OAuth App:

### Creating a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `DevRecap`
   - **Homepage URL**: `https://devrecap.site` (or your domain)
   - **Authorization callback URL**: Copy from Firebase (looks like `https://your-project.firebaseapp.com/__/auth/handler`)
4. Click **"Register application"**
5. Copy the **Client ID** and generate a **Client Secret**
6. Paste these into Firebase GitHub provider settings
7. Click "Save"

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in the `frontend` directory:
   ```bash
   cp env.template .env.local
   ```

2. Fill in your Firebase configuration values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. Get these values from:
   - Firebase Console → Project Settings → General
   - Scroll down to "Your apps"
   - Click on your web app
   - Copy the config values

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - `devrecap.site` (your production domain)
   - Any other domains you'll use

## Step 6: Test the Authentication

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to the dashboard and try to download a premium card
3. The authentication modal should appear
4. Test both Google and GitHub sign-in

## Authentication Flow

```
User clicks "Save Image" button
    ↓
System checks if card is premium
    ↓
If Premium + Not Authenticated → Show Auth Modal
    ↓
User signs in with Google/GitHub
    ↓
On success → Show Donation Modal → Download Card
    ↓
If Non-Premium OR Already Authenticated → Show Donation Modal → Download Card
```

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: The Firebase API key is safe to expose in client-side code (it's not a secret)
3. **Firebase Rules**: Consider setting up Firestore security rules if you add database features
4. **OAuth Secrets**: Keep GitHub OAuth Client Secret secure

## Future Payment Integration

The authentication system is designed to support future payment features:
- User accounts are ready for subscription management
- Firebase Auth integrates easily with Stripe
- User IDs can be used to track premium subscriptions
- Authentication state persists across sessions

## Troubleshooting

### "Auth domain not authorized"
- Add your domain to Firebase Authorized domains
- Make sure you're using the correct auth domain in `.env.local`

### "Popup blocked"
- Ensure popups are allowed for your domain
- Try using redirect-based auth instead of popup (requires code changes)

### "GitHub OAuth error"
- Verify callback URL in GitHub OAuth app matches Firebase
- Check that Client ID and Secret are correct in Firebase

### "Firebase not initialized"
- Verify all environment variables are set correctly
- Restart the development server after changing `.env.local`

## Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)

## Support

If you encounter issues, check:
1. Firebase Console → Authentication → Users (to see if sign-ins are being recorded)
2. Browser console for error messages
3. Network tab to see authentication requests
