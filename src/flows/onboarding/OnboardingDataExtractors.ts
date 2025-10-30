/**
 * ONBOARDING DATA EXTRACTORS
 * 
 * PURPOSE:
 * - Extracts specific data from onboarding messages
 * - Handles various ways users might express their situation
 * 
 * SAFETY:
 * - Only extracts data that users explicitly provide
 * - Does not make assumptions about user intent
 */

export class OnboardingDataExtractors {
  static extractHorseCount(message: string): number | undefined {
    const match = message.match(/(\d+)\s*horses?/)
    return match ? parseInt(match[1]) : undefined
  }

  static extractRoles(message: string): string[] {
    const roles: string[] = []
    const roleKeywords = {
      'owner': ['own', 'owner', 'have horses'],
      'rider': ['ride', 'rider', 'compete', 'competition'],
      'breeder': ['breed', 'breeding', 'stallion', 'mare'],
      'trainer': ['train', 'training', 'trainer'],
      'hauler': ['haul', 'hauling', 'transport'],
      'producer': ['produce', 'producer', 'show', 'futurity']
    }
    
    Object.entries(roleKeywords).forEach(([role, keywords]) => {
      if (keywords.some(keyword => message.includes(keyword))) {
        roles.push(role)
      }
    })
    
    return roles
  }

  static extractSponsorCode(message: string): string | undefined {
    const match = message.match(/sponsor\s*code\s*:?\s*([a-zA-Z0-9]+)/i)
    return match ? match[1] : undefined
  }
}

