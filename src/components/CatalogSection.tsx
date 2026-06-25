import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const PRODUCTS_API = 'https://functions.poehali.dev/ba171918-0d7b-4e3f-aa6e-6ef0d857607e';

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

interface ProductFromAPI {
  id: string;
  name: string;
  description: string;
  badge: string | null;
  badgeColor: string;
  imageUrl: string;
  inStock: boolean;
  sortOrder: number;
}

const productSizes: Record<string, { label: string; price: number }[]> = {
  'pine-beam': [
    { label: '50×50×6000 мм', price: 180 },
    { label: '100×100×6000 мм', price: 420 },
    { label: '150×150×6000 мм', price: 890 },
    { label: '200×200×6000 мм', price: 1450 },
  ],
  'pine-board': [
    { label: '25×100×6000 мм', price: 95 },
    { label: '25×150×6000 мм', price: 135 },
    { label: '40×150×6000 мм', price: 195 },
    { label: '50×200×6000 мм', price: 310 },
  ],
  'larch-deck': [
    { label: '28×90×4000 мм', price: 320 },
    { label: '28×140×4000 мм', price: 480 },
    { label: '45×140×4000 мм', price: 720 },
  ],
  'spruce-beam': [
    { label: '50×100×6000 мм', price: 280 },
    { label: '50×150×6000 мм', price: 390 },
    { label: '100×150×6000 мм', price: 680 },
  ],
  'lining': [
    { label: '12×88×2000 мм', price: 58 },
    { label: '12×88×3000 мм', price: 82 },
    { label: '16×120×3000 мм', price: 115 },
  ],
  'sleeper': [
    { label: '160×220×2750 мм', price: 650 },
  ],
};

export default function CatalogSection({ onAddToCart }: CatalogSectionProps) {
  const [products, setProducts] = useState<ProductFromAPI[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(PRODUCTS_API);
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        // fallback static
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSelectedSize = (productId: string) => selectedSizes[productId] ?? 0;
  const getQuantity = (productId: string) => quantities[productId] ?? 1;

  const handleAddToCart = (product: ProductFromAPI) => {
    if (!product.inStock) return;
    const sizes = productSizes[product.id] || [];
    const sizeIdx = getSelectedSize(product.id);
    const size = sizes[sizeIdx];
    if (!size) return;
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
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-eco-100 rounded-full px-4 py-2 text-eco-700 text-sm font-medium mb-4">
            🪵 Наша продукция
          </div>
          <h2 className="section-title mb-4">Каталог древесины</h2>
          <p className="text-eco-600 text-lg max-w-2xl mx-auto">
            Выберите нужный вид и размер пиломатериала. Указаны цены за 1 штуку.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const sizes = productSizes[product.id] || [];
            const sizeIdx = getSelectedSize(product.id);
            const currentSize = sizes[sizeIdx];
            const qty = getQuantity(product.id);
            const isAdded = addedIds.has(product.id);

            return (
              <div key={product.id}
                className={`card-eco flex flex-col overflow-hidden group relative transition-all duration-300 ${
                  !product.inStock ? 'grayscale opacity-60' : ''
                }`}
              >
                {!product.inStock && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <div className="bg-gray-800/70 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                      <Icon name="XCircle" size={16} />
                      Нет в наличии
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.imageUrl}
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
                    <h3 className="font-display text-2xl font-bold text-eco-800 mb-1">{product.name}</h3>
                    <p className="text-eco-600 text-base leading-relaxed">{product.description}</p>
                  </div>

                  {/* Size selector */}
                  <div>
                    <label className="text-eco-700 text-sm font-medium mb-2 block">Размер:</label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size, idx) => (
                        <button
                          key={idx}
                          disabled={!product.inStock}
                          onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: idx }))}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                            sizeIdx === idx
                              ? 'bg-eco-600 text-white border-eco-600 shadow-sm'
                              : 'bg-eco-50 text-eco-700 border-eco-200 hover:border-eco-400'
                          } disabled:pointer-events-none`}
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
                          disabled={!product.inStock}
                          onClick={() => setQuantities(prev => ({ ...prev, [product.id]: Math.max(1, qty - 1) }))}
                          className="w-8 h-8 rounded-lg bg-eco-100 hover:bg-eco-200 text-eco-700 flex items-center justify-center transition-colors font-bold disabled:pointer-events-none"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-eco-800">{qty}</span>
                        <button
                          disabled={!product.inStock}
                          onClick={() => setQuantities(prev => ({ ...prev, [product.id]: qty + 1 }))}
                          className="w-8 h-8 rounded-lg bg-eco-100 hover:bg-eco-200 text-eco-700 flex items-center justify-center transition-colors font-bold disabled:pointer-events-none"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {currentSize && (
                      <div className="text-right">
                        <div className="text-xs text-eco-500">Цена:</div>
                        <div className="font-display text-2xl font-bold text-eco-700">
                          {(currentSize.price * qty).toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`mt-auto w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                      product.inStock
                        ? isAdded
                          ? 'bg-green-500 text-white'
                          : 'btn-primary'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Icon name={isAdded ? 'Check' : product.inStock ? 'ShoppingCart' : 'XCircle'} size={16} />
                    {isAdded ? 'Добавлено!' : product.inStock ? 'В корзину' : 'Нет в наличии'}
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