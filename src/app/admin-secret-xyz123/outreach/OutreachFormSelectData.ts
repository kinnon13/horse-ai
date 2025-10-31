export interface OutreachType {
  value: string
  label: string
}

export interface OutreachTemplate {
  id: string
  name: string
  type: string
  subject: string
  content: string
  variables: string[]
}

import { getOutreachTypes, getOutreachTemplates } from './OutreachTemplateData'

export class OutreachFormSelectData {
  static getOutreachTypes(): OutreachType[] {
    return getOutreachTypes()
  }

  static getOutreachTemplates(): OutreachTemplate[] {
    return getOutreachTemplates()
  }
}

