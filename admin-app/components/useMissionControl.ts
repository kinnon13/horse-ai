import { useEffect, useState } from 'react'

export function useMissionControl() {
  const [status, setStatus] = useState<any>(null)
  
  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch('/api/mission-control')
      const data = await res.json()
      setStatus(data)
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  
  return status
}

