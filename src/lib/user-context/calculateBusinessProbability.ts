// calculateBusinessProbability.ts - Predict if user owns business
export function calculateBusinessProbability(user: any, conversations: any[]): number {
  let score = 0
  
  if (user?.owns_business) return 1.0
  if (user?.business_type) return 0.9
  
  const businessKeywords = ['business', 'clients', 'customers', 'crm', 'stallion service', 'breeding operation']
  const content = conversations.map(c => JSON.stringify(c.topics).toLowerCase()).join(' ')
  
  businessKeywords.forEach(keyword => {
    if (content.includes(keyword)) score += 0.15
  })
  
  return Math.min(score, 1.0)
}

