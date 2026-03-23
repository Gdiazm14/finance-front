import { useState } from 'react'
import {useToast} from '../../context/ToastContext'
import { useAccounts } from '../../hooks/useAccounts'
import Layout from '../../components/Layout/Layout'
import styles from './Accounts.module.css'

const ACCOUNT_TYPES = ['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'CASH']

const initialForm = {
  name: '',
  accountType: 'CHECKING',
  allowNegativeBalance: false,
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function AccountModal({ account, onClose, onSave, addToast }) {
  const [form, setForm] = useState(
    account
      ? {
        name: account.name, accountType: account.accountType,
        allowNegativeBalance: account.allowNegativeBalance
      }
      : initialForm
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onSave(form, account?.id)
      addToast(account ? 'Cuenta actualizada' : 'Cuenta creada', 'success')
      onClose()
    } catch (err) {
      addToast(err.response?.data?.message || 'Error al guardar', 'error')
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.modalTitle}>
          {account ? 'Editar cuenta' : 'Nueva cuenta'}
        </p>
        <form onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.field}>
            <label>Nombre</label>
            <input type="text" name="name" value={form.name}
              onChange={handleChange} required maxLength={45} />
          </div>
          <div className={styles.field}>
            <label>Tipo de cuenta</label>
            <select name="accountType" value={form.accountType}
              onChange={handleChange}>
              {ACCOUNT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {form.accountType === 'CREDIT_CARD' && (
            <label className={styles.checkboxField}>
              <input type="checkbox" name="allowNegativeBalance"
                checked={form.allowNegativeBalance} onChange={handleChange} />
              Permitir balance negativo
            </label>
          )}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AccountCard({ account, onEdit, onToggle }) {
  const isNegative = account.balance < 0

  return (
    <div className={`${styles.card} ${!account.isActive ? styles.cardInactive : ''}`}>
      <div className={styles.cardTop}>
        <div>
          <p className={styles.cardType}>{account.accountType}</p>
          <p className={styles.cardName}>{account.name}</p>
        </div>
        <div className={styles.cardActions}>
          {account.isActive && (
            <button className={styles.actionBtn} onClick={() => onEdit(account)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="var(--secondary)" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          <button className={styles.actionBtn}
            onClick={() => onToggle(account.id, account.isActive)}>
            {account.isActive ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#dc2626" strokeWidth="2">
                <path d="M18.364 5.636a9 9 0 1 1-12.728 0M12 2v7" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="var(--secondary)" strokeWidth="2">
                <path d="M12 2v7m6.364 3.636a9 9 0 1 1-12.728 0" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <p className={`${styles.balance} ${isNegative ? styles.balanceNegative : ''}`}>
        {formatCurrency(account.balance)}
      </p>
      {account.isActive
        ? <p className={styles.balanceLabel}>Balance disponible</p>
        : <p className={styles.inactiveLabel}>Cuenta inactiva</p>
      }
    </div>
  )
}

export default function Accounts() {
  const { accounts, loading, error, save, toggle } = useAccounts()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [confirmState, setConfirmState] = useState(null)

const {addToast} = useToast()

  const handleToggleRequest = (id, currentState) => {
    setConfirmId(id)
    setConfirmState(currentState)
  }

  const handleToggleConfirm = async () => {
    await toggle(confirmId, confirmState)
    addToast(
      confirmState ? 'Cuenta desactivada' :'Cuenta activada',
      confirmState ? 'error':'success'
    )
    setConfirmId(null)
    setConfirmState(null)
  }

  const handleToggleCancel = () => {
    setConfirmId(null)
    setConfirmState(null)
  }

  const handleEdit = (account) => {
    setSelectedAccount(account)
    setModalOpen(true)
  }

  const handleNew = () => {
    setSelectedAccount(null)
    setModalOpen(true)
  }

  const handleClose = () => {
    setSelectedAccount(null)
    setModalOpen(false)
  }

  return (
    <Layout>
      <div className={styles.header}>
        <p className={styles.title}>Cuentas</p>
        <button className={styles.btnPrimary} onClick={handleNew}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nueva cuenta
        </button>
      </div>

      {loading && <p className={styles.loading}>Cargando...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      {!loading && !error && (
        accounts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ fontSize: '15px', color: 'var(--text)', marginBottom: '8px' }}>
              No tienes cuentas todavía
            </p>
            <p style={{ fontSize: '13px', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
              Agrega tu primera cuenta para empezar a registrar transacciones
            </p>
         
          </div>
        ) : (
          <div className={styles.grid}>
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEdit}
                onToggle={handleToggleRequest}
              />
            ))}
          </div>
        )
      )}

      {modalOpen && (
        <AccountModal
          account={selectedAccount}
          onClose={handleClose}
          onSave={save}
          addToast={addToast}
      
        />
      )}

      {confirmId && (
        <div className={styles.overlay} onClick={handleToggleCancel}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.modalTitle}>
              {confirmState ? 'Desactivar cuenta' : 'Activar cuenta'}
            </p>
            <p style={{
              fontSize: '14px', color: 'var(--text)',
              opacity: 0.7, marginBottom: '1.5rem'
            }}>
              {confirmState
                ? '¿Estás seguro? No podrás registrar nuevas transacciones en ella.'
                : '¿Deseas activar esta cuenta nuevamente?'
              }
            </p>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={handleToggleCancel}>
                Cancelar
              </button>
              <button
                className={styles.btnSave}
                style={confirmState ? { backgroundColor: '#dc2626' } : {}}
                onClick={handleToggleConfirm}
              >
                {confirmState ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}