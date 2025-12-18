# 🚀 DevRecap - Live Deployment Guide

## Quick Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended for First Time)

1. **Go to Vercel**
   - Visit: https://vercel.com/signup
   - Sign up with your GitHub account

2. **Import Repository**
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `devrecap` repository

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   **Variable Name**: `GITHUB_TOKEN`
   **Value**: Your GitHub Personal Access Token
   - Generate at: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `public_repo`, `read:user`
   - Copy the token and paste it here
   
   **Variable Name**: `NEXT_PUBLIC_APP_URL`
   **Value**: `https://devrecap.site` (will update after deployment)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://devrecap-xyz.vercel.app`

---

### Option 2: Deploy via Vercel CLI

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Login to Vercel
vercel login

# 3. Deploy (follow prompts)
vercel

# Answer the prompts:
# Set up and deploy "frontend"? [Y/n] Y
# Which scope? [Select your account]
# Link to existing project? [y/N] N
# What's your project's name? devrecap
# In which directory is your code located? ./
# Want to override the settings? [y/N] N

# 4. Add environment variables
vercel env add GITHUB_TOKEN production
# Paste your GitHub token when prompted

vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://devrecap.site

# 5. Deploy to production
vercel --prod
```

---

## 🌐 Connect Custom Domain (devrecap.site)

### Step 1: Add Domain in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Enter your domain: `devrecap.site`
4. Click "Add"
5. Also add `www.devrecap.site` (recommended)

### Step 2: Configure DNS

Vercel will show you DNS records to add. You need to configure these in your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)

#### For Root Domain (devrecap.site):

**Option A: A Record (Recommended)**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**Option B: CNAME (Alternative)**
```
Type: CNAME
Name: @ (or leave blank)
Value: cname.vercel-dns.com
TTL: 3600
```

#### For WWW Subdomain (www.devrecap.site):

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Step 3: DNS Configuration by Provider

#### Namecheap
1. Login to Namecheap
2. Go to "Domain List" → Click "Manage" next to devrecap.site
3. Go to "Advanced DNS" tab
4. Click "Add New Record"
5. Add the A record and CNAME record as shown above
6. Save changes

#### GoDaddy
1. Login to GoDaddy
2. Go to "My Products" → "DNS"
3. Click "Add" under DNS Records
4. Add the A record and CNAME record
5. Save

#### Cloudflare
1. Login to Cloudflare
2. Select your domain
3. Go to "DNS" tab
4. Click "Add record"
5. Add the A record and CNAME record
6. **Important**: Set Proxy status to "DNS only" (gray cloud)
7. Save

### Step 4: Verify Domain

1. After adding DNS records, go back to Vercel
2. Click "Verify" next to your domain
3. Wait for DNS propagation (5 minutes to 48 hours, usually 10-15 minutes)
4. Vercel will automatically provision SSL certificate
5. Your site will be live at `https://devrecap.site` 🎉

---

## 🔒 SSL Certificate

Vercel automatically provisions and renews SSL certificates via Let's Encrypt.

**Features:**
- ✅ Automatic HTTPS
- ✅ Auto-renewal (no maintenance needed)
- ✅ HTTP to HTTPS redirect
- ✅ HSTS enabled

---

## 📊 Post-Deployment Checklist

After deployment, test these:

### Functionality Tests
- [ ] Visit https://devrecap.site
- [ ] Test with valid GitHub username (e.g., `torvalds`)
- [ ] Test with invalid username
- [ ] Test all 14 themes
- [ ] Test download (Card format)
- [ ] Test download (Story Ready format)
- [ ] Test Instagram share
- [ ] Test Twitter share
- [ ] Test WhatsApp share
- [ ] Test mobile responsiveness
- [ ] Test donation modal

### Performance Tests
- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Check cache headers (X-Cache-Status)
- [ ] Test API response times
- [ ] Verify images load correctly

### Security Tests
- [ ] HTTPS is enforced
- [ ] Environment variables are secure
- [ ] No sensitive data in client code
- [ ] API rate limiting works

---

## 🐛 Troubleshooting

### Issue: Build Failed

**Check:**
1. All dependencies are in `package.json`
2. No TypeScript errors
3. Environment variables are set

**Solution:**
```bash
# Test build locally first
cd frontend
npm run build

# If it works locally, check Vercel build logs
vercel logs
```

### Issue: Domain Not Connecting

**Check:**
1. DNS records are correct
2. Wait for DNS propagation (use https://dnschecker.org)
3. Verify domain ownership in Vercel

**Solution:**
- Wait 15-30 minutes for DNS to propagate
- Clear browser cache
- Try incognito mode

### Issue: API Returns 500 Error

**Check:**
1. `GITHUB_TOKEN` is set in Vercel environment variables
2. Token has correct permissions (`public_repo`, `read:user`)
3. Token is not expired

**Solution:**
```bash
# Check environment variables
vercel env ls

# Update if needed
vercel env rm GITHUB_TOKEN production
vercel env add GITHUB_TOKEN production
# Paste new token

# Redeploy
vercel --prod
```

### Issue: Images Not Loading

**Check:**
1. Image paths are correct
2. Images are in `public/` directory or imported correctly
3. Next.js Image component is used properly

**Solution:**
- Check browser console for errors
- Verify image URLs in Network tab
- Ensure images are committed to Git

---

## 📈 Monitoring & Analytics

### Enable Vercel Analytics

1. Go to your project in Vercel dashboard
2. Click "Analytics" tab
3. Click "Enable Analytics"
4. Free tier includes:
   - Page views
   - Top pages
   - Top referrers
   - Devices & browsers

### View Deployment Logs

```bash
# View production logs
vercel logs --prod

# View specific deployment
vercel logs [deployment-url]

# Follow logs in real-time
vercel logs --prod --follow
```

### Performance Monitoring

```bash
# Run Lighthouse
npx lighthouse https://devrecap.site --view

# Check Web Vitals
# Visit: https://pagespeed.web.dev/
# Enter: https://devrecap.site
```

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin master

# Vercel automatically:
# 1. Detects the push
# 2. Builds the project
# 3. Deploys to production
# 4. Updates https://devrecap.site
```

**Deployment Timeline:**
- Code push → Build starts (30 seconds)
- Build completes (2-3 minutes)
- Live on production (instant)

---

## 💰 Vercel Pricing

### Free Tier (Hobby)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Analytics (basic)
- ✅ Serverless functions

**Your Expected Usage:**
- ~50,000 visitors/month = ~100 GB
- Well within free tier! ✅

### Pro Tier ($20/month)
Only needed if:
- More than 100 GB bandwidth
- Team collaboration
- Advanced analytics
- Priority support

---

## 🎉 Success!

Your site is now LIVE at:
- **Production**: https://devrecap.site
- **Preview**: https://devrecap-xyz.vercel.app

### Share Your Success! 🚀

Tweet about it:
```
🎉 Just launched DevRecap - Create beautiful GitHub recap cards! 

✨ Features:
- 14 stunning themes
- Story-ready exports
- Instagram/Twitter sharing
- Real-time stats

Check it out: https://devrecap.site

#DevRecap #GitHub #WebDev #NextJS
```

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Community**: https://github.com/vercel/vercel/discussions

---

**Congratulations! Your DevRecap site is LIVE! 🎊**
