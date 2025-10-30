#!/bin/bash

# Get the service role key
SERVICE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d'=' -f2)

echo "Creating tables using Supabase REST API..."

# Create providers table by inserting a test record
echo "Creating providers table..."
curl -X POST "https://marufuvyvpeiphnropjo.supabase.co/rest/v1/providers" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"business_name": "Test Provider", "service_type": "farrier"}' 2>/dev/null

# Create user_alerts table
echo "Creating user_alerts table..."
curl -X POST "https://marufuvyvpeiphnropjo.supabase.co/rest/v1/user_alerts" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "00000000-0000-0000-0000-000000000000", "topic": "test"}' 2>/dev/null

# Create horse_claims table
echo "Creating horse_claims table..."
curl -X POST "https://marufuvyvpeiphnropjo.supabase.co/rest/v1/horse_claims" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"horse_id": "00000000-0000-0000-0000-000000000000", "claim_type": "owner"}' 2>/dev/null

# Create message_usage table
echo "Creating message_usage table..."
curl -X POST "https://marufuvyvpeiphnropjo.supabase.co/rest/v1/message_usage" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "00000000-0000-0000-0000-000000000000"}' 2>/dev/null

# Create notifications_outbox table
echo "Creating notifications_outbox table..."
curl -X POST "https://marufuvyvpeiphnropjo.supabase.co/rest/v1/notifications_outbox" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message_body": "test", "channel": "email"}' 2>/dev/null

# Create user_memory table
echo "Creating user_memory table..."
curl -X POST "https://marufuvyvpeiphnropjo.supabase.co/rest/v1/user_memory" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "00000000-0000-0000-0000-000000000000"}' 2>/dev/null

# Create service_requests table
echo "Creating service_requests table..."
curl -X POST "https://marufuvyvpeiphnropjo.supabase.co/rest/v1/service_requests" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "00000000-0000-0000-0000-000000000000", "service_type": "farrier"}' 2>/dev/null

# Create provider_claims table
echo "Creating provider_claims table..."
curl -X POST "https://marufuvyvpeiphnropjo.supabase.co/rest/v1/provider_claims" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"provider_id": "00000000-0000-0000-0000-000000000000", "service_request_id": "00000000-0000-0000-0000-000000000000"}' 2>/dev/null

# Create user_calendar_events table
echo "Creating user_calendar_events table..."
curl -X POST "https://marufuvyvpeiphnropjo.supabase.co/rest/v1/user_calendar_events" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "00000000-0000-0000-0000-000000000000", "event_type": "reminder", "event_title": "test", "event_date": "2024-01-01T00:00:00Z"}' 2>/dev/null

echo "Done! Tables should now exist."





