# Production Deployment Checklist - Firebase Authentication

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup

#### Local Development (.env.local)
Create `frontend/.env.local` with:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBsAHTJ_GG-D-aKe2Hy1C3B60MldbCDCtc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=devrecap-e8336.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=devrecap-e8336
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=devrecap-e8336.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=469887475848
NEXT_PUBLIC_FIREBASE_APP_ID=1:469887475848:web:c3faf552d45634d5d6bf3d
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-06TRGZDGQR
```

#### Vercel Environment Variables
Add all variables above in Vercel Dashboard → Settings → Environment Variables

**Important**: Add for all environments (Production, Preview, Development)

---

### 2. Firebase Console Configuration

#### A. Enable Authentication Providers

**Google Sign-In:**
- [ ] Go to Firebase Console → Authentication → Sign-in method
- [ ] Enable Google provider
- [ ] Set support email
- [ ] Save changes

**GitHub Sign-In:**
- [ ] Create GitHub OAuth App at https://github.com/settings/developers
  - Application name: `DevRecap`
  - Homepage URL: `https://devrecap.site`
  - Callback URL: `https://devrecap-e8336.firebaseapp.com/__/auth/handler`
- [ ] Copy Client ID and Client Secret
- [ ] Enable GitHub provider in Firebase
- [ ] Paste Client ID and Client Secret
- [ ] Save changes

#### B. Configure Authorized Domains
- [ ] Go to Firebase Console → Authentication → Settings → Authorized domains
- [ ] Add: `devrecap.site`
- [ ] Add: `www.devrecap.site`
- [ ] Add your Vercel URL (e.g., `frontend-*.vercel.app`) if testing on preview links
- [ ] Verify `localhost` is present (for development)
- [ ] Verify `devrecap-e8336.firebaseapp.com` is present

**CRITICAL**: You MUST add `devrecap.site` here, otherwise you will get `auth/unauthorized-domain` error.

---

### 3. Code Verification

- [x] Firebase config created (`lib/firebase.ts`)
- [x] Auth context provider created (`context/AuthContext.tsx`)
- [x] Auth modal component created (`components/AuthModal.tsx`)
- [x] Dashboard integrated with auth
- [x] Navbar shows user profile
- [x] Premium card detection logic implemented
- [x] Non-premium cards work without auth

---

### 4. Build & Deploy

```bash
# Test local build
cd frontend
npm run build

# If build succeeds, deploy to Vercel
git add .
git commit -m "feat: Add Firebase authentication for premium downloads"
git push origin main
```

---

### 5. Post-Deployment Testing

#### Test Non-Premium Download (No Auth Required)
- [ ] Visit https://devrecap.site
- [ ] Generate a card with default settings
- [ ] Click "Save Image"
- [ ] Should show donation modal (no auth required)
- [ ] Download should work

#### Test Premium Download (Auth Required)
- [ ] Visit https://devrecap.site/dashboard
- [ ] Change theme to non-default
- [ ] Click "Save Image"
- [ ] Should show auth modal
- [ ] Test Google sign-in
- [ ] Verify download works after auth
- [ ] Test GitHub sign-in
- [ ] Verify download works after auth

#### Test User Profile
- [ ] Verify user profile appears in Navbar after sign-in
- [ ] Check profile dropdown shows user info
- [ ] Test sign-out functionality
- [ ] Verify profile disappears after sign-out

#### Test Premium Features
- [ ] Custom theme → requires auth
- [ ] Custom font → requires auth
- [ ] Custom background image → requires auth
- [ ] Custom quote → requires auth
- [ ] Premium toggle ON → requires auth
- [ ] All default settings → no auth required

---

### 6. Security Verification

- [ ] `.env.local` is in `.gitignore`
- [ ] No sensitive credentials in git history
- [ ] Firebase security rules are appropriate
- [ ] CORS settings are correct
- [ ] Authorized domains are properly configured

---

### 7. User Experience Testing

- [ ] Auth modal is visually appealing
- [ ] Loading states work correctly
- [ ] Error messages are user-friendly
- [ ] Mobile responsiveness is maintained
- [ ] Auth flow is smooth and intuitive
- [ ] Sign-out works from all pages

---

## 🚀 Deployment Commands

### Option 1: Automatic Deployment (Vercel GitHub Integration)
```bash
git add .
git commit -m "feat: Add Firebase authentication for premium downloads"
git push origin main
# Vercel will auto-deploy
```

### Option 2: Manual Deployment
```bash
cd frontend
vercel --prod
```

---

## 📊 Monitoring & Analytics

After deployment, monitor:

1. **Firebase Console → Authentication → Users**
   - Track sign-ups
   - Monitor authentication methods used
   - Check for errors

2. **Vercel Analytics**
   - Monitor page load times
   - Check for runtime errors
   - Track user engagement

3. **Browser Console**
   - Test on different browsers
   - Check for JavaScript errors
   - Verify auth flow works

---

## 🔧 Troubleshooting Guide

### Issue: "Auth domain not authorized"
**Solution**: Add domain to Firebase Authorized domains

### Issue: "Popup blocked"
**Solution**: User needs to allow popups or use redirect-based auth

### Issue: "GitHub OAuth error"
**Solution**: Verify callback URL matches exactly in GitHub OAuth app

### Issue: "Firebase not initialized"
**Solution**: Check environment variables are set correctly in Vercel

### Issue: "User profile not showing"
**Solution**: Clear browser cache and refresh page

---

## 📝 What's Next?

### Future Payment Integration
When ready to add Stripe payments:
1. User authentication is already implemented ✅
2. Add Stripe integration
3. Create subscription plans
4. Link Firebase user ID to Stripe customer ID
5. Check subscription status before premium downloads
6. Add webhook handlers for subscription events

### Analytics Integration
- Firebase Analytics is already configured
- Track authentication events
- Monitor premium feature usage
- Analyze conversion rates

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Users can sign in with Google
- ✅ Users can sign in with GitHub
- ✅ Premium cards require authentication
- ✅ Non-premium cards work without auth
- ✅ User profile shows in Navbar
- ✅ Sign-out works correctly
- ✅ No console errors
- ✅ Mobile experience is smooth

---

## 📞 Support Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)

---

**Last Updated**: December 19, 2025
**Status**: Ready for Production 🚀
