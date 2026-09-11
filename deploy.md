# Quick Deploy to Vercel

## 🚀 Fastest Way to Deploy (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- What's your project's name? **lic-advisor** (or your choice)
- In which directory is your code located? **./**
- Want to override settings? **N**

### Step 4: Set Up Database

#### Option A: Vercel Postgres (Easiest)
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database" → Choose "Postgres"
5. Copy the connection string

#### Option B: Neon (Free & Fast)
1. Visit https://neon.tech
2. Sign up (it's free)
3. Create a new project
4. Copy the connection string

### Step 5: Add Environment Variables
```bash
vercel env add DATABASE_URL
# Paste your PostgreSQL connection string

vercel env add NEXTAUTH_SECRET
# Generate one: openssl rand -base64 32 (or use any random string)

vercel env add NEXTAUTH_URL
# Use your Vercel URL (e.g., https://your-app.vercel.app)

vercel env add NODE_ENV
# Type: production
```

### Step 6: Redeploy with Environment Variables
```bash
vercel --prod
```

### Step 7: Run Database Migration
```bash
# Pull environment variables
vercel env pull .env.production

# Run migration
npx prisma db push
```

## ✅ Done!

Your app is now live! Visit the URL provided by Vercel.

## 🔄 Future Updates

Whenever you make changes:
```bash
git add .
git commit -m "Your changes"
git push

# Or deploy directly
vercel --prod
```

## 🆘 Need Help?

Common issues:
- **Build fails**: Check Vercel logs in dashboard
- **Database connection error**: Verify DATABASE_URL is correct
- **Login not working**: Verify NEXTAUTH_SECRET and NEXTAUTH_URL are set
- **404 errors**: Check if routes are correctly defined

---

## Alternative: Deploy via GitHub (Automatic Deployments)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
   - Click Deploy

3. **Set up Database** (same as above)

Now every push to `main` branch will automatically deploy! 🎉
