# DevRecap Production Deployment Guide

## 🎯 Pre-Deployment Checklist

### ✅ Code Quality & Functionality
- [x] Error handling implemented (user-friendly messages)
- [x] Caching strategy implemented (8-hour in-memory cache)
- [x] API routes created (`/api/stats`)
- [x] Theme colors optimized for all 14 themes
- [x] Donation modal integrated
- [x] Story Ready export format added
- [x] Instagram quick share integrated
- [x] Responsive design (mobile-first)
- [x] Typography scrolling fixed

### ✅ Environment Variables
Required for production:
- `GITHUB_TOKEN` - Your GitHub Personal Access Token
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., https://devrecap.site)

### ✅ Testing Completed
- [x] Invalid username
- [x] Private repos
- [x] GitHub API rate limits (handled with caching)
- [x] Empty activity years
- [x] All themes visual check
- [x] Mobile responsiveness
- [x] Download/Share functionality

---

## 🚀 Deployment to Vercel

### Step 1: Prerequisites
1. Install Vercel CLI (optional but recommended):
   ```bash
   npm install -g vercel
   ```

2. Create a Vercel account at [vercel.com](https://vercel.com)

### Step 2: Prepare Repository
1. Make sure your code is in a Git repository (GitHub, GitLab, or Bitbucket)
2. Push all changes:
   ```bash
   cd frontend
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```

### Step 3: Deploy via Vercel Dashboard

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - Click "Environment Variables"
   - Add `GITHUB_TOKEN`:
     - Generate at: https://github.com/settings/tokens
     - Required scopes: `public_repo`, `read:user`
     - Paste the token value
   - Add `NEXT_PUBLIC_APP_URL`:
     - Value: `https://devrecap.site` (will update after deployment)

5. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
cd frontend
vercel

# Follow the prompts:
# Set up and deploy "frontend"? [Y/n] y
# Which scope? Select your account
# Link to existing project? [y/N] n
# What's your project's name? devrecap
# In which directory is your code located? ./
# Want to override the settings? [y/N] n

# After deployment, add environment variables:
vercel env add GITHUB_TOKEN
# Paste your token when prompted

vercel env add NEXT_PUBLIC_APP_URL
# Enter: https://your-deployment-url.vercel.app
```

### Step 4: Custom Domain Setup
1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain: `devrecap.site`
4. Follow DNS configuration instructions:
   - Add `A` record pointing to Vercel's IP: `76.76.21.21`
   - Add `CNAME` record for `www` pointing to `cname.vercel-dns.com`
5. Wait for DNS propagation (can take up to 48 hours, usually 5-10 minutes)
6. Vercel will automatically provision SSL certificate

### Step 5: Update Environment Variables
1. After domain is connected, update `NEXT_PUBLIC_APP_URL`:
   ```bash
   vercel env rm NEXT_PUBLIC_APP_URL production
   vercel env add NEXT_PUBLIC_APP_URL production
   # Enter: https://devrecap.site
   ```
2. Redeploy to apply changes:
   ```bash
   vercel --prod
   ```

---

## 📊 Performance Optimizations Implemented

### Caching Strategy
- **GitHub API responses**: Cached for 8 hours
- **Cache type**: In-memory LRU cache with TTL
- **Cache benefits**:
  - Protects from GitHub rate limits (5000 req/hour)
  - Faster response times for repeat visitors
  - Professional user experience
  - Reduced server costs

### Edge Caching Headers
```http
Cache-Control: public, s-maxage=28800, stale-while-revalidate=86400
```
- `s-maxage=28800`: Cache at edge for 8 hours
- `stale-while-revalidate=86400`: Serve stale content while revalidating (24 hours)

### Response Headers
- `X-Cache-Status`: Shows HIT/MISS for debugging
- Proper CORS headers configured
- Security headers included

---

## 🔒 Security Best Practices

### Environment Variables
✅ Never commit `.env.local` to Git
✅ GitHub token stored securely in Vercel
✅ tokens are encrypted at rest

### API Security
✅ Rate limiting (handled by GitHub)
✅ Input validation (username parameter required)
✅ Error messages don't expose sensitive data
✅ HTTPS enforced (via Vercel)

---

## 📈 Monitoring & Analytics

### Recommended Tools
1. **Vercel Analytics** (Built-in, free)
   - Enable in Vercel dashboard
   - Tracks page views, performance, etc.

2. **Google Analytics 4** (Optional)
   - Add tracking code to `app/layout.tsx`

3. **Sentry** (Optional, for error tracking)
   - Catches production errors
   - Free tier available

### Health Check
Monitor these endpoints:
- `https://devrecap.site/` - Landing page
- `https://devrecap.site/api/stats?username=torvalds&platform=github` - API health

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: API returns 500 error
**Solution**: Check GITHUB_TOKEN is set correctly in Vercel dashboard

**Issue**: Styles not loading
**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

**Issue**: GitHub rate limit reached
**Solution**: Wait for rate limit reset (shown in error message) or use authenticated requests

**Issue**: Domain not connecting
**Solution**: Verify DNS settings and wait for propagation

### Debug Mode
Enable verbose logging:
```bash
vercel logs production
```

---

## 🚦 Post-Deployment Testing

### Final Checks
1. ✅ Visit https://devrecap.site
2. ✅ Test GitHub username: `torvalds`, `gaearon`, `sindresorhus`
3. ✅ Test invalid username: `thisshouldnotexist12345`
4. ✅ Test LeetCode: Switch platform and try valid username
5. ✅ Test all 14 themes
6. ✅ Test download (both Card & Story Ready formats)
7. ✅ Test Share (Instagram, Twitter, WhatsApp)
8. ✅ Test mobile responsiveness
9. ✅ Test donation modal flow

### Performance Testing
```bash
# Lighthouse score (aim for >90)
npx lighthouse https://devrecap.site --view

# Load testing
npx autocannon -c 10 -d 30 https://devrecap.site/api/stats?username=torvalds&platform=github
```

---

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- **Production**: Pushes to `main` branch → https://devrecap.site
- **Preview**: Pull requests → unique preview URL

### Deployment Workflow
```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically builds and deploys in ~2 minutes
# Check status at: https://vercel.com/<your-username>/devrecap
```

---

## 💰 Cost Estimate

### Vercel Pricing (Free Tier)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited API requests
- ✅ Serverless function execution: 100 GB-hours
- ✅ SSL Certificate (free)
- ✅ Custom domain (free)
- ✅ Analytics (free)

**Expected Usage**:
- Average visitor: ~2 MB (page + images)
- 50,000 visitors/month = 100 GB ✅ FREE
- API calls: Cached, minimal usage

**Upgrade needed if**:
- More than 100 GB bandwidth/month
- Need team collaboration features
- Want advanced analytics

---

## 🎉 Go Live Commands

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Final build test
npm run build

# 3. Deploy to Vercel
vercel --prod

# 4. Check deployment
# Visit: https://devrecap.site

# 5. Monitor logs
vercel logs --prod
```

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub API**: https://docs.github.com/en/graphql
- **LeetCode API**: https://github.com/alfaarghya/alfa-leetcode-api

---

## 🎊 Congratulations!

Your DevRecap site is now **LIVE** and ready to serve thousands of developers! 🚀

### Next Steps
1. Share on social media
2. Submit to Product Hunt
3. Add to GitHub README
4. Monitor analytics
5. Collect user feedback
6. Iterate and improve

**Happy coding! 💻✨**
