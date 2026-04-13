import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const { estaLogueado, usuario, logout } = useAuth()
  const navigate = useNavigate()

  const esAdmin = usuario?.roles?.nombre === 'admin'

  const links = [
    { to: '/',          label: 'Solicitar' },
    { to: '/historial', label: 'Historial' },
    ...(esAdmin ? [{ to: '/admin', label: '⚙️ Admin' }] : [])
  ]

  return (
    <nav style={{
      background: '#131C30',
      borderBottom: '1px solid #2A3858',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 60,
    }}>
      <span style={{ color: '#D4A843', fontWeight: 700, fontSize: 18 }}>
        💳 CréditoSim
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {estaLogueado ? (
          <>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '6px 16px', borderRadius: 8, textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
                background: pathname === l.to ? '#2A3858' : 'transparent',
                color: pathname === l.to ? '#D4A843' : '#8A9CC4',
                transition: 'all 0.2s',
              }}>
                {l.label}
              </Link>
            ))}
            <span style={{ color: '#8A9CC4', fontSize: 13, marginLeft: 8 }}>
              👤 {usuario?.nombre_completo ?? usuario?.email ?? 'Usuario'}
            </span>
            <button onClick={() => { logout(); navigate('/login') }} style={{
              background: 'transparent', border: '1px solid #2A3858',
              borderRadius: 8, color: '#8A9CC4', fontSize: 13,
              padding: '6px 12px', cursor: 'pointer', marginLeft: 4,
            }}>
              Salir
            </button>
          </>
        ) : (
          <Link to="/login" style={{
            padding: '6px 16px', borderRadius: 8, textDecoration: 'none',
            fontSize: 14, background: '#D4A843', color: '#0B1120', fontWeight: 600,
          }}>
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  )
}
