# Firebase Authentication - Production Setup

## Your Firebase Configuration

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBsAHTJ_GG-D-aKe2Hy1C3B60MldbCDCtc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=devrecap-e8336.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=devrecap-e8336
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=devrecap-e8336.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=469887475848
NEXT_PUBLIC_FIREBASE_APP_ID=1:469887475848:web:c3faf552d45634d5d6bf3d
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-06TRGZDGQR
```

## Quick Setup Instructions

### 1. Local Development Setup

Create a `.env.local` file in the `frontend` directory and paste the above configuration.

```bash
cd frontend
# Create .env.local and paste the config above
```

### 2. Production Deployment (Vercel)

Add these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable from above (one by one)
4. Make sure to add them for **Production**, **Preview**, and **Development** environments

### 3. Enable Authentication Providers in Firebase

#### Enable Google Sign-In:
1. Go to [Firebase Console](https://console.firebase.google.com/project/devrecap-e8336/authentication/providers)
2. Click on **Google** provider
3. Toggle **Enable**
4. Set support email: your-email@gmail.com
5. Click **Save**

#### Enable GitHub Sign-In:
1. Create a GitHub OAuth App:
   - Go to https://github.com/settings/developers
   - Click **New OAuth App**
   - Fill in:
     - **Application name**: DevRecap
     - **Homepage URL**: https://devrecap.site
     - **Authorization callback URL**: `https://devrecap-e8336.firebaseapp.com/__/auth/handler`
   - Click **Register application**
   - Copy **Client ID** and generate **Client Secret**

2. Configure in Firebase:
   - Go to Firebase Console → Authentication → Sign-in method
   - Click on **GitHub**
   - Toggle **Enable**
   - Paste **Client ID** and **Client Secret**
   - Click **Save**

### 4. Configure Authorized Domains

Add your production domain to Firebase:

1. Go to Firebase Console → Authentication → Settings → **Authorized domains**
2. Add these domains:
   - `devrecap.site`
   - `www.devrecap.site`
   - `devrecap-e8336.firebaseapp.com` (already added)
   - `localhost` (for development)

### 5. Test Authentication

After deployment:
1. Visit https://devrecap.site/dashboard
2. Customize a card with premium features (change theme, add custom image, etc.)
3. Click **Save Image**
4. Auth modal should appear
5. Test both Google and GitHub sign-in
6. Verify download works after authentication

## Security Notes

✅ **Safe to commit**: Firebase API keys (they're designed to be public)
❌ **Never commit**: `.env.local` file (already in .gitignore)
❌ **Keep secret**: GitHub OAuth Client Secret

## Troubleshooting

### "Auth domain not authorized"
- Add your domain to Firebase Authorized domains (step 4 above)

### "Popup blocked"
- Ensure browser allows popups for your domain
- Users may need to allow popups in browser settings

### "GitHub OAuth error"
- Verify callback URL matches exactly: `https://devrecap-e8336.firebaseapp.com/__/auth/handler`
- Check Client ID and Secret are correct

## What's Implemented

✅ Google Authentication
✅ GitHub Authentication  
✅ Premium card detection (theme, font, custom image, custom quote, premium toggle)
✅ Non-premium cards downloadable without auth
✅ User profile in Navbar with sign-out
✅ Beautiful auth modal with premium design
✅ Auth state persistence across sessions
✅ Ready for future payment integration

## Next Steps for Payment Integration

When you're ready to add payments:
1. User authentication is already set up
2. Use Firebase user ID to track subscriptions
3. Integrate Stripe with Firebase Auth
4. Add subscription status to user profile
5. Check subscription status before allowing premium downloads
