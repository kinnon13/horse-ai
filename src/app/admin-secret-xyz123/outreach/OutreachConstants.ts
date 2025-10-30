export { OutreachMessage, ComposeData, OutreachTemplate } from './OutreachTypes'
export { OutreachConstants as OutreachInitialData } from './OutreachInitialData'
export { OutreachConstants as OutreachTemplates } from './OutreachTemplates'

export class OutreachConstants {
  static getInitialMessages() {
    const { OutreachConstants: InitialData } = require('./OutreachInitialData')
    return InitialData.getInitialMessages()
  }

  static getInitialComposeData() {
    const { OutreachConstants: Templates } = require('./OutreachTemplates')
    return Templates.getInitialComposeData()
  }

  static getTemplates() {
    const { OutreachConstants: Templates } = require('./OutreachTemplates')
    return Templates.getTemplates()
  }

  static getTemplate(templateId: string) {
    const { OutreachConstants: Templates } = require('./OutreachTemplates')
    return Templates.getTemplate(templateId)
  }
}