/*
  # Tablas del módulo Analíticas

  1. Nuevas Tablas
    - `body_measurements` - Medidas corporales del usuario a lo largo del tiempo
      - id, user_id, weight_kg, body_fat_pct, muscle_mass_kg, chest_cm, waist_cm, hips_cm, arms_cm, legs_cm, measured_at
    - `strength_records` - Marcas personales por ejercicio (1RM)
      - id, user_id, exercise_id, weight_kg, reps, estimated_1rm, achieved_at
    - `workout_volume_log` - Volumen total de entrenamiento por día
      - id, user_id, date, total_sets, total_reps, total_volume_kg, session_id
    - `daily_stats` - Estadísticas diarias del usuario (pasos, calorías, etc.)
      - id, user_id, date, steps, calories_burned, active_minutes, water_ml

  2. Seguridad
    - RLS habilitado, cada usuario solo accede a sus propios datos
*/

-- Medidas corporales
CREATE TABLE IF NOT EXISTS body_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg numeric(5,2),
  body_fat_pct numeric(4,1),
  muscle_mass_kg numeric(5,2),
  chest_cm numeric(5,1),
  waist_cm numeric(5,1),
  hips_cm numeric(5,1),
  arms_cm numeric(5,1),
  legs_cm numeric(5,1),
  notes text,
  measured_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Marcas personales
CREATE TABLE IF NOT EXISTS strength_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  weight_kg numeric(6,2) NOT NULL,
  reps integer DEFAULT 1,
  estimated_1rm numeric(6,2),
  achieved_at timestamptz DEFAULT now(),
  session_id uuid REFERENCES workout_sessions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Volumen de entrenamiento por sesión
CREATE TABLE IF NOT EXISTS workout_volume_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  total_sets integer DEFAULT 0,
  total_reps integer DEFAULT 0,
  total_volume_kg numeric(10,2) DEFAULT 0,
  session_id uuid REFERENCES workout_sessions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Estadísticas diarias
CREATE TABLE IF NOT EXISTS daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  steps integer DEFAULT 0,
  calories_burned integer DEFAULT 0,
  active_minutes integer DEFAULT 0,
  water_ml integer DEFAULT 0,
  sleep_hours numeric(3,1) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_id ON body_measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_date ON body_measurements(measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_strength_records_user_id ON strength_records(user_id);
CREATE INDEX IF NOT EXISTS idx_strength_records_exercise ON strength_records(user_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_volume_user_date ON workout_volume_log(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats(user_id, date DESC);

-- Habilitar RLS
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE strength_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_volume_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Políticas body_measurements
CREATE POLICY "Ver medidas propias"
  ON body_measurements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Insertar medidas propias"
  ON body_measurements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar medidas propias"
  ON body_measurements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar medidas propias"
  ON body_measurements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas strength_records
CREATE POLICY "Ver marcas propias"
  ON strength_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Insertar marcas propias"
  ON strength_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar marcas propias"
  ON strength_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar marcas propias"
  ON strength_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas workout_volume_log
CREATE POLICY "Ver volumen propio"
  ON workout_volume_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Insertar volumen propio"
  ON workout_volume_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar volumen propio"
  ON workout_volume_log FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar volumen propio"
  ON workout_volume_log FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas daily_stats
CREATE POLICY "Ver stats diarias propias"
  ON daily_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Insertar stats diarias propias"
  ON daily_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar stats diarias propias"
  ON daily_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar stats diarias propias"
  ON daily_stats FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
