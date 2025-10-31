// HaulSupportValidator.ts (30 lines) - Single responsibility: Data validation
import { HaulSupportPoint } from './HaulSupportTypes'

export class HaulSupportValidator {
  static async validatePoints(points: any[]): Promise<HaulSupportPoint[]> {
    return points.filter(point => this.isValidPoint(point))
  }

  private static isValidPoint(point: any): boolean {
    return point &&
           point.name &&
           point.location &&
           point.contact_info &&
           point.verified === true &&
           point.active === true
  }

  static async validateRoute(origin: string, destination: string): Promise<boolean> {
    return !!(origin && destination && origin !== destination)
  }
}


