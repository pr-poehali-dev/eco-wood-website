import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface CatalogSectionProps {
  onAddToCart: (item: CartItem) => void;
}

const products = [
  {
    id: 'pine-beam',
    name: 'Брус сосновый',
    description: 'Строительный брус из отборной сосны. Влажность до 20%. Идеален для несущих конструкций.',
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/0ad3275e-594a-4920-904e-14788a6d0d6c.jpg',
    badge: 'Популярное',
    badgeColor: 'bg-eco-500',
    sizes: [
      { label: '50×50×6000 мм', price: 180 },
      { label: '100×100×6000 мм', price: 420 },
      { label: '150×150×6000 мм', price: 890 },
      { label: '200×200×6000 мм', price: 1450 },
    ],
  },
  {
    id: 'pine-board',
    name: 'Доска обрезная',
    description: 'Чисто обрезная доска для полов, стен и обшивки. Ровные кромки, без коры.',
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/a074c008-0356-4004-968d-4fd917afa2be.jpg',
    badge: 'Хит продаж',
    badgeColor: 'bg-wood-500',
    sizes: [
      { label: '25×100×6000 мм', price: 95 },
      { label: '25×150×6000 мм', price: 135 },
      { label: '40×150×6000 мм', price: 195 },
      { label: '50×200×6000 мм', price: 310 },
    ],
  },
  {
    id: 'larch-deck',
    name: 'Террасная доска (лиственница)',
    description: 'Плотная лиственница для террас, беседок и открытых площадок. Устойчива к влаге.',
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/f1f212ed-3b76-4618-988a-3d5a25ce3b24.jpg',
    badge: 'Премиум',
    badgeColor: 'bg-eco-700',
    sizes: [
      { label: '28×90×4000 мм', price: 320 },
      { label: '28×140×4000 мм', price: 480 },
      { label: '45×140×4000 мм', price: 720 },
    ],
  },
  {
    id: 'spruce-beam',
    name: 'Брус еловый',
    description: 'Лёгкий и прочный еловый брус. Отлично подходит для кровли и межкомнатных перегородок.',
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/0ad3275e-594a-4920-904e-14788a6d0d6c.jpg',
    badge: null,
    badgeColor: '',
    sizes: [
      { label: '50×100×6000 мм', price: 280 },
      { label: '50×150×6000 мм', price: 390 },
      { label: '100×150×6000 мм', price: 680 },
    ],
  },
  {
    id: 'lining',
    name: 'Вагонка сосновая',
    description: 'Декоративная вагонка для внутренней отделки. Профиль «Штиль». Сортировка А.',
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/f1f212ed-3b76-4618-988a-3d5a25ce3b24.jpg',
    badge: 'Новинка',
    badgeColor: 'bg-green-400',
    sizes: [
      { label: '12×88×2000 мм', price: 58 },
      { label: '12×88×3000 мм', price: 82 },
      { label: '16×120×3000 мм', price: 115 },
    ],
  },
  {
    id: 'sleeper',
    name: 'Шпала деревянная',
    description: 'Пропитанная шпала для садовых дорожек, подпорных стенок и ландшафтного дизайна.',
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/a074c008-0356-4004-968d-4fd917afa2be.jpg',
    badge: null,
    badgeColor: '',
    sizes: [
      { label: '160×220×2750 мм', price: 650 },
    ],
  },
];

export default function CatalogSection({ onAddToCart }: CatalogSectionProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const getSelectedSize = (productId: string, product: typeof products[0]) => {
    return selectedSizes[productId] ?? 0;
  };

  const getQuantity = (productId: string) => quantities[productId] ?? 1;

  const handleAddToCart = (product: typeof products[0]) => {
    const sizeIdx = getSelectedSize(product.id, product);
    const size = product.sizes[sizeIdx];
    const qty = getQuantity(product.id);

    onAddToCart({
      id: `${product.id}-${sizeIdx}`,
      name: product.name,
      size: size.label,
      price: size.price,
      quantity: qty,
    });

    setAddedIds(prev => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  return (
    <section id="catalog" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-eco-100 rounded-full px-4 py-2 text-eco-700 text-sm font-medium mb-4">
            🪵 Наша продукция
          </div>
          <h2 className="section-title mb-4">Каталог древесины</h2>
          <p className="text-eco-600 text-lg max-w-2xl mx-auto">
            Выберите нужный вид и размер пиломатериала. Указаны цены за 1 штуку.
          </p>
        </div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const sizeIdx = getSelectedSize(product.id, product);
            const currentSize = product.sizes[sizeIdx];
            const qty = getQuantity(product.id);
            const isAdded = addedIds.has(product.id);

            return (
              <div key={product.id} className="card-eco flex flex-col overflow-hidden group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  {product.badge && (
                    <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 gap-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-eco-800 mb-1">{product.name}</h3>
                    <p className="text-eco-600 text-sm leading-relaxed">{product.description}</p>
                  </div>

                  {/* Size selector */}
                  <div>
                    <label className="text-eco-700 text-sm font-medium mb-2 block">Размер:</label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: idx }))}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                            sizeIdx === idx
                              ? 'bg-eco-600 text-white border-eco-600 shadow-sm'
                              : 'bg-eco-50 text-eco-700 border-eco-200 hover:border-eco-400'
                          }`}
                        >
                          {size.label.split('×').slice(0, 2).join('×')} мм
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity + Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-eco-500 mb-1">Количество (шт):</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantities(prev => ({ ...prev, [product.id]: Math.max(1, qty - 1) }))}
                          className="w-8 h-8 rounded-lg bg-eco-100 hover:bg-eco-200 text-eco-700 flex items-center justify-center transition-colors font-bold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-eco-800">{qty}</span>
                        <button
                          onClick={() => setQuantities(prev => ({ ...prev, [product.id]: qty + 1 }))}
                          className="w-8 h-8 rounded-lg bg-eco-100 hover:bg-eco-200 text-eco-700 flex items-center justify-center transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-eco-500">Итого:</div>
                      <div className="font-display text-2xl font-bold text-eco-700">
                        {(currentSize.price * qty).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      isAdded
                        ? 'bg-eco-100 text-eco-700 border border-eco-300'
                        : 'btn-primary'
                    }`}
                  >
                    <Icon name={isAdded ? 'Check' : 'ShoppingCart'} size={16} />
                    {isAdded ? 'Добавлено в корзину' : 'В корзину'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
