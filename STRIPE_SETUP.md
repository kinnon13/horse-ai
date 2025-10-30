# Stripe Products Setup Guide

## Create These Products in Your Stripe Dashboard:

### 1. HorseGPT+ Subscription
- **Name**: HorseGPT+ Monthly
- **Price**: $19.99/month
- **Trial**: 7 days free
- **Description**: Unlimited AI queries, priority support, advanced features

### 2. HorseGPT Basic
- **Name**: HorseGPT Basic Monthly  
- **Price**: $9.99/month
- **Description**: Basic AI queries, standard support

### 3. Provider Protect Plan
- **Name**: Provider Protect Monthly
- **Price**: $99.00/month (Founding Provider: $99 for first 60 days)
- **Description**: Protect your client book, priority routing, analytics

### 4. Service Booking Fee
- **Name**: Service Booking Fee
- **Price**: $20.00 one-time
- **Description**: Emergency dispatch and booking fee

## After Creating Products:

1. Copy the Price IDs from Stripe dashboard
2. Add them to your .env.local file:
   ```
   STRIPE_PLUS_PRICE_ID=price_1234567890abcdef
   STRIPE_BASIC_PRICE_ID=price_0987654321fedcba
   STRIPE_PROVIDER_PROTECT_PRICE_ID=price_abcdef1234567890
   ```

3. Test the payment flow:
   - Go to /pricing
   - Click "Start Free Trial"
   - Complete Stripe checkout
   - Verify webhook updates user tier

## Webhook Configuration:

1. In Stripe dashboard, go to Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Copy webhook secret to .env.local:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```



