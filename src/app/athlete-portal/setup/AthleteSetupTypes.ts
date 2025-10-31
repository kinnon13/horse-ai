import { 
  BasicInfo, 
  ExperienceInfo, 
  HorseInfo, 
  PersonalDetails, 
  SocialMedia, 
  EmergencyContact, 
  InsuranceInfo, 
  MedicalInfo, 
  FileUploads 
} from './AthleteSetupBaseTypes'

export interface AthleteSetupData extends 
  BasicInfo, 
  ExperienceInfo, 
  HorseInfo, 
  PersonalDetails, 
  FileUploads {
  social_media: SocialMedia
  emergency_contact: EmergencyContact
  insurance_info: InsuranceInfo
  medical_info: MedicalInfo
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function AthleteSetupData(_props?: any): never { throw new Error("Stubbed component used: ./AthleteSetupTypes.AthleteSetupData"); }

