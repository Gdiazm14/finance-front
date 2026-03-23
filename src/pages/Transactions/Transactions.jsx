import { useState } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { useAccounts } from '../../hooks/useAccounts'
import { useCategories } from '../../hooks/useCategories'
import { useToast } from '../../context/ToastContext'
import Layout from '../../components/Layout/Layout'
import styles from './Transactions.module.css'

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-CR', {
    month: 'short',
    day: 'numeric',
  })
}

const TYPE_CONFIG = {
  INCOME: {
    label: 'Ingreso',
    amountClass: styles.amountIncome,
    iconClass: styles.typeIconIncome,
    prefix: '+',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#004f39" strokeWidth="2">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
  },
  EXPENSE: {
    label: 'Gasto',
    amountClass: styles.amountExpense,
    iconClass: styles.typeIconExpense,
    prefix: '-',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#dc2626" strokeWidth="2">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    ),
  },
  TRANSFER: {
    label: 'Transferencia',
    amountClass: styles.amountTransfer,
    iconClass: styles.typeIconTransfer,
    prefix: '',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#0369a1" strokeWidth="2">
        <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" />
      </svg>
    ),
  },
}

function TransactionCard({ transaction }) {
  const config = TYPE_CONFIG[transaction.type]

  const meta = [
    transaction.accountName,
    transaction.categoryName,
    transaction.destinationAccountName
      ? `→ ${transaction.destinationAccountName}`
      : null,
    formatDate(transaction.createdAt),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className={styles.transactionCard}>
      <div className={styles.transactionLeft}>
        <div className={`${styles.typeIcon} ${config.iconClass}`}>
          {config.icon}
        </div>
        <div className={styles.transactionInfo}>
          <p className={styles.transactionNote}>
            {transaction.note || config.label}
          </p>
          <p className={styles.transactionMeta}>{meta}</p>
        </div>
      </div>
      <p className={`${styles.transactionAmount} ${config.amountClass}`}>
        {config.prefix}{formatCurrency(transaction.amount)}
      </p>
    </div>
  )
}

function TransactionModal({ accounts, onClose, onCreate, addToast }) {
  const { categories } = useCategories()
  const [type, setType] = useState('EXPENSE')
  const [form, setForm] = useState({
    accountId: '',
    destinationAccountId: '',
    categoryId: '',
    amount: '',
    note: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
      const payload = {
        ...form,
        type,
        amount: parseFloat(form.amount),
        categoryId: (type === 'EXPENSE' || type === 'INCOME')
          ? form.categoryId || null
          : null,
        destinationAccountId: form.destinationAccountId || null,
      }
      await onCreate(payload)
      onClose()
      addToast('Transaccion registrada', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Error al crear la transaccion', 'error')

    } finally {
      setLoading(false)
    }
  }

  const activeAccounts = accounts.filter((a) => a.isActive)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.modalTitle}>Nueva transacción</p>

        <div className={styles.typeSelector}>
          {['EXPENSE', 'INCOME', 'TRANSFER'].map((t) => (
            <button
              key={t}
              type="button"
              className={`${styles.typeBtn} ${type === t ? styles.typeBtnActive : ''}`}
              onClick={() => setType(t)}
            >
              {TYPE_CONFIG[t].label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>


          <div className={styles.field}>
            <label>Cuenta {type === 'TRANSFER' ? 'origen' : ''}</label>
            <select name="accountId" value={form.accountId}
              onChange={handleChange} required>
              <option value="">Selecciona una cuenta</option>
              {activeAccounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {type === 'TRANSFER' && (
            <div className={styles.field}>
              <label>Cuenta destino</label>
              <select name="destinationAccountId"
                value={form.destinationAccountId}
                onChange={handleChange} required>
                <option value="">Selecciona una cuenta</option>
                {activeAccounts
                  .filter((a) => a.id !== form.accountId)
                  .map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
              </select>
            </div>
          )}

          <div className={styles.field}>
            <label>Monto</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          {type === 'INCOME' && (
            <div className={styles.field}>
              <label>Categoría (opcional)</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {type === 'EXPENSE' && (
            <div className={styles.field}>
              <label>Categoría</label>
              <select name="categoryId" value={form.categoryId}
                onChange={handleChange} required>
                <option value="">Selecciona una categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.field}>
            <label>Nota (opcional)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Descripción de la transacción"
            />
          </div>

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

export default function Transactions() {
  const {
    transactions, pagination, filters,
    loading, error,
    applyFilters, clearFilters, goToPage, create,
  } = useTransactions()

  const { accounts } = useAccounts()
  const [modalOpen, setModalOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)
  const { addToast } = useToast()

  const handleFilterChange = (e) => {
    const updated = { ...localFilters, [e.target.name]: e.target.value }
    setLocalFilters(updated)
    applyFilters(updated)
  }

  const handleClear = () => {
    const empty = { type: '', accountId: '', startDate: '', endDate: '' }
    setLocalFilters(empty)
    clearFilters()
  }

  return (
    <Layout>
      <div className={styles.header}>
        <p className={styles.title}>Transacciones</p>
        <button className={styles.btnPrimary} onClick={() => setModalOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nueva transacción
        </button>
      </div>

      <div className={styles.filters}>
        <select name="type" value={localFilters.type} onChange={handleFilterChange}>
          <option value="">Todos los tipos</option>
          <option value="INCOME">Ingreso</option>
          <option value="EXPENSE">Gasto</option>
          <option value="TRANSFER">Transferencia</option>
        </select>

        <select name="accountId" value={localFilters.accountId}
          onChange={handleFilterChange}>
          <option value="">Todas las cuentas</option>
          {accounts.filter((a) => a.isActive).map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <input type="date" name="startDate" value={localFilters.startDate}
          onChange={handleFilterChange} />

        <input type="date" name="endDate" value={localFilters.endDate}
          onChange={handleFilterChange} />

        <button className={styles.btnClear} onClick={handleClear}>
          Limpiar
        </button>
      </div>


      {loading && <p className={styles.loading}>Cargando...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      {!loading && !error && (
        <>
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{ fontSize: '15px', color: 'var(--text)', marginBottom: '8px' }}>
                No hay transacciones
              </p>
              <p style={{ fontSize: '13px', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                {Object.values(localFilters).some(Boolean)
                  ? 'No se encontraron transacciones con los filtros aplicados'
                  : 'Registra tu primer ingreso o gasto para empezar'
                }
              </p>
            </div>
          ) : (
            <div className={styles.list}>
              {transactions.map((t) => (
                <TransactionCard key={t.id} transaction={t} />
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 0}
              >
                ← Anterior
              </button>
              <span className={styles.pageInfo}>
                Página {pagination.page + 1} de {pagination.totalPages}
              </span>
              <button
                className={styles.pageBtn}
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page + 1 >= pagination.totalPages}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <TransactionModal
          accounts={accounts}
          onClose={() => setModalOpen(false)}
          onCreate={create}
          addToast={addToast}
        />
      )}
    </Layout>
  )
}