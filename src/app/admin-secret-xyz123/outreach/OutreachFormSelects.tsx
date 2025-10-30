import React from 'react'
import { ComposeData } from './OutreachData'
import { OutreachFormSelectData } from './OutreachFormSelectData'

interface OutreachFormSelectsProps {
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
  onTemplateChange: (templateId: string) => void
}

export function OutreachFormSelects({
  composeData,
  setComposeData,
  onTemplateChange
}: OutreachFormSelectsProps) {
  const outreachTypes = OutreachFormSelectData.getOutreachTypes()
  const outreachTemplates = OutreachFormSelectData.getOutreachTemplates()

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Type *</label>
        <select
          value={composeData.type}
          onChange={(e) => setComposeData({ ...composeData, type: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          {outreachTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Template</label>
        <select
          value={composeData.template}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select template</option>
          {outreachTemplates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </div>
    </>
  )
}
