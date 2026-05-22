CREATE TABLE t_p59771403_eco_wood_website.orders (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  comment TEXT,
  total INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p59771403_eco_wood_website.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES t_p59771403_eco_wood_website.orders(id),
  product_name VARCHAR(255) NOT NULL,
  size VARCHAR(100),
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);