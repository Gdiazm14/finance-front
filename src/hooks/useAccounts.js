import { useState, useEffect } from 'react'
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../api/accounts.api'

export function useAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const { data } = await getAccounts()
      setAccounts(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar cuentas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const save = async (formData, id = null) => {
    if (id) {
      const { data } = await updateAccount(id, formData)
      setAccounts((prev) => prev.map((a) => (a.id === id ? data : a)))
    } else {
      const { data } = await createAccount(formData)
      setAccounts((prev) => [...prev, data])
    }
  }

  const toggle = async (id, currentState) => {
    await updateAccount(id, { isActive: !currentState })
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !currentState } : a))
    )
  }

  return { accounts, loading, error, save, toggle }
}