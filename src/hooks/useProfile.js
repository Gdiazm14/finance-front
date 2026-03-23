import { useState, useEffect } from 'react'
import { getProfile, updateProfile, updatePassword } from '../api/user.api'

export function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProfile()
        setProfile(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el perfil')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const saveProfile = async (formData) => {
    const { data } = await updateProfile(formData)
    setProfile(data)
    return data
  }

  const savePassword = async (formData) => {
    await updatePassword(formData)
  }

  return { profile, loading, error, saveProfile, savePassword }
}