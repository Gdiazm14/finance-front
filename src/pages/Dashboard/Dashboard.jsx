import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSummary } from '../../hooks/useSummary'
import Layout from '../../components/Layout/Layout'
import styles from './Dashboard.module.css'

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function EnvelopeCard({ category }) {
  const { budgetAmount, spent, remaining, overBudget, categoryName, color } = category

  const percentage = budgetAmount > 0
    ? Math.min((spent / budgetAmount) * 100, 100)
    : 0

  return (
    <div className={styles.envelopeCard}>
      <div className={styles.envelopeHeader}>
        <div className={styles.envelopeName}>
          <div
            className={styles.dot}
            style={{ backgroundColor: color || '#87c149' }}
          />
          {categoryName}
        </div>
        <span className={overBudget ? styles.envelopeStatusOver : styles.envelopeStatus}>
          {overBudget ? 'Sin fondos' : `${formatCurrency(remaining)} restante`}
        </span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={overBudget ? styles.progressFillOver : styles.progressFill}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className={styles.envelopeFooter}>
        <span>{formatCurrency(spent)} gastado</span>
        <span>{formatCurrency(budgetAmount)} presupuesto</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const { summary, loading, error } = useSummary(year, month)

  const monthName = new Date(year, month - 1).toLocaleString('es-CR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <Layout>
      <div className={styles.header}>
        <p className={styles.greeting}>Hola, {user?.name}</p>
        <p className={styles.period}>{monthName}</p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnPrimary}
          onClick={() => navigate('/transactions')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nueva transacción
        </button>

        <button
          className={styles.btnSecondary}
          onClick={() => navigate('/accounts')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--secondary)" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <path d="M2 10h20"/>
          </svg>
          Nueva cuenta
        </button>
      </div>

      <p className={styles.sectionTitle}>Sobres del mes</p>

      {loading && <p className={styles.loading}>Cargando...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && summary?.categories?.length === 0 && (
        <p className={styles.empty}>No tienes categorías activas.</p>
      )}

      {!loading && !error && summary?.categories && (
        <div className={styles.grid}>
          {summary.categories.map((category) => (
            <EnvelopeCard key={category.categoryId} category={category} />
          ))}
        </div>
      )}
    </Layout>
  )
}