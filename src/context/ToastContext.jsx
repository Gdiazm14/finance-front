import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 999,
    }}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }) {
  const isSuccess = toast.type === 'success'

  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: '#151613',
        border: `1px solid ${isSuccess ? '#004f39' : '#dc2626'}`,
        borderRadius: '10px',
        minWidth: '260px',
        maxWidth: '360px',
        cursor: 'pointer',
        animation: 'slideIn 0.2s ease',
      }}
    >
      {isSuccess ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#004f39" strokeWidth="2" style={{ flexShrink: 0 }}>
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#dc2626" strokeWidth="2" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <circle cx="12" cy="16" r="0.5" fill="#dc2626"/>
        </svg>
      )}
      <p style={{
        fontSize: '13px',
        color: '#F8F4E3',
        margin: 0,
        flex: 1,
      }}>
        {toast.message}
      </p>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="#F8F4E3" strokeWidth="2" style={{ opacity: 0.5, flexShrink: 0 }}>
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}