// CompetitionHorseFormHelpers.ts (10 lines) - Main form helpers coordinator
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionHorseFormData } from './CompetitionHorseFormTypes'
import { CompetitionHorseDataMapper } from './CompetitionHorseDataMapper'

export class CompetitionHorseFormHelpers {
  static buildHorseData = CompetitionHorseDataMapper.buildHorseData
}