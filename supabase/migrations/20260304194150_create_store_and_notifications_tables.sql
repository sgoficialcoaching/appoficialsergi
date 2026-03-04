/*
  # Tablas de Tienda y Notificaciones

  1. Nuevas Tablas
    - `products` - Productos disponibles en la tienda
      - id, name, description, price_boosties, category, image_url, stock, is_active
    - `orders` - Pedidos de usuarios
      - id, user_id, status, total_boosties, created_at
    - `order_items` - Items de cada pedido
      - id, order_id, product_id, quantity, price_boosties
    - `user_inventory` - Inventario de productos adquiridos por el usuario
      - id, user_id, product_id, quantity, acquired_at
    - `notifications` - Notificaciones del sistema para usuarios
      - id, user_id, title, message, type, is_read, action_url, created_at

  2. Seguridad
    - RLS habilitado, usuarios solo ven sus propios pedidos e inventario
    - Productos visibles para todos los autenticados
    - Notificaciones solo accesibles por el destinatario
*/

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_boosties integer NOT NULL DEFAULT 0,
  category text DEFAULT 'cosmetic' CHECK (category IN ('cosmetic', 'boost', 'program', 'equipment', 'nutrition', 'other')),
  image_url text,
  stock integer DEFAULT -1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  total_boosties integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Items de pedidos
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer DEFAULT 1,
  price_boosties integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Inventario del usuario
CREATE TABLE IF NOT EXISTS user_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  acquired_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'achievement', 'challenge', 'community', 'system', 'workout')),
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas products (todos pueden ver, nadie puede modificar desde el cliente)
CREATE POLICY "Ver productos activos"
  ON products FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Políticas orders
CREATE POLICY "Ver pedidos propios"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Insertar pedidos propios"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar pedidos propios"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas order_items
CREATE POLICY "Ver items de pedidos propios"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Insertar items en pedidos propios"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Políticas user_inventory
CREATE POLICY "Ver inventario propio"
  ON user_inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Insertar en inventario propio"
  ON user_inventory FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar inventario propio"
  ON user_inventory FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas notifications
CREATE POLICY "Ver notificaciones propias"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Actualizar notificaciones propias"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar notificaciones propias"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
