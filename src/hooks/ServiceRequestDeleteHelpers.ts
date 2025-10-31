// ServiceRequestDeleteHelpers.ts (20 lines) - Delete operations
export class ServiceRequestDeleteHelpers {
  static async deleteServiceRequest(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/service-requests?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete service request')
    } catch (error) {
      console.error('Error deleting service request:', error)
      throw error
    }
  }
}

