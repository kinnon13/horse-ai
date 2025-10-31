import { ComposeData, OutreachTemplate } from './OutreachTypes'
import { getOutreachTemplates } from './OutreachTemplateData'

export class OutreachConstants {
  static getInitialComposeData(): ComposeData {
    return {
      type: 'custom',
      target: '',
      template: '',
      subject: '',
      content: '',
      horse_name: '',
      event_name: ''
    }
  }

  static getTemplates(): OutreachTemplate[] {
    return getOutreachTemplates()
  }

  static getTemplate(templateId: string): OutreachTemplate | undefined {
    return this.getTemplates().find(t => t.id === templateId)
  }
}




