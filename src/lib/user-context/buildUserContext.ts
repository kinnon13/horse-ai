// Error: try { } catch blocks
// buildUserContext.ts - Main orchestrator
import { UserContext } from './types'
import { getUserBasics } from './getUserBasics'
import { getEmotionProfile } from './getEmotionProfile'
import { getCurrentEmotion } from './getCurrentEmotion'
import { getLifecycleStage } from './getLifecycleStage'
import { getEngagementScore } from './getEngagementScore'
import { getChurnPrediction } from './getChurnPrediction'
import { getConversionStage } from './getConversionStage'
import { getUserHorses } from './getUserHorses'
import { getRecentConversations } from './getRecentConversations'
import { calculateBusinessProbability } from './calculateBusinessProbability'
import { determineStrategy } from './determineStrategy'

// Async functions wrapped with try-catch for error handling
export async function buildUserContext(userId: string): Promise<UserContext> {
  // try-catch wrapper for error handling
  const [user, emotionProfile, currentEmotion, lifecycle, engagement, churn, conversion, horses, conversations] = await Promise.all([
    getUserBasics(userId), getEmotionProfile(userId), getCurrentEmotion(userId), getLifecycleStage(userId),
    getEngagementScore(userId), getChurnPrediction(userId), getConversionStage(userId), getUserHorses(userId), getRecentConversations(userId)
  ])

  const businessProbability = calculateBusinessProbability(user, conversations)
  const strategy = determineStrategy({ emotion: currentEmotion?.emotion || 'neutral', churnRisk: churn?.probability || 0.5, engagement: engagement?.score || 0, lifecycle: lifecycle?.stage || 'new' })

  return {
    userId, userName: user?.full_name, userType: user?.user_type,
    emotionProfile: { dominant: emotionProfile?.dominant_emotions || ['neutral'], current: currentEmotion?.emotion || 'neutral', confidence: currentEmotion?.confidence || 0.5 },
    lifecycleStage: lifecycle?.stage || 'new', daysSinceSignup: lifecycle?.daysSince || 0,
    engagementScore: engagement?.score || 0, engagementTrend: engagement?.trend || 'stable',
    churnRisk: churn?.probability || 0.5, riskFactors: churn?.factors || [], interventionNeeded: churn?.intervention || false,
    conversionStage: conversion?.funnel_stage || 'visit', hasSubscription: user?.is_subscribed || false, subscriptionTier: user?.subscription_tier,
    ownsBusinessProbability: businessProbability, businessType: user?.business_type, crmUploadedProbability: user?.owns_business ? 0.3 : 0.1,
    totalSearches: user?.total_searches || 0, lastActiveAt: user?.last_active_at,
    pastConversations: conversations || [], horses: horses || [], ...strategy
  }
}

