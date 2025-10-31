// DataValidators.ts (30 lines) - Single responsibility: Data validation logic
export class DataValidators {
  static validateServiceType(serviceType: string): boolean {
    const validTypes = ['farrier', 'vet', 'trainer', 'haul', 'boarding', 'feed', 'other']
    return validTypes.includes(serviceType)
  }

  static validateLocation(location: { city: string; state: string }): boolean {
    return location.city.length > 0 && 
           location.state.length === 2 && 
           /^[A-Z]{2}$/.test(location.state)
  }

  static validateUrgency(urgency: string): boolean {
    const validUrgencies = ['low', 'normal', 'high', 'urgent']
    return validUrgencies.includes(urgency)
  }

  static validateHorseName(horseName: string | undefined): boolean {
    if (!horseName) return true // Optional field
    return horseName.length > 0 && horseName.length <= 50
  }

  static validateMessage(message: string): boolean {
    return message.length > 10 && message.length <= 1000
  }
}
