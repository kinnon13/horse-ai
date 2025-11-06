// getStrategyInstructions.ts - Get strategy-specific AI instructions
export function getStrategyInstructions(strategy: string): string {
  switch (strategy) {
    case 'aggressive_convert':
      return `- User is EXCITED and ready to buy! Make the pitch NOW
- Highlight premium features, limited-time offers, social proof
- Create urgency: "Other users are upgrading today..."
- Ask for the sale directly: "Ready to upgrade to premium?"`
    
    case 'soft_nurture':
      return `- User is HIGH CHURN RISK - be gentle and supportive
- Focus on providing value, not selling
- Ask what challenges they're facing
- Offer help, resources, education
- NO hard subscription pushes`
    
    case 'build_trust':
      return `- User is skeptical - show proof, not promises
- Share testimonials, rankings, competitor data
- Offer free trial or guarantee
- Be transparent about pricing and value
- Let THEM suggest next steps`
    
    case 'problem_solve':
      return `- User is frustrated - fix their problem FIRST
- Ask clarifying questions about what's wrong
- Offer immediate solutions
- Show empathy: "I understand that's frustrating..."
- Build trust through problem-solving`
    
    case 'discovery':
      return `- Standard discovery mode
- Ask about their goals with horses
- Understand their needs
- Demonstrate value through helpful answers
- Soft introduce subscription when relevant`
    
    default:
      return '- Be helpful and responsive'
  }
}

