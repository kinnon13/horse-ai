# Horse.AI - Intelligent Equine Database

The ultimate AI-powered equine database with breeding recommendations, performance analytics, and comprehensive horse data management. Built to disrupt the current market dominated by QData and EquiStat with faster, free, and more intelligent solutions.

## 🚀 Features

### Core Features
- **AI-Powered Insights**: Get intelligent breeding recommendations and performance analysis
- **CSV Upload & Validation**: Import data from QData, EquiStat, and other sources with instant AI verification
- **Free Data Import**: No more $25-50 per-horse fees - upload unlimited data for free
- **Real-time Analytics**: Advanced performance tracking and trend analysis
- **Community Network**: Connect with breeders, owners, and trainers
- **Rewards System**: Earn points for verified uploads and data contributions

### AI Capabilities
- **Breeding Recommendations**: AI-powered bloodline analysis and breeding suggestions
- **Performance Analysis**: Trend analysis and predictive insights
- **Data Verification**: Cross-reference with public databases for accuracy
- **Self-Learning Agents**: Automated data enrichment and quality improvement

### Subscription Tiers
- **Free**: Basic profiles, 5 AI queries/month, 100 CSV rows
- **Intro ($4.99/month)**: Unlimited queries, 1000 CSV rows, advanced analytics
- **Pro ($14.99/month)**: Unlimited everything, API access, white-label options

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **AI**: Grok API for intelligent analysis and recommendations
- **Payments**: Stripe for subscription management
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel with serverless functions
- **Database**: Supabase with Row Level Security (RLS)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Grok API key
- Stripe account

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd horse-ai
npm install
```

2. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Fill in your environment variables:
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
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Enable Google OAuth in Supabase Auth settings

4. **Set up Stripe**
   - Create products and prices in your Stripe dashboard
   - Set up webhook endpoints pointing to `/api/stripe/webhook`
   - Update the price IDs in the code

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── upload/        # CSV upload endpoint
│   │   ├── chat/          # AI chat endpoint
│   │   ├── stripe/        # Payment processing
│   │   └── cron/          # Self-learning agents
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── upload/            # CSV upload page
│   ├── chat/              # AI chat interface
│   └── pricing/           # Subscription plans
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── AuthProvider.tsx  # Authentication context
│   └── Navbar.tsx        # Navigation component
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Database client
│   ├── grok.ts          # AI API integration
│   ├── stripe.ts         # Payment processing
│   ├── csv-parser.ts     # CSV parsing logic
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
```

## 🔧 API Endpoints

### CSV Upload
- **POST** `/api/upload` - Upload and validate CSV files
- Supports QData/EquiStat formats
- AI-powered data verification
- Points rewards for verified uploads

### AI Chat
- **POST** `/api/chat` - AI-powered breeding recommendations
- Context-aware responses using user's horse data
- Query limits based on subscription tier

### Payments
- **POST** `/api/stripe/create-checkout` - Create Stripe checkout session
- **POST** `/api/stripe/webhook` - Handle Stripe webhooks

### Self-Learning Agents
- **POST** `/api/cron/agents` - Automated data quality audits
- Runs daily to improve data accuracy
- Enriches missing information

## 🎯 Key Features Implementation

### CSV Upload System
```typescript
// Supports standard columns compatible with QData/EquiStat
const standardColumns = [
  'Horse Name', 'Reg Number', 'Breed', 'Sire', 'Dam',
  'Owner Name', 'Rider Name', 'Breeder Name', 'Event Name',
  'Event Date', 'Placement', 'Earnings', 'Discipline', 'Notes'
]
```

### AI Integration
```typescript
// Grok API for intelligent analysis
const grok = new GrokAPI()
const recommendations = await grok.getBreedingRecommendations(sire, dam)
const verification = await grok.verifyHorseData(horseData)
```

### Self-Learning Agents
- Daily data quality audits
- Performance trend analysis
- Breeding recommendation updates
- Data enrichment from public sources

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
GROK_API_KEY=your_grok_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📊 Database Schema

### Core Tables
- **users**: User profiles and subscription data
- **horses**: Horse profiles with pedigree and performance data
- **events**: Competition and event information
- **audits**: AI verification and data quality records
- **chat_messages**: AI conversation history

### Security
- Row Level Security (RLS) enabled on all tables
- User-specific data access policies
- Secure API endpoints with authentication

## 🎯 Revenue Model

### Subscription Tiers
- **Free**: $0/month - Basic features, limited queries
- **Intro**: $4.99/month - Unlimited queries, advanced analytics
- **Pro**: $14.99/month - Full features, API access

### Revenue Projections
- 50k users × $9.99/month = ~$500k/month
- 100k users × $9.99/month = ~$1M/month
- Additional revenue from data sales and partnerships

## 🔒 Security & Privacy

- Enterprise-grade encryption
- GDPR compliant data handling
- User consent for data sharing
- Anonymized aggregate data
- Secure API authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Documentation: [Link to docs]
- Issues: [GitHub Issues]
- Email: support@horse-ai.com

## 🚀 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced breeding algorithms
- [ ] Integration with more data sources
- [ ] White-label solutions
- [ ] API marketplace
- [ ] International expansion

---

**Horse.AI** - Revolutionizing equine data management with AI-powered intelligence.
