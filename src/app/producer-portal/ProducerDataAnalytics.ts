// Producer Data Analytics Types - Single responsibility
export interface ProducerDataExport {
  id: string
  producer_id: string
  export_type: string
  file_name: string
  file_url: string
  export_date: string
  status: string
  created_at: string
  updated_at: string
}

export interface ProducerAnalytics {
  id: string
  producer_id: string
  analytics_date: string
  total_horses: number
  total_earnings: number
  breeding_success_rate: number
  health_score: number
  performance_metrics: Record<string, number>
  created_at: string
  updated_at: string
}