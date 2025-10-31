/**
 * HAUL SUPPORT SAFETY CALCULATOR
 * 
 * PURPOSE:
 * - Calculates safety ranking based on available support points
 * - Prioritizes safety over convenience
 * 
 * SAFETY:
 * - We prioritize verified safe locations
 * - We consider emergency coverage
 */

export class HaulSupportSafetyCalculator {
  /**
   * PURPOSE:
   * - Calculates safety ranking based on available support points
   * - Prioritizes safety over convenience
   * 
   * SAFETY:
   * - We prioritize verified safe locations
   * - We consider emergency coverage
   */
  static calculateSafetyRanking(supportPoints: any): 'high' | 'medium' | 'low' {
    const totalPoints = Object.values(supportPoints).flat().length
    const emergencyPoints = supportPoints.emergency.length
    const overnightPoints = supportPoints.overnight.length
    
    if (totalPoints >= 10 && emergencyPoints >= 2 && overnightPoints >= 3) {
      return 'high'
    } else if (totalPoints >= 5 && emergencyPoints >= 1 && overnightPoints >= 1) {
      return 'medium'
    } else {
      return 'low'
    }
  }
}




