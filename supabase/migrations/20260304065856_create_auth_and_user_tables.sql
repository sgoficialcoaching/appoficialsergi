/*
  # Sistema de Autenticación y Perfiles de Usuario

  1. Configuración
    - Habilitar autenticación por email/contraseña
    
  2. Nuevas Tablas
    - `profiles`
      - `id` (uuid, clave primaria, referencia a auth.users)
      - `username` (text, único, nombre de usuario)
      - `full_name` (text, nombre completo opcional)
      - `avatar_url` (text, URL del avatar opcional)
      - `created_at` (timestamptz, fecha de creación)
      - `updated_at` (timestamptz, fecha de actualización)
    
    - `user_progress`
      - `id` (uuid, clave primaria)
      - `user_id` (uuid, referencia a auth.users)
      - `xp` (integer, puntos de experiencia)
      - `boosties` (integer, moneda del juego)
      - `rank` (text, rango del usuario)
      - `active_days` (integer, días activos)
      - `last_activity_date` (date, última actividad)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  3. Seguridad
    - Habilitar RLS en todas las tablas
    - Los usuarios pueden leer y actualizar solo su propio perfil
    - Los usuarios pueden leer y actualizar solo su propio progreso
    
  4. Funciones
    - Trigger para crear perfil automáticamente al registrarse
*/

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de progreso del usuario
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  xp integer DEFAULT 0,
  boosties integer DEFAULT 0,
  rank text DEFAULT 'Bronce',
  active_days integer DEFAULT 0,
  last_activity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Los usuarios pueden ver todos los perfiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Los usuarios pueden insertar su propio perfil"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas para user_progress
CREATE POLICY "Los usuarios pueden ver su propio progreso"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su propio progreso"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar su propio progreso"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  
  INSERT INTO public.user_progress (user_id, xp, boosties, rank, active_days)
  VALUES (new.id, 0, 0, 'Bronce', 0);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
