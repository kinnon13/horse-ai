import { HorseSearchParams } from './HorseSearchTypes'

export function validateSearchParams(params: any): HorseSearchParams {
  if (!params.name && !params.registrationNumber) {
    throw new Error('Name or registration number is required')
  }

  return {
    name: params.name?.trim(),
    registrationNumber: params.registrationNumber?.trim(),
    sire: params.sire?.trim(),
    dam: params.dam?.trim(),
    breed: params.breed?.trim(),
    foalYear: params.foalYear ? parseInt(params.foalYear) : undefined
  }
}

