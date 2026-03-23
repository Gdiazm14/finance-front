import { useState, useEffect } from 'react'
import { getMonthlySummary } from '../api/summary.api'

export function useSummary(year, month) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data } = await getMonthlySummary(year, month)
        setSummary(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el resumen')
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [year, month])

  return { summary, loading, error }
}