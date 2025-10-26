import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function calculatePoints(rows: number, verified: boolean): number {
  // Unlimited rows = unlimited points potential
  const basePoints = rows * 10 // 10 points per row, no limit
  return verified ? basePoints : Math.floor(basePoints * 0.5)
}

export function getSubscriptionTierFeatures(tier: 'free' | 'intro' | 'pro') {
  const features = {
    free: {
      maxQueries: 5,
      maxCSVRows: -1, // UNLIMITED - we want the data!
      hasAnalytics: false,
      hasAPI: false
    },
    intro: {
      maxQueries: -1, // unlimited
      maxCSVRows: -1, // UNLIMITED - we want the data!
      hasAnalytics: true,
      hasAPI: false
    },
    pro: {
      maxQueries: -1, // unlimited
      maxCSVRows: -1, // UNLIMITED - we want the data!
      hasAnalytics: true,
      hasAPI: true
    }
  }
  
  return features[tier]
}
