# Deployment Guide for WKEY Industries Website

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Netlify account
- Git repository (GitHub, GitLab, or Bitbucket)

## Local Setup

1. Install dependencies:
```bash
cd wkey-industries
npm install
```

2. Run development server:
```bash
npm run dev
```
Visit http://localhost:5173 to preview

3. Build for production:
```bash
npm run build
```

## Deploy to Netlify

### Option 1: Deploy via Git (Recommended)

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/wkey-industries.git
git push -u origin main
```

3. In Netlify Dashboard:
   - Click "Add new site" → "Import an existing project"
   - Connect to your Git provider
   - Select your repository
   - Netlify will auto-detect settings from `netlify.toml`
   - Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize and deploy:
```bash
cd wkey-industries
netlify init
netlify deploy --prod
```

### Option 3: Manual Deploy

1. Build the site:
```bash
npm run build
```

2. In Netlify Dashboard:
   - Drag and drop the `build` folder to Netlify

## Custom Domain Setup

1. In Netlify Dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter `wkey-industries.net`
4. Update your DNS records:
   - Add A record pointing to Netlify's load balancer
   - Or add CNAME record pointing to your Netlify subdomain

## Environment Variables

This site doesn't require environment variables, but if you add any:
1. Go to Site settings → Environment variables
2. Add your variables
3. Redeploy the site

## Continuous Deployment

Once connected to Git, Netlify will automatically:
- Deploy on every push to main branch
- Create preview deployments for pull requests
- Run build command: `npm run build`
- Publish from: `build` directory

## Troubleshooting

### Build fails
- Check Node.js version (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check build logs in Netlify dashboard

### Site not loading
- Verify build completed successfully
- Check browser console for errors
- Ensure all URLs in service cards are correct

### Styling issues
- Clear browser cache
- Check that CSS files are being loaded
- Verify build output includes all assets

## Performance Optimization

The site is already optimized with:
- Static site generation (SSG)
- Minimal JavaScript bundle
- CSS custom properties for theming
- Optimized fonts from Google Fonts CDN
- Prerendered routes

## Monitoring

After deployment:
- Check Netlify Analytics for traffic
- Monitor Core Web Vitals
- Set up uptime monitoring if needed
