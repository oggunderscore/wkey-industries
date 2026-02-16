# Quick Start Guide

Get your WKEY Industries website up and running in minutes!

## 🚀 Fast Track to Deployment

### Step 1: Install Dependencies
```bash
cd wkey-industries
npm install
```

### Step 2: Test Locally (Optional)
```bash
npm run dev
```
Open http://localhost:5173 in your browser

### Step 3: Deploy to Netlify

#### Via Netlify Drop (Easiest)
1. Build the site:
   ```bash
   npm run build
   ```
2. Go to https://app.netlify.com/drop
3. Drag and drop the `build` folder
4. Done! Your site is live

#### Via Git (Recommended for updates)
1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
3. In Netlify:
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repo
   - Click "Deploy site"

### Step 4: Configure Custom Domain
1. In Netlify Dashboard → Domain settings
2. Add custom domain: `wkey-industries.net`
3. Update DNS records as instructed by Netlify

## 📝 What's Included

- ✅ Modern Svelte website
- ✅ Vanish-UI inspired dark theme
- ✅ Three service cards (Photos, Cloud, Map)
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Netlify configuration
- ✅ Static site generation

## 🎨 Customization

### Change Colors
Edit `src/app.css` and modify CSS variables:
```css
:root {
  --accent-primary: #a855f7;  /* Change this */
  --accent-secondary: #8b3fd9; /* And this */
}
```

### Add/Remove Services
Edit `src/routes/+page.svelte` and modify the `services` array:
```javascript
const services = [
  {
    emoji: '📸',
    title: 'Photos',
    description: 'Photo & Video Management',
    url: 'https://photos.wkey-industries.net'
  },
  // Add more services here
];
```

### Change Title/Subtitle
Edit `src/routes/+page.svelte`:
```svelte
<h1>WKEY Industries</h1>
<p class="subtitle">Personal Cloud Services</p>
```

## 🔧 Troubleshooting

**Build fails?**
- Ensure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**Site not updating?**
- Clear Netlify cache and redeploy
- Check build logs in Netlify dashboard

**Styling looks wrong?**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

## 📚 Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment options
- Read [COMPARISON.md](./COMPARISON.md) to see improvements over old site
- Check [README.md](./README.md) for full documentation

## 💡 Tips

- Netlify automatically deploys on every Git push
- Use preview deployments to test changes before going live
- Enable Netlify Analytics to track visitors
- Set up form handling if you add contact forms later

## 🆘 Need Help?

- Netlify Docs: https://docs.netlify.com
- SvelteKit Docs: https://kit.svelte.dev
- Check the issue tracker in your repository

---

**That's it!** Your modern, fast, and reliable website is ready to go. 🎉
