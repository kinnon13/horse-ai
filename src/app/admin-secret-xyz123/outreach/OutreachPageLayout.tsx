// OutreachPageLayout.tsx (50 lines) - Single responsibility: Layout component
import { OutreachPageContent } from './OutreachPageContent'
import { OutreachStateManager } from './OutreachStateManager'
import { OutreachHandlers } from './OutreachHandlers'

interface OutreachPageLayoutProps {
  initialData?: any
}

export function OutreachPageLayout({ initialData }: OutreachPageLayoutProps) {
  const stateManager = OutreachStateManager.createStateManager()
  const handlers = OutreachHandlers.createHandlers(stateManager)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Outreach Management</h1>
        <button
          onClick={handlers.handleComposeMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Compose Message
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OutreachPageContent
            stateManager={stateManager}
            handlers={handlers}
          />
        </div>
      </div>
    </div>
  )
}