# SETUP INSTRUCTIONS

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Visit: http://localhost:8082 (or the port shown in terminal)

# 4. Login credentials
# Username: any username
# Password: any password (4+ characters)
```

## Building for Production

```bash
# Build optimized production version
npm run build

# Preview production build locally
npm run preview
```

## Deployment to GitHub Pages

### 1. Update Configuration
Edit `package.json` line 5:
```json
"homepage": "https://YOUR-GITHUB-USERNAME.github.io/taskflow/"
```

### 2. Build and Deploy
```bash
npm run build

# Option A: Using gh-pages
npm install --save-dev gh-pages
npm run deploy

# Option B: Manual push
git add dist/
git commit -m "Deploy"
git push
```

### 3. Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "GitHub Pages"
3. Select `main` branch (or `gh-pages`)
4. Save

### 4. Access Your App
```
https://YOUR-USERNAME.github.io/taskflow/
```

---

## Troubleshooting

**Port Already in Use?**
- Vite automatically tries next available port

**localStorage Not Working?**
- Check if private browsing is enabled
- Try clearing browser cache

**Build Fails?**
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Check for console errors

**GitHub Pages Blank?**
- Verify `homepage` in package.json matches URL
- Check vite.config.ts has correct `base` path
- Clear browser cache

---

## Key Features

✅ Login simulation with token refresh
✅ Kanban board with drag-and-drop
✅ LocalStorage persistence
✅ Responsive mobile design
✅ Dark/light theme
✅ Search functionality

---

**Questions?** Check DEPLOYMENT_GUIDE.md for detailed information.
