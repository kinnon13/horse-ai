import { fetchDispatchStats as fetchStats } from './RequestsStatsService'
import { updateServiceRequestStatus } from './RequestsService'

export function useRequestsHandlers(updateServiceRequest: any, setDispatchStats: any, setLoadingStats: any) {
  const fetchDispatchStats = async () => {
    try {
      setLoadingStats(true)
      const stats = await fetchStats()
      setDispatchStats(stats)
    } catch (error) {
      console.error('Error fetching dispatch stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateServiceRequestStatus(id, status)
      await updateServiceRequest(id, { status })
      await fetchDispatchStats()
    } catch (error) {
      console.error('Error updating service request status:', error)
    }
  }

  return {
    fetchDispatchStats,
    handleUpdateStatus
  }
}



