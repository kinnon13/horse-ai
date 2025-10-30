import { OutreachConstants } from './OutreachConstants'
import { OutreachMessageOperations } from './OutreachMessageOperations'
import { OutreachStatsCalculator } from './OutreachStatsCalculator'

export { OutreachMessage, ComposeData } from './OutreachTypes'
export { OutreachStats } from './OutreachMessageOperations'

export class OutreachData {
  static getInitialMessages() {
    return OutreachConstants.getInitialMessages()
  }

  static getInitialComposeData() {
    return OutreachConstants.getInitialComposeData()
  }

  static getTemplates() {
    return OutreachConstants.getTemplates()
  }

  static getTemplate(templateId: string) {
    return OutreachConstants.getTemplate(templateId)
  }

  static createNewMessage(composeData: any) {
    return OutreachMessageOperations.createNewMessage(composeData)
  }

  static getEditData(message: any) {
    return OutreachMessageOperations.getEditData(message)
  }

  static updateMessage(message: any, composeData: any) {
    return OutreachMessageOperations.updateMessage(message, composeData)
  }

  static calculateStats(messages: any[]) {
    return OutreachStatsCalculator.calculateStats(messages)
  }
}
