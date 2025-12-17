# Deployment Guide

This guide explains how to deploy the Rise Investment Advisor application via GitHub.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the recommended platform for Next.js applications. It offers:
- ✅ Free tier with generous limits
- ✅ Automatic deployments from GitHub
- ✅ Zero configuration needed
- ✅ Built-in CDN and SSL
- ✅ Preview deployments for pull requests

#### Steps to Deploy:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/rise-investment-advisor.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and configure everything
   - Click "Deploy"

3. **Automatic Deployments:**
   - Every push to `main` branch = Production deployment
   - Every pull request = Preview deployment
   - Deployments happen automatically!

#### GitHub Actions (Alternative):

If you prefer using GitHub Actions for Vercel deployment:

1. Get your Vercel tokens:
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token
   - Get your Org ID and Project ID from your project settings

2. Add GitHub Secrets:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your organization ID
     - `VERCEL_PROJECT_ID`: Your project ID

3. Push to GitHub - the workflow will deploy automatically!

---

### Option 2: GitHub Pages

GitHub Pages requires static export. This is more complex but keeps everything on GitHub.

#### Steps to Deploy:

1. **Update next.config.js:**
   Uncomment the static export configuration:
   ```js
   output: 'export',
   basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/rise-investment-advisor',
   images: {
     unoptimized: true,
   },
   ```

2. **Enable GitHub Pages:**
   - Go to your GitHub repository
   - Settings → Pages
   - Source: Select "GitHub Actions"

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages"
   git push
   ```

4. **Automatic Deployment:**
   - The GitHub Actions workflow will build and deploy automatically
   - Your site will be available at: `https://YOUR_USERNAME.github.io/rise-investment-advisor`

**Note:** GitHub Pages uses static export, so some Next.js features (like API routes) won't work.

---

### Option 3: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy"

---

## 📝 Initial Git Setup

If you haven't set up git yet:

```bash
# Initialize git (already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Rise Investment Advisor"

# Create main branch
git branch -M main

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/rise-investment-advisor.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 🔧 Environment Variables

If you add API keys later (for real financial data), add them in your deployment platform:

**Vercel:**
- Project Settings → Environment Variables

**GitHub Pages:**
- Repository Settings → Secrets → Actions (for workflows)
- Note: GitHub Pages static sites can't use server-side env vars

**Netlify:**
- Site Settings → Environment Variables

---

## ✅ Verification

After deployment, verify:
- ✅ Site loads correctly
- ✅ All pages are accessible
- ✅ Investment data displays
- ✅ No console errors
- ✅ Mobile responsive

---

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Run `npm install` locally to check for errors
- Check build logs in deployment platform

### 404 Errors
- Verify basePath is set correctly (for GitHub Pages)
- Check routing configuration

### Environment Variables Not Working
- Ensure variables are set in deployment platform
- Restart deployment after adding variables

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Netlify Documentation](https://docs.netlify.com/)

---

**Recommended:** Use Vercel for the easiest deployment experience with Next.js!

