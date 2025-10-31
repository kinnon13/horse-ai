import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionEvent } from './AthleteEventTypes'
import { 
  saveHorseToDatabase, 
  updateHorseInDatabase, 
  deleteHorseFromDatabase, 
  deleteEventFromDatabase 
} from './DatabaseOperations'

export async function saveHorse(horse: CompetitionHorse, athleteId: string) {
  return saveHorseToDatabase(horse, athleteId)
}

export async function updateHorse(horse: CompetitionHorse) {
  return updateHorseInDatabase(horse)
}

export async function deleteHorse(horseId: string) {
  return deleteHorseFromDatabase(horseId)
}

export async function deleteEvent(eventId: string) {
  return deleteEventFromDatabase(eventId)
}




