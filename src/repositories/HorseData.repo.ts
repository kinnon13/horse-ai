// HorseData.repo.ts (16 lines st) - Single responsibility: Re-export horse data operations
export * from './HorseDataTypes'
export { searchServices } from './HorseDataQueries'
export type { Service as ServiceType } from './HorseDataQueries'