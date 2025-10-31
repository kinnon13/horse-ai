# n8n Workflows for HorseAI

This directory contains n8n workflow configurations for automating various business processes in the HorseAI platform.

## 📋 Available Workflows

### 1. CRM Lead Capture
**File**: `workflows/crm-lead-capture.json`

**Description**: Captures and processes leads from the website, saves to database, notifies providers, and sends welcome emails.

**Features**:
- Webhook trigger for lead submission
- Database storage in Supabase
- Provider notifications
- Automated welcome emails via SendGrid

---

### 2. Marketing Retention
**File**: `workflows/marketing-retention.json`

**Description**: Identifies inactive users and sends personalized retention emails with discount codes.

**Features**:
- Daily scheduled execution
- Queries users inactive for 30+ days
- Personalized messages based on user tier
- Discount code generation

---

### 3. AI Recommendation Engine
**File**: `workflows/ai-recommendation-engine.json`

**Description**: Generates personalized horse recommendations based on user preferences and purchase history.

**Features**:
- Webhook API endpoint
- User profile lookup
- AI-based scoring algorithm
- Top 10 recommendations
- Recommendation logging

---

### 4. Admin User Approval
**File**: `workflows/admin-user-approval.json`

**Description**: Processes admin approvals/rejections for new user accounts.

**Features**:
- Webhook trigger
- Input validation
- Conditional approval/rejection flow
- Email notifications
- Database updates

---

### 5. Reliability Health Check
**File**: `workflows/reliability-health-check.json`

**Description**: Monitors system health every 15 minutes and alerts on degradation.

**Features**:
- Scheduled monitoring
- API health checks
- Database health checks
- Health check logging
- Slack alerts for issues

---

## 🚀 Installation & Setup

### Prerequisites
- n8n instance (cloud or self-hosted)
- Access to Supabase database
- SendGrid API key
- Slack webhook URL (optional)
- HorseAI API credentials

### Required Credentials

1. **Supabase Database** (`supabase-connection`)
   - Host: Your Supabase host
   - Database: Your database name
   - User: Your database user
   - Password: Your database password
   - Port: 5432
   - SSL: Enabled

2. **HorseAI API** (`api-credentials`)
   - Basic Auth: API username and password
   - Base URL: https://api.horseai.com

3. **SendGrid API** (`sendgrid-credentials`)
   - API Key: Your SendGrid API key
   - From Email: noreply@horseai.com

4. **Slack** (`slack-credentials`) - Optional
   - Webhook URL: Your Slack webhook URL

### Importing Workflows

#### Method 1: Via n8n UI
1. Log into your n8n instance
2. Click "Add workflow"
3. Click the three dots menu (⋮) → "Import from File"
4. Select the JSON file from `n8n/workflows/`
5. Configure credentials for each node
6. Activate the workflow

#### Method 2: Via n8n CLI
```bash
cd /path/to/n8n
n8n import:workflow --file=workflows/crm-lead-capture.json
```

#### Method 3: Via API
```bash
curl -X POST https://your-n8n-instance.com/api/v1/workflows \
  -H "Content-Type: application/json" \
  -H "X-N8N-API-KEY: your-api-key" \
  -d @workflows/crm-lead-capture.json
```

---

## 🔧 Configuration

### Webhook URLs

After importing workflows, note the generated webhook URLs:
- CRM Lead Capture: `https://your-n8n-instance.com/webhook/lead-capture`
- AI Recommendations: `https://your-n8n-instance.com/webhook/ai-recommendations`
- Admin Approval: `https://your-n8n-instance.com/webhook/admin-approval`

Update your application to use these URLs.

### Environment Variables

Set these in your n8n instance:
```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
SENDGRID_API_KEY=your-sendgrid-key
SLACK_WEBHOOK_URL=your-slack-webhook
```

---

## 📊 Monitoring

### Execution Logs
Access workflow execution logs in n8n UI:
1. Open the workflow
2. Click "Executions" tab
3. View detailed logs for each run

### Key Metrics
- CRM Lead Capture: Lead processing time, email delivery rate
- Retention: Activation rate, discount code usage
- Recommendations: Click-through rate, conversion rate
- Health Checks: System uptime, response times

---

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check firewall rules
   - Verify credentials
   - Increase timeout values

2. **Database Errors**
   - Verify table schema
   - Check RLS policies
   - Ensure proper permissions

3. **Email Delivery Issues**
   - Validate SendGrid API key
   - Check sender verification
   - Review email templates

4. **Webhook Not Triggering**
   - Verify webhook URL
   - Check authentication
   - Review request payload format

---

## 📝 Next Steps

Remaining workflows to implement (26 total):
- Provider onboarding automation
- Payment processing workflows
- Email campaign automation
- Analytics data pipelines
- Content moderation workflows
- And more...

---

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io)
- [Supabase Documentation](https://supabase.com/docs)
- [SendGrid API Reference](https://docs.sendgrid.com/api-reference)
- [HorseAI API Documentation](https://docs.horseai.com)

---

## 🤝 Support

For workflow issues:
1. Check n8n execution logs
2. Review error messages
3. Contact devops@horseai.com

---

**Last Updated**: January 2024
**Version**: 1.0
