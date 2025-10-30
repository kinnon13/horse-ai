import { OnboardingDataOperations } from './OnboardingDataOperations'

export class OnboardingDataSaver {
  static async saveHorseCount(userId: string, horseCount: number): Promise<void> {
    return OnboardingDataOperations.saveHorseCount(userId, horseCount)
  }

  static async saveUserRoles(userId: string, roles: string[]): Promise<void> {
    return OnboardingDataOperations.saveUserRoles(userId, roles)
  }

  static async saveSponsorCode(userId: string, sponsorCode: string): Promise<void> {
    return OnboardingDataOperations.saveSponsorCode(userId, sponsorCode)
  }
}
