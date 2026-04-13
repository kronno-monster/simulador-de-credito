import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notificaciones, setNotificaciones] = useState([])

  const agregar = useCallback((mensaje, tipo = 'info', duracion = 3500) => {
    const id = Date.now()
    setNotificaciones(prev => [...prev, { id, mensaje, tipo }])
    setTimeout(() => setNotificaciones(prev => prev.filter(n => n.id !== id)), duracion)
  }, [])

  const exito  = useCallback((msg) => agregar(msg, 'exito'),  [agregar])
  const error  = useCallback((msg) => agregar(msg, 'error'),  [agregar])
  const info   = useCallback((msg) => agregar(msg, 'info'),   [agregar])

  return (
    <NotificationContext.Provider value={{ exito, error, info }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notificaciones.map(n => (
          <div key={n.id} style={{
            padding: '12px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            background: n.tipo === 'exito' ? '#22C97B' : n.tipo === 'error' ? '#F05252' : '#D4A843',
            color: '#0B1120', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.2s ease',
          }}>
            {n.tipo === 'exito' ? '✅' : n.tipo === 'error' ? '❌' : 'ℹ️'} {n.mensaje}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() { return useContext(NotificationContext) }
