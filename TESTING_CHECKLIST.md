# HorseGPT Production Testing Checklist

## ✅ Pre-Launch Setup

### Database Setup
- [ ] Run `supabase/run_all_migrations.sql` in Supabase SQL editor
- [ ] Verify all tables created successfully
- [ ] Check RLS policies are active
- [ ] Confirm admin user has `is_admin = true`

### Environment Configuration
- [ ] Copy environment variables from `ENVIRONMENT_SETUP.md`
- [ ] Add real Supabase credentials
- [ ] Add real Stripe credentials
- [ ] Set up Stripe products per `STRIPE_SETUP.md`

### Stripe Setup
- [ ] Create HorseGPT+ product ($19.99/month)
- [ ] Create Provider Protect product ($99/month)
- [ ] Create Service Booking Fee ($20 one-time)
- [ ] Configure webhook endpoint
- [ ] Test webhook with Stripe CLI

## 🧪 Core Functionality Tests

### Authentication & User Management
- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Admin dashboard access (admin only)
- [ ] Non-admin redirected from admin pages

### Chat System
- [ ] Send message as guest (rate limited)
- [ ] Send message as free user
- [ ] Send message as HorseGPT+ user
- [ ] Upsell prompts appear correctly
- [ ] Location capture on first visit

### Referral System
- [ ] Generate referral code (admin)
- [ ] Sign up with referral code
- [ ] Verify reward applied
- [ ] Check referral tracking

### Service Requests & Dispatch
- [ ] Create service request from chat
- [ ] Verify providers notified
- [ ] Provider claims service request
- [ ] Mark service as completed
- [ ] Aftercare ping sent

### Haul Support
- [ ] Route detection in chat
- [ ] Haul support recommendations
- [ ] Safety scores displayed
- [ ] Feedback submission

### Payment Flow
- [ ] Upgrade to HorseGPT+ (trial)
- [ ] Service booking checkout
- [ ] Provider plan subscription
- [ ] Webhook updates user tier

## 🚀 Production Readiness

### Security
- [ ] RLS policies protecting user data
- [ ] Admin routes properly gated
- [ ] API routes have proper auth
- [ ] No sensitive data in client code

### Performance
- [ ] Build passes with 0 errors
- [ ] All API routes respond quickly
- [ ] Database queries optimized
- [ ] Images optimized

### Monitoring
- [ ] Error logging configured
- [ ] Analytics tracking active
- [ ] Rate limiting working
- [ ] Cron jobs scheduled

## 🎯 Launch Day Checklist

### Final Checks
- [ ] All tests passing
- [ ] Stripe in live mode
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Backup strategy in place

### Go Live
- [ ] Deploy to production
- [ ] Run database migrations
- [ ] Test payment flow
- [ ] Generate NFR referral codes
- [ ] Monitor for errors

### Post-Launch
- [ ] Monitor user signups
- [ ] Track payment conversions
- [ ] Watch for errors
- [ ] Respond to user feedback
- [ ] Scale as needed

## 🆘 Emergency Contacts

- **Database Issues**: Supabase Support
- **Payment Issues**: Stripe Support  
- **Domain Issues**: Your hosting provider
- **Code Issues**: Development team

## 📊 Success Metrics

- **User Signups**: Target 100+ in first week
- **Payment Conversions**: Target 10%+ trial to paid
- **Service Requests**: Target 50+ in first month
- **Provider Onboarding**: Target 20+ providers
- **Referral Usage**: Target 30%+ of signups

---

**Ready to launch? Run through this checklist and you're good to go! 🚀**





