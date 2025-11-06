#!/bin/bash

echo "🔍 AI X-RAY SYSTEM - QUICK START"
echo "================================"
echo ""

echo "Step 1: Run SQL Migration"
echo "-------------------------"
echo "Go to: https://supabase.com/dashboard"
echo "Navigate to: SQL Editor"
echo "Paste this file: supabase/migrations/20251106020000_ai_diagnostics.sql"
echo ""
read -p "Press Enter when migration is complete..."

echo ""
echo "Step 2: Start Dev Server"
echo "------------------------"
npm run dev &
DEV_PID=$!

echo "Waiting for server to start..."
sleep 5

echo ""
echo "Step 3: Open AI X-Ray Dashboard"
echo "--------------------------------"
echo "Opening: http://localhost:3000/admin-secret-xyz123/ai-xray"
open "http://localhost:3000/admin-secret-xyz123/ai-xray" 2>/dev/null || xdg-open "http://localhost:3000/admin-secret-xyz123/ai-xray" 2>/dev/null || echo "Manually open: http://localhost:3000/admin-secret-xyz123/ai-xray"

echo ""
echo "Step 4: Test Your Chat"
echo "----------------------"
echo "Opening: http://localhost:3000/chat"
open "http://localhost:3000/chat" 2>/dev/null || xdg-open "http://localhost:3000/chat" 2>/dev/null || echo "Manually open: http://localhost:3000/chat"

echo ""
echo "✅ AI X-RAY SYSTEM READY!"
echo ""
echo "You should now see:"
echo "  - Chat page (send a test message)"
echo "  - X-Ray dashboard (watch real-time logging)"
echo ""
echo "Press Ctrl+C to stop server"
wait $DEV_PID
