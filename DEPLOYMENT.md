# Horse.AI Deployment Guide

This guide will help you deploy the Horse.AI application to production.

## 🚀 Quick Deployment to Vercel

### 1. Prerequisites
- GitHub account
- Vercel account
- Supabase account
- Grok API access
- Stripe account

### 2. Set Up Supabase

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up the database**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL to create all tables and policies

3. **Configure Authentication**
   - Go to Authentication > Settings
   - Enable Google OAuth (optional)
   - Set up email templates

### 3. Set Up Stripe

1. **Create products and prices**
   - Go to your Stripe dashboard
   - Create products for "Intro" and "Pro" plans
   - Create recurring prices ($4.99/month and $14.99/month)
   - Note the price IDs

2. **Set up webhooks**
   - Go to Webhooks in Stripe dashboard
   - Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Note the webhook secret

### 4. Get Grok API Access

1. **Apply for Grok API access**
   - Visit [x.ai](https://x.ai) for API access
   - Get your API key

### 5. Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/horse-ai.git
   git push -u origin main
   ```

2. **Deploy with Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables (see below)
   - Deploy

### 6. Environment Variables

Set these in your Vercel dashboard:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Grok API Configuration
GROK_API_KEY=your_grok_api_key
GROK_API_URL=https://api.x.ai/v1/chat/completions

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 7. Update Stripe Price IDs

Update the price IDs in your code:
- Find your Stripe price IDs in the dashboard
- Update `src/lib/stripe.ts` with the correct price IDs
- Or use environment variables for price IDs

### 8. Set Up Cron Jobs (Optional)

For self-learning agents, set up a cron job:
- Use Vercel Cron or external service like cron-job.org
- Call `https://your-domain.vercel.app/api/cron/agents` daily
- Include authorization header with your secret

## 🔧 Production Optimizations

### 1. Database Optimization
- Set up database indexes for better performance
- Configure connection pooling
- Set up database backups

### 2. Security
- Enable RLS policies in Supabase
- Set up CORS policies
- Configure rate limiting
- Use HTTPS everywhere

### 3. Monitoring
- Set up error tracking (Sentry)
- Monitor API usage
- Track user analytics
- Set up uptime monitoring

### 4. Performance
- Enable Vercel Analytics
- Set up CDN caching
- Optimize images
- Monitor Core Web Vitals

## 📊 Revenue Setup

### 1. Stripe Dashboard
- Set up tax collection
- Configure billing settings
- Set up customer portal
- Configure webhooks

### 2. Analytics
- Set up conversion tracking
- Monitor subscription metrics
- Track churn rates
- Analyze user behavior

### 3. Customer Support
- Set up support channels
- Create help documentation
- Set up automated responses
- Monitor customer feedback

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify API keys are correct
   - Check for missing dependencies

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check RLS policies
   - Ensure tables are created

3. **Stripe Webhook Issues**
   - Verify webhook URL
   - Check webhook secret
   - Test webhook events

4. **Grok API Issues**
   - Verify API key
   - Check rate limits
   - Monitor API usage

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
DEBUG=true
```

## 📈 Scaling Considerations

### 1. Database Scaling
- Upgrade Supabase plan as needed
- Consider read replicas for analytics
- Implement database sharding if needed

### 2. API Scaling
- Monitor API rate limits
- Implement caching strategies
- Consider API versioning

### 3. Cost Optimization
- Monitor Supabase usage
- Optimize Grok API calls
- Implement efficient caching
- Use CDN for static assets

## 🔄 Updates and Maintenance

### 1. Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update API versions
- Test new features

### 2. Backup Strategy
- Regular database backups
- Code repository backups
- Environment variable backups
- Documentation updates

### 3. Monitoring
- Set up alerts for errors
- Monitor performance metrics
- Track user growth
- Monitor revenue metrics

## 📞 Support

For deployment issues:
- Check Vercel logs
- Review Supabase logs
- Monitor Stripe webhook logs
- Check Grok API status

---

**Horse.AI** - Ready for production deployment! 🐎
