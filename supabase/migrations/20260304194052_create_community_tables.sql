/*
  # Tablas del módulo Comunidad

  1. Nuevas Tablas
    - `posts` - Publicaciones de la comunidad
      - id, user_id, content, image_url, type (post/achievement/challenge), likes_count, comments_count
    - `post_likes` - Likes en publicaciones
      - id, post_id, user_id
    - `post_comments` - Comentarios en publicaciones
      - id, post_id, user_id, content
    - `challenges` - Retos de la comunidad
      - id, title, description, xp_reward, start_date, end_date, type, target_value, created_by
    - `challenge_participants` - Usuarios participando en retos
      - id, challenge_id, user_id, joined_at, completed_at, progress

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Posts visibles para todos los usuarios autenticados
    - Likes y comentarios: solo el propietario puede eliminar los suyos
    - Retos públicos visibles para todos
*/

-- Tabla de posts
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  type text DEFAULT 'post' CHECK (type IN ('post', 'achievement', 'challenge', 'workout')),
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de likes
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de retos
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  xp_reward integer DEFAULT 100,
  boosties_reward integer DEFAULT 0,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  type text DEFAULT 'workout' CHECK (type IN ('workout', 'steps', 'weight', 'streak', 'custom')),
  target_value integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabla de participantes en retos
CREATE TABLE IF NOT EXISTS challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress integer DEFAULT 0,
  UNIQUE(challenge_id, user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_id ON challenge_participants(user_id);

-- Habilitar RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

-- Políticas para posts
CREATE POLICY "Ver todos los posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Insertar posts propios"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar posts propios"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar posts propios"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para post_likes
CREATE POLICY "Ver todos los likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Insertar likes propios"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar likes propios"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para post_comments
CREATE POLICY "Ver todos los comentarios"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Insertar comentarios propios"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar comentarios propios"
  ON post_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar comentarios propios"
  ON post_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para challenges
CREATE POLICY "Ver retos activos"
  ON challenges FOR SELECT
  TO authenticated
  USING (is_active = true OR auth.uid() = created_by);

CREATE POLICY "Insertar retos propios"
  ON challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Actualizar retos propios"
  ON challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Eliminar retos propios"
  ON challenges FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Políticas para challenge_participants
CREATE POLICY "Ver participantes de retos"
  ON challenge_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Unirse a retos"
  ON challenge_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar progreso propio"
  ON challenge_participants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Abandonar retos propios"
  ON challenge_participants FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Función para actualizar likes_count automáticamente
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_like_change ON post_likes;
CREATE TRIGGER on_post_like_change
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Función para actualizar comments_count automáticamente
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_comment_change ON post_comments;
CREATE TRIGGER on_post_comment_change
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();
