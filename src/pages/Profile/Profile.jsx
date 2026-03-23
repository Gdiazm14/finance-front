import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useProfile } from '../../hooks/useProfile'
import Layout from '../../components/Layout/Layout'
import styles from './Profile.module.css'

function ProfileForm({ profile, onSave, addToast }) {
  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, email: profile.email })
    }
  }, [profile])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
      await onSave(form)
  
      addToast('Perfil actualizado', 'success')
    } catch (err) {
      addToast(err.response?.data?.message||'Error al actualizar', 'error')
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Información personal</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.footer}>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}

function PasswordForm({ onSave, addToast }) {
  const [form, setForm] = useState({
    currentPassword: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(form)
 
      setForm({ currentPassword: '', password: '' })
      addToast('Contraseña actualizada', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Error al cambiar contraseña', 'error')
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>Cambiar contraseña</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Contraseña actual</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label>Nueva contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        <div className={styles.footer}>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function Profile() {
  const { profile, loading, error, saveProfile, savePassword } = useProfile()
  const {addToast} = useToast()
  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.title}>Perfil</p>

        {loading && <p style={{ color: 'var(--text)', opacity: 0.6 }}>Cargando...</p>}
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}

        {!loading && !error && (
          <>
            <ProfileForm profile={profile} onSave={saveProfile} addToast={addToast} />
            <PasswordForm onSave={savePassword} addToast={addToast} />
          </>
        )}
      </div>
    </Layout>
  )
}