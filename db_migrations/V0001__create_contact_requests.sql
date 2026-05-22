CREATE TABLE t_p59771403_eco_wood_website.contact_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  is_called BOOLEAN DEFAULT FALSE
);