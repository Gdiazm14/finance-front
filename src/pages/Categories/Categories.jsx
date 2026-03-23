import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import {useToast} from '../../context/ToastContext'
import Layout from '../../components/Layout/Layout'
import styles from './Categories.module.css'


function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const initialForm = {
  name: '',
  budgetAmount: '',
  color: '#004f39',
}

function CategoryModal({ category, onClose, onSave, addToast }) {
  const [form, setForm] = useState(
    category
      ? { name: category.name, budgetAmount: category.budgetAmount, color: category.color || '#004f39' }
      : initialForm
  )
  const [loading, setLoading] = useState(false)
 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(
        { ...form, budgetAmount: parseFloat(form.budgetAmount) },
        category?.id
      )
      addToast(category? 'Categoría actualizada': 'Categoria Creada', 'success')
      onClose()
    } catch (err) {
      addToast(err.response?.data?.message || 'Error al guardar', 'error')
     
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.modalTitle}>
          {category ? 'Editar categoría' : 'Nueva categoría'}
        </p>

        <form onSubmit={handleSubmit}>
          

          <div className={styles.field}>
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={45}
            />
          </div>

          <div className={styles.field}>
            <label>Presupuesto mensual</label>
            <input
              type="number"
              name="budgetAmount"
              value={form.budgetAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Color</label>
            <div className={styles.colorRow}>
              <div
                className={styles.colorPreview}
                style={{ backgroundColor: form.color }}
              />
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="#004f39"
                maxLength={7}
                className={styles.colorInput}
              />
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                style={{
                  width: '36px', height: '36px', padding: '2px',
                  border: '1px solid var(--primary)', borderRadius: '8px',
                  cursor: 'pointer', backgroundColor: 'var(--background)'
                }}
              />
            </div>
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

function CategoryCard({ category, onEdit, onToggle }) {
  return (
    <div className={`${styles.card} ${!category.isActive ? styles.cardInactive : ''}`}>
      <div className={styles.cardTop}>
        <div className={styles.cardLeft}>
          <div
            className={styles.dot}
            style={{ backgroundColor: category.color || '#004f39' }}
          />
          <p className={styles.cardName}>{category.name}</p>
        </div>

        <div className={styles.cardActions}>
          {category.isActive && (
            <button className={styles.actionBtn} onClick={() => onEdit(category)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="var(--secondary)" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}

          {!category.isDefault && (
            <button className={styles.actionBtn}
              onClick={() => onToggle(category.id, category.isActive)}>

              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#dc2626" strokeWidth="2">
                <path d="M18.364 5.636a9 9 0 1 1-12.728 0M12 2v7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <p className={styles.budget}>{formatCurrency(category.budgetAmount)}</p>

      {category.isActive
        ? <p className={styles.budgetLabel}>Presupuesto mensual</p>
        : <p className={styles.inactiveLabel}>Categoría inactiva</p>
      }

      {category.isDefault && (
        <span className={styles.defaultBadge}>por defecto</span>
      )}
    </div>
  )
}

export default function Categories() {
  const { categories, loading, error: fetchError, save, toggle } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [confirmState, setConfirmState] = useState(null)

  
  const {addToast} = useToast()



  const handleToggleRequest = (id, currentState) => {
    setConfirmId(id)
    setConfirmState(currentState)
  }

  const handleToggleConfirm = async () => {
    try {
      await toggle(confirmId, confirmState)
    } catch (err) {
      addToast(err.response?.data?.message || 'Error al desactivar', 'error')
    } finally {
      setConfirmId(null)
      setConfirmState(null)
    }
  }

  const handleToggleCancel = () => {
    setConfirmId(null)
    setConfirmState(null)
  }

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setModalOpen(true)
  }

  const handleNew = () => {
    setSelectedCategory(null)
    setModalOpen(true)
  }

  const handleClose = () => {
    setSelectedCategory(null)
    setModalOpen(false)
  }

  return (
    <Layout>
      <div className={styles.header}>
        <p className={styles.title}>Categorías</p>
        <button className={styles.btnPrimary} onClick={handleNew}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nueva categoría
        </button>
      </div>

      {loading && <p className={styles.loading}>Cargando...</p>}
      {fetchError && <p style={{ color: '#dc2626' }}>{fetchError}</p>}

      

      {!loading && !fetchError && (
        <div className={styles.grid}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onToggle={handleToggleRequest}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <CategoryModal
          category={selectedCategory}
          onClose={handleClose}
          onSave={save}
          addToast={addToast}
        />
      )}

      {confirmId && (
        <div className={styles.overlay} onClick={handleToggleCancel}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.modalTitle}>
              {confirmState ? 'Desactivar categoria' : 'Activar categoria'}
            </p>
            <p style={{
              fontSize: '14px', color: 'var(--text)',
              opacity: 0.7, marginBottom: '1.5rem'
            }}>
              {confirmState
                ? '¿Estás seguro? Esta categoria desaparecerá de tu lista.'
                : ''
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
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}