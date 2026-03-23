import { useState, useEffect } from 'react'
import { getTransactions, createTransaction } from '../api/transactions.api'

export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 1,
    totalElements: 0,
  })
  const [filters, setFilters] = useState({
    type: '',
    accountId: '',
    startDate: '',
    endDate: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = async (page = 0, currentFilters = filters) => {
    try {
      setLoading(true)
      const params = { page, size: 10 }
      if (currentFilters.type) params.type = currentFilters.type
      if (currentFilters.accountId) params.accountId = currentFilters.accountId
      if (currentFilters.startDate) params.startDate = `${currentFilters.startDate}T00:00:00Z`
      if (currentFilters.endDate) params.endDate = `${currentFilters.endDate}T23:59:59Z`

      const { data } = await getTransactions(params)
      setTransactions(data.content)
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar transacciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions(0, filters)
  }, [])

  const applyFilters = (newFilters) => {
    setFilters(newFilters)
    fetchTransactions(0, newFilters)
  }

  const clearFilters = () => {
    const empty = { type: '', accountId: '', startDate: '', endDate: '' }
    setFilters(empty)
    fetchTransactions(0, empty)
  }

  const goToPage = (page) => {
    fetchTransactions(page, filters)
  }

  const create = async (formData) => {
    await createTransaction(formData)
    fetchTransactions(0, filters)
  }

  return {
    transactions, pagination, filters,
    loading, error,
    applyFilters, clearFilters, goToPage, create,
  }
}