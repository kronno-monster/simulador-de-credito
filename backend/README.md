# Simulador de Créditos — Backend

## Instalación
```bash
cd backend
npm install
copy .env.example .env   # Windows
# cp .env.example .env   # Mac/Linux
# Editar .env con tus credenciales de Supabase
npm run dev
```

## Variables de entorno (.env)
```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu-service-role-key
PORT=3001
```

## Endpoints
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/registro | ❌ | Crear cuenta |
| POST | /api/auth/login | ❌ | Iniciar sesión |
| GET | /api/auth/perfil | ✅ | Ver perfil completo |
| GET | /api/productos | ❌ | Listar productos |
| POST | /api/solicitudes | ✅ | Crear solicitud |
| GET | /api/solicitudes | ✅ | Mis solicitudes |
| GET | /api/solicitudes/:id | ✅ | Detalle solicitud |
| GET | /api/admin/reporte | 👑 | Reporte admin |
| PUT | /api/admin/solicitudes/:id | 👑 | Cambiar estado |
