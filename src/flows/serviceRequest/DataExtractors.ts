// DataExtractors.ts (35 lines) - Single responsibility: Data extraction from messages
export class DataExtractors {
  static extractServiceType(message: string): string {
    const serviceTypes = {
      'farrier': ['farrier', 'shoeing', 'hoof', 'blacksmith'],
      'vet': ['vet', 'veterinarian', 'doctor', 'emergency vet'],
      'trainer': ['trainer', 'training', 'lesson'],
      'haul': ['haul', 'hauling', 'transport', 'shipping'],
      'boarding': ['boarding', 'stall', 'barn'],
      'feed': ['feed', 'hay', 'grain']
    }
    
    for (const [type, keywords] of Object.entries(serviceTypes)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return type
      }
    }
    
    return 'other'
  }

  static extractLocation(message: string): { city: string; state: string } {
    const locationPattern = /(?:in|near|around)\s+([^,\n]+),\s*([A-Z]{2})/i
    const locationMatch = message.match(locationPattern)
    
    if (!locationMatch) {
      throw new Error('Location not found in service request')
    }
    
    return {
      city: locationMatch[1].trim(),
      state: locationMatch[2].trim()
    }
  }

  static extractUrgency(message: string): 'low' | 'normal' | 'high' | 'urgent' {
    if (message.includes('emergency') || message.includes('urgent') || message.includes('asap')) {
      return 'urgent'
    } else if (message.includes('tonight') || message.includes('today')) {
      return 'high'
    }
    return 'normal'
  }

  static extractHorseName(message: string): string | undefined {
    const horseNameMatch = message.match(/horse\s+([^,\n]+)/i)
    return horseNameMatch ? horseNameMatch[1].trim() : undefined
  }
}
