# Vercel Deployment Guide

This guide will help you deploy your Rise Investment Advisor application to Vercel for optimal performance and global CDN delivery.

## Why Vercel?

- **Optimized for Next.js**: Built by the creators of Next.js
- **Global CDN**: Automatic edge caching for fast load times worldwide
- **Automatic Deployments**: Deploy on every push to main branch
- **Preview Deployments**: Automatic preview URLs for pull requests
- **Free Tier**: Generous free tier for personal projects
- **Zero Configuration**: Works out of the box with Next.js

## Prerequisites

1. A GitHub account (your code is already on GitHub)
2. A Vercel account (free) - sign up at [vercel.com](https://vercel.com)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Log In"
   - Use your GitHub account to sign in (recommended)

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Find your `rise-investment-advisor` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables** (if needed)
   - If you plan to use real API data, add your API keys here:
     - `NEXT_PUBLIC_USE_REAL_API=true`
     - `ALPHA_VANTAGE_API_KEY=your_key_here` (if using Alpha Vantage)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your site will be live at `your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production: `vercel --prod`

## Custom Domain (Optional)

1. Go to your project settings in Vercel dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Automatic Deployments

Once connected to Vercel:
- **Production**: Every push to `main` branch automatically deploys
- **Preview**: Every pull request gets a preview URL
- **Rollback**: Easy rollback to previous deployments

## Performance Features

Vercel automatically provides:
- ✅ Edge caching
- ✅ Image optimization
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions (if needed)
- ✅ Analytics (on paid plans)

## Environment Variables

To add environment variables:
1. Go to Project Settings → Environment Variables
2. Add variables for:
   - Production
   - Preview
   - Development

## Monitoring

- **Analytics**: View page views, performance metrics (paid feature)
- **Logs**: View function logs and errors
- **Speed Insights**: Monitor Core Web Vitals (paid feature)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `next.config.js` is correct

### Environment Variables Not Working
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new variables

### Performance Issues
- Check Vercel Analytics
- Optimize images
- Review bundle size

## Migration from GitHub Pages

If you're currently using GitHub Pages:
1. Deploy to Vercel (follow steps above)
2. Update your domain/DNS if needed
3. GitHub Pages can remain as a backup

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**Your site will be live in minutes!** 🚀


