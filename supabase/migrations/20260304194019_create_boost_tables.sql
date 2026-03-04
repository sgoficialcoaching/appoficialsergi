/*
  # Tablas del módulo Boost (Entrenamiento)

  1. Nuevas Tablas
    - `programs` - Programas de entrenamiento (PPL, Full Body, etc.)
      - id, name, description, level, days_per_week, category, is_public, created_by
    - `workouts` - Sesiones/días de entrenamiento dentro de un programa
      - id, program_id, name, day_number, muscle_groups
    - `exercises` - Catálogo de ejercicios
      - id, name, description, muscle_group, equipment, video_url, image_url, is_public
    - `workout_exercises` - Ejercicios asignados a un workout con series/reps
      - id, workout_id, exercise_id, sets, reps, rest_seconds, order_index, notes
    - `workout_sessions` - Registro de sesiones completadas por el usuario
      - id, user_id, workout_id, started_at, completed_at, duration_minutes, notes
    - `session_exercise_logs` - Registro detallado de cada ejercicio en una sesión
      - id, session_id, exercise_id, set_number, weight_kg, reps, completed

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Los usuarios ven programas públicos + los suyos propios
    - Solo el creador puede modificar sus programas
    - Cada usuario solo accede a sus propios logs
*/

-- Tabla de programas de entrenamiento
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  level text DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  days_per_week integer DEFAULT 3,
  category text DEFAULT 'strength' CHECK (category IN ('strength', 'hypertrophy', 'endurance', 'weight_loss', 'general')),
  is_public boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de workouts (días/sesiones de un programa)
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  name text NOT NULL,
  day_number integer DEFAULT 1,
  muscle_groups text[] DEFAULT '{}',
  estimated_duration_minutes integer DEFAULT 60,
  created_at timestamptz DEFAULT now()
);

-- Catálogo de ejercicios
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  muscle_group text NOT NULL,
  secondary_muscles text[] DEFAULT '{}',
  equipment text DEFAULT 'barbell' CHECK (equipment IN ('barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'band', 'other')),
  video_url text,
  image_url text,
  is_public boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Ejercicios dentro de un workout
CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  sets integer DEFAULT 3,
  reps integer DEFAULT 10,
  rest_seconds integer DEFAULT 90,
  order_index integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Sesiones completadas por el usuario
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id uuid REFERENCES workouts(id) ON DELETE SET NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  duration_minutes integer,
  notes text,
  xp_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Log detallado de cada ejercicio en una sesión
CREATE TABLE IF NOT EXISTS session_exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE SET NULL,
  set_number integer NOT NULL,
  weight_kg numeric(6,2) DEFAULT 0,
  reps integer DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_workouts_program_id ON workouts(program_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_logs_session_id ON session_exercise_logs(session_id);

-- Habilitar RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercise_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para programs
CREATE POLICY "Ver programas públicos y propios"
  ON programs FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Insertar programas propios"
  ON programs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Actualizar programas propios"
  ON programs FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Eliminar programas propios"
  ON programs FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Políticas para workouts (heredan visibilidad del programa)
CREATE POLICY "Ver workouts de programas accesibles"
  ON workouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = workouts.program_id
      AND (programs.is_public = true OR programs.created_by = auth.uid())
    )
  );

CREATE POLICY "Insertar workouts en programas propios"
  ON workouts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = workouts.program_id
      AND programs.created_by = auth.uid()
    )
  );

CREATE POLICY "Actualizar workouts en programas propios"
  ON workouts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = workouts.program_id
      AND programs.created_by = auth.uid()
    )
  );

CREATE POLICY "Eliminar workouts en programas propios"
  ON workouts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = workouts.program_id
      AND programs.created_by = auth.uid()
    )
  );

-- Políticas para exercises
CREATE POLICY "Ver ejercicios públicos y propios"
  ON exercises FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Insertar ejercicios propios"
  ON exercises FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Actualizar ejercicios propios"
  ON exercises FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Eliminar ejercicios propios"
  ON exercises FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Políticas para workout_exercises
CREATE POLICY "Ver ejercicios de workouts accesibles"
  ON workout_exercises FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN programs ON programs.id = workouts.program_id
      WHERE workouts.id = workout_exercises.workout_id
      AND (programs.is_public = true OR programs.created_by = auth.uid())
    )
  );

CREATE POLICY "Gestionar ejercicios en workouts propios"
  ON workout_exercises FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN programs ON programs.id = workouts.program_id
      WHERE workouts.id = workout_exercises.workout_id
      AND programs.created_by = auth.uid()
    )
  );

CREATE POLICY "Actualizar ejercicios en workouts propios"
  ON workout_exercises FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN programs ON programs.id = workouts.program_id
      WHERE workouts.id = workout_exercises.workout_id
      AND programs.created_by = auth.uid()
    )
  );

CREATE POLICY "Eliminar ejercicios en workouts propios"
  ON workout_exercises FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN programs ON programs.id = workouts.program_id
      WHERE workouts.id = workout_exercises.workout_id
      AND programs.created_by = auth.uid()
    )
  );

-- Políticas para workout_sessions
CREATE POLICY "Ver sesiones propias"
  ON workout_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Insertar sesiones propias"
  ON workout_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar sesiones propias"
  ON workout_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar sesiones propias"
  ON workout_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para session_exercise_logs
CREATE POLICY "Ver logs de sesiones propias"
  ON session_exercise_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_exercise_logs.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Insertar logs en sesiones propias"
  ON session_exercise_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_exercise_logs.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Actualizar logs en sesiones propias"
  ON session_exercise_logs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_exercise_logs.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Eliminar logs en sesiones propias"
  ON session_exercise_logs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_exercise_logs.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );
