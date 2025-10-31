# Deployment Guide

This guide covers the complete deployment process for HorseGPT application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Deployment](#vercel-deployment)
3. [Environment Variables Setup](#environment-variables-setup)
4. [Custom Domain Configuration](#custom-domain-configuration)
5. [SSL/HTTPS Setup](#sslhttps-setup)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub repository with your code
- [ ] Vercel account (free tier or paid)
- [ ] Supabase project created
- [ ] Domain name (optional, for custom domain)
- [ ] Stripe account (for payment processing)

---

## Vercel Deployment

### Initial Setup

1. **Install Vercel CLI** (optional, for local deployment):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Link your project**:
```bash
vercel link
```

### Deployment Methods

#### Method 1: GitHub Integration (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Click "Deploy"

#### Method 2: Vercel CLI

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Build Configuration

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## Environment Variables Setup

### Required Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

#### Supabase Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Stripe Configuration

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Authentication

```bash
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
```

#### Application Settings

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Setting Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add each variable with:
   - **Name**: Variable name
   - **Value**: Variable value
   - **Environment**: Production, Preview, Development
3. Click "Save"

### Bulk Import (Alternative)

Create `.env.production` and import:

```bash
vercel env pull .env.production
# Edit file
vercel env push .env.production
```

---

## Custom Domain Configuration

### Adding Domain in Vercel

1. Go to Project Settings → Domains
2. Enter your domain (e.g., `horsegpt.com`)
3. Click "Add"

### DNS Configuration

Configure DNS records with your domain provider:

#### For Root Domain (horsegpt.com)

```
Type: A
Name: @
Value: 76.76.21.21
```

#### For www Subdomain

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### For Subdomains (api.horsegpt.com)

```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

### Domain Verification

Vercel will verify your domain:
1. DNS propagation (can take 24-48 hours)
2. SSL certificate generation (automatic)
3. Domain status shows "Valid Configuration"

---

## SSL/HTTPS Setup

### Automatic SSL with Vercel

Vercel automatically provisions SSL certificates via Let's Encrypt:

1. Domain must be added to Vercel project
2. DNS records must be configured correctly
3. SSL certificate issues automatically within minutes

### Manual SSL (Alternative)

If using external certificate:

1. Upload certificate in Project Settings → SSL
2. Provide:
   - Certificate file (.crt)
   - Private key (.key)
   - Certificate chain (optional)

### Force HTTPS Redirect

In `next.config.js`:

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://yourdomain.com/:path*',
        permanent: true,
      },
    ]
  },
}
```

---

## Post-Deployment Verification

### Health Checks

1. **Homepage Loads**:
```bash
curl https://yourdomain.com
```

2. **API Endpoints**:
```bash
curl https://yourdomain.com/api/health
```

3. **Database Connection**:
- Test user authentication
- Verify data reads/writes

### Monitoring Setup

1. **Vercel Analytics**:
   - Enable in Project Settings → Analytics
   - View real-time metrics

2. **Error Tracking**:
   - Set up Sentry or similar
   - Monitor error rates

3. **Uptime Monitoring**:
   - Use UptimeRobot or Pingdom
   - Configure alerts

---

## Rollback Procedures

### Vercel Rollback

1. Go to Deployments page
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Using Vercel CLI

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Database Rollback

1. Use Supabase dashboard
2. Restore from backup
3. Or run migration rollback scripts

---

## Troubleshooting

### Common Issues

**Build Failures**:
- Check build logs in Vercel
- Verify all dependencies in package.json
- Ensure Node.js version compatibility

**Environment Variable Issues**:
- Verify variables are set for correct environment
- Check for typos in variable names
- Ensure no trailing spaces

**Domain Not Working**:
- Verify DNS propagation (use `dig` or `nslookup`)
- Check DNS record configuration
- Wait for SSL certificate generation

**Performance Issues**:
- Enable Vercel Edge Caching
- Optimize images and assets
- Review Core Web Vitals

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Deployment](https://supabase.com/docs/guides/hosting)


