CREATE TABLE t_p59771403_eco_wood_website.products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  badge VARCHAR(100),
  badge_color VARCHAR(100),
  image_url TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

INSERT INTO t_p59771403_eco_wood_website.products (id, name, description, badge, badge_color, image_url, in_stock, sort_order) VALUES
('pine-beam', 'Брус сосновый', 'Строительный брус из отборной сосны. Влажность до 20%. Идеален для несущих конструкций.', 'Популярное', 'bg-eco-500', 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/0ad3275e-594a-4920-904e-14788a6d0d6c.jpg', TRUE, 1),
('pine-board', 'Доска обрезная', 'Чисто обрезная доска для полов, стен и обшивки. Ровные кромки, без коры.', 'Хит продаж', 'bg-wood-500', 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/a074c008-0356-4004-968d-4fd917afa2be.jpg', TRUE, 2),
('larch-deck', 'Террасная доска (лиственница)', 'Плотная лиственница для террас, беседок и открытых площадок. Устойчива к влаге.', 'Премиум', 'bg-eco-700', 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/f1f212ed-3b76-4618-988a-3d5a25ce3b24.jpg', TRUE, 3),
('spruce-beam', 'Брус еловый', 'Лёгкий и прочный еловый брус. Отлично подходит для кровли и межкомнатных перегородок.', NULL, '', 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/0ad3275e-594a-4920-904e-14788a6d0d6c.jpg', TRUE, 4),
('lining', 'Вагонка сосновая', 'Декоративная вагонка для внутренней отделки. Профиль «Штиль». Сортировка А.', 'Новинка', 'bg-green-400', 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/f1f212ed-3b76-4618-988a-3d5a25ce3b24.jpg', TRUE, 5),
('sleeper', 'Шпала деревянная', 'Пропитанная шпала для садовых дорожек, подпорных стенок и ландшафтного дизайна.', NULL, '', 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/a074c008-0356-4004-968d-4fd917afa2be.jpg', TRUE, 6);

CREATE TABLE t_p59771403_eco_wood_website.site_sections (
  id VARCHAR(50) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  content JSONB DEFAULT '{}'
);

INSERT INTO t_p59771403_eco_wood_website.site_sections (id, label, icon, sort_order, visible) VALUES
('hero', 'Главный экран (Hero)', 'Home', 1, TRUE),
('catalog', 'Каталог товаров', 'Package', 2, TRUE),
('calculator', 'Калькулятор', 'Calculator', 3, TRUE),
('about', 'О компании', 'Info', 4, TRUE),
('reviews', 'Отзывы', 'Star', 5, TRUE),
('tips', 'Советы мастера', 'Lightbulb', 6, TRUE),
('contacts', 'Контакты', 'MapPin', 7, TRUE);