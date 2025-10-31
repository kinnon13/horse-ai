import { getUserFromSession } from './LocationAuth'
import { updateUserLocation, getUserLocation, optOutLocation } from './LocationOperations'
import { saveLocationHistory } from './LocationHistory'

export class UserMemoryLocationService {
  async getUserFromSession() {
    return getUserFromSession()
  }

  async updateUserLocation(userId: string, locationData: any) {
    return updateUserLocation(userId, locationData)
  }

  async getUserLocation(userId: string) {
    return getUserLocation(userId)
  }

  async optOutLocation(userId: string) {
    return optOutLocation(userId)
  }

  async saveLocationHistory(userId: string, locationData: any) {
    return saveLocationHistory(userId, locationData)
  }
}

