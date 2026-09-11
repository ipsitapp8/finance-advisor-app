# Deployment Guide - LIC Advisor Website

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Database provider account (we'll use Vercel Postgres or Neon)

## Deployment Steps

### 1. Prepare Git Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for deployment"

# Create a GitHub repository and push
# Go to github.com and create a new repository, then:
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### 2. Set Up Database (Choose One Option)

#### Option A: Vercel Postgres (Recommended)
1. Go to https://vercel.com/dashboard
2. Create a new project or navigate to your project
3. Go to Storage → Create Database → Postgres
4. Copy the DATABASE_URL connection string

#### Option B: Neon (Free PostgreSQL)
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string from the dashboard

#### Option C: Supabase (Free PostgreSQL)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection String
4. Copy the connection pooling URL

### 3. Deploy to Vercel

#### Via Vercel Dashboard:
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure your project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. Add Environment Variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NODE_ENV=production
   ```

5. Click "Deploy"

#### Via Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

### 4. Run Database Migration

After deployment, run migrations:

```bash
# Install Vercel CLI if not done
npm i -g vercel

# Run migration in production
vercel env pull .env.production
npx prisma migrate deploy
```

Or use Vercel's deployment settings to add a build command:
```bash
npx prisma generate && npx prisma db push && next build
```

### 5. Seed Database (Optional)

If you want to seed initial data:

```bash
# Connect to production database
npx prisma studio --browser none

# Or run seed script
npm run seed
```

## Environment Variables Reference

### Required Variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth (generate with: `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
- `NODE_ENV`: Set to "production"

### Optional Variables:
- Email configuration (if using Nodemailer)
- File storage configuration (if using cloud storage)

## Post-Deployment Checklist

- [ ] Verify the app loads correctly
- [ ] Test login functionality
- [ ] Test creating/editing clients
- [ ] Test creating/editing policies
- [ ] Test file upload (may need cloud storage for production)
- [ ] Test email notifications
- [ ] Check mobile responsiveness
- [ ] Set up custom domain (optional)

## Updating Your Deployment

```bash
# Make changes to your code
git add .
git commit -m "Your changes"
git push origin main

# Vercel will automatically redeploy
```

## Troubleshooting

### Build Errors
- Check Vercel deployment logs
- Verify all environment variables are set
- Ensure Prisma client is generated during build

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database allows connections from Vercel IPs
- For Vercel Postgres, ensure you're using connection pooling URL

### File Upload Issues
- Consider using cloud storage (AWS S3, Cloudinary, Vercel Blob)
- File system storage won't persist on Vercel (serverless)

## Alternative Deployment Platforms

### Railway
1. Go to https://railway.app
2. Create new project from GitHub
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

### Netlify
1. Go to https://netlify.com
2. Import from GitHub
3. Configure build settings
4. Add environment variables
5. Deploy

### Docker + Any Cloud Provider
```dockerfile
# Use the Dockerfile included in the project
docker build -t lic-advisor .
docker run -p 3000:3000 lic-advisor
```

## Support

For issues or questions, refer to:
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
