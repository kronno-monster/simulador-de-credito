# 💳 Simulador de Créditos con Análisis de Riesgo
**SENA — Programa 228185 — Grupo 5**

| Integrante | Rol |
|------------|-----|
| Cruz       | Backend Developer |
| Quipo      | Frontend Developer |
| Marin      | Git Master + Documentador |

---

## 🚀 INSTALACIÓN PASO A PASO

### ✅ REQUISITOS PREVIOS
- Node.js v18 o superior instalado
- Una cuenta en [supabase.com](https://supabase.com) con el proyecto creado y las tablas cargadas

---

### 1️⃣ BACKEND

```bash
cd backend
npm install
```

Crea el archivo `.env` (copia de `.env.example`) y completa con tus datos de Supabase:
```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu-service-role-key
PORT=3001
```

> Las credenciales las encuentras en Supabase → Project Settings → API

Arranca el servidor:
```bash
npm run dev
```

Verifica que funcione abriendo: http://localhost:3001
Debe responder: `{"mensaje":"API Simulador de Créditos funcionando ✓"}`

---

### 2️⃣ FRONTEND

Abre **otra terminal** y ejecuta:

```bash
cd frontend
npm install
npm run dev
```

Abre el navegador en: http://localhost:5173

---

## 📋 ENDPOINTS DEL BACKEND

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/registro | ❌ | Crear cuenta |
| POST | /api/auth/login | ❌ | Iniciar sesión |
| GET | /api/auth/perfil | ✅ Token | Ver perfil con rol |
| GET | /api/productos | ❌ | Listar productos de crédito |
| POST | /api/solicitudes | ✅ Token | Crear solicitud y calcular todo |
| GET | /api/solicitudes | ✅ Token | Ver mis solicitudes |
| GET | /api/solicitudes/:id | ✅ Token | Detalle completo |
| GET | /api/admin/reporte | 👑 Admin | Reporte de todas las solicitudes |
| PUT | /api/admin/solicitudes/:id | 👑 Admin | Cambiar estado de una solicitud |

---

## 👑 CÓMO CREAR UN USUARIO ADMINISTRADOR

1. Registra un usuario normalmente desde la app
2. En Supabase → Table Editor → tabla `usuarios`
3. Busca el usuario por email
4. Cambia `rol_id` de `2` a `1`
5. Cierra sesión y vuelve a iniciar sesión
6. Aparecerá el link ⚙️ Admin en el navbar

---

## 🗄️ SQL DE LA BASE DE DATOS (ejecutar en Supabase SQL Editor)

```sql
-- 1. Roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT
);
INSERT INTO roles (nombre, descripcion) VALUES
  ('admin', 'Administrador del sistema'),
  ('usuario', 'Usuario solicitante de créditos');

-- 2. Productos de crédito
CREATE TABLE productos_credito (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('libre_inversion', 'vehiculo', 'estudio')),
  tasa_interes_anual DECIMAL(5,2) NOT NULL,
  plazo_min_meses INT NOT NULL,
  plazo_max_meses INT NOT NULL,
  monto_min DECIMAL(15,2) NOT NULL,
  monto_max DECIMAL(15,2) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO productos_credito (nombre, tipo, tasa_interes_anual, plazo_min_meses, plazo_max_meses, monto_min, monto_max) VALUES
  ('Crédito Libre Inversión', 'libre_inversion', 24.00, 12, 60,  1000000,  50000000),
  ('Crédito Vehículo',        'vehiculo',        18.00, 12, 84,  5000000, 150000000),
  ('Crédito Estudio',         'estudio',         12.00,  6, 120,  500000,  30000000);

-- 3. Usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rol_id INT NOT NULL REFERENCES roles(id) DEFAULT 2,
  nombre_completo VARCHAR(150) NOT NULL,
  telefono VARCHAR(20),
  ingresos_mensuales DECIMAL(15,2) DEFAULT 0,
  deudas_actuales DECIMAL(15,2) DEFAULT 0,
  historial_pago_score INT DEFAULT 50 CHECK (historial_pago_score BETWEEN 0 AND 100),
  two_factor_secret VARCHAR(255),
  two_factor_habilitado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Solicitudes de crédito
CREATE TABLE solicitudes_credito (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id INT NOT NULL REFERENCES productos_credito(id),
  monto_solicitado DECIMAL(15,2) NOT NULL,
  plazo_meses INT NOT NULL,
  estado VARCHAR(30) DEFAULT 'pendiente' CHECK (estado IN ('pendiente','aprobado','rechazado','condicionado')),
  score_riesgo DECIMAL(5,2),
  nivel_riesgo VARCHAR(20) CHECK (nivel_riesgo IN ('bajo','medio','alto','muy_alto')),
  justificacion TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Análisis de riesgo
CREATE TABLE analisis_riesgo (
  id SERIAL PRIMARY KEY,
  solicitud_id UUID NOT NULL UNIQUE REFERENCES solicitudes_credito(id) ON DELETE CASCADE,
  capacidad_pago DECIMAL(15,2),
  relacion_deuda_ingreso DECIMAL(5,2),
  puntuacion_historial INT,
  cuota_calculada DECIMAL(15,2),
  total_a_pagar DECIMAL(15,2),
  total_intereses DECIMAL(15,2),
  tasa_mensual DECIMAL(8,6),
  reglas_aplicadas JSONB,
  calculado_at TIMESTAMP DEFAULT NOW()
);

-- 6. Tabla de amortización
CREATE TABLE tabla_amortizacion (
  id SERIAL PRIMARY KEY,
  solicitud_id UUID NOT NULL REFERENCES solicitudes_credito(id) ON DELETE CASCADE,
  numero_cuota INT NOT NULL,
  cuota_total DECIMAL(15,2),
  capital DECIMAL(15,2),
  interes DECIMAL(15,2),
  saldo_restante DECIMAL(15,2),
  fecha_vencimiento DATE,
  estado_cuota VARCHAR(20) DEFAULT 'pendiente' CHECK (estado_cuota IN ('pendiente','pagada','vencida'))
);

-- 7. Escenarios comparativos
CREATE TABLE escenarios_comparativos (
  id SERIAL PRIMARY KEY,
  solicitud_id UUID NOT NULL REFERENCES solicitudes_credito(id) ON DELETE CASCADE,
  tasa_usada DECIMAL(5,2),
  plazo_usado INT,
  cuota_resultante DECIMAL(15,2),
  total_intereses DECIMAL(15,2),
  total_pagar DECIMAL(15,2),
  etiqueta VARCHAR(100)
);

-- Trigger: crea perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, nombre_completo, rol_id)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Usuario'), 2);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE analisis_riesgo ENABLE ROW LEVEL SECURITY;
ALTER TABLE tabla_amortizacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE escenarios_comparativos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario_ve_su_perfil" ON usuarios FOR ALL USING (auth.uid() = id);
CREATE POLICY "usuario_ve_sus_solicitudes" ON solicitudes_credito FOR ALL USING (auth.uid() = usuario_id);
CREATE POLICY "usuario_ve_su_analisis" ON analisis_riesgo FOR SELECT USING (
  solicitud_id IN (SELECT id FROM solicitudes_credito WHERE usuario_id = auth.uid())
);
CREATE POLICY "usuario_ve_amortizacion" ON tabla_amortizacion FOR SELECT USING (
  solicitud_id IN (SELECT id FROM solicitudes_credito WHERE usuario_id = auth.uid())
);
CREATE POLICY "usuario_ve_escenarios" ON escenarios_comparativos FOR SELECT USING (
  solicitud_id IN (SELECT id FROM solicitudes_credito WHERE usuario_id = auth.uid())
);
```

---

## 🛠️ STACK TECNOLÓGICO

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + Express |
| Frontend | React + Vite |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth + JWT |
| Control de versiones | GitHub |
