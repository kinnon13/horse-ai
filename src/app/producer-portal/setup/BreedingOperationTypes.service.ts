// Breeding operation constants and utilities
export const BREEDING_SPECIALTIES = [
  'Quarter Horses', 'Thoroughbreds', 'Warmbloods', 'Arabians', 
  'Paint Horses', 'Appaloosas', 'Draft Horses'
]

export const BREEDING_METHODS = [
  'Live Cover', 'AI Fresh', 'AI Frozen', 'Embryo Transfer'
]

export class BreedingOperationConstants {
  static getSpecialties(): string[] {
    return BREEDING_SPECIALTIES
  }

  static getMethods(): string[] {
    return BREEDING_METHODS
  }

  static isValidSpecialty(specialty: string): boolean {
    return BREEDING_SPECIALTIES.includes(specialty)
  }

  static isValidMethod(method: string): boolean {
    return BREEDING_METHODS.includes(method)
  }
}
