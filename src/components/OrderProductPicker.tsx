import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const PRODUCTS_API = 'https://functions.poehali.dev/ba171918-0d7b-4e3f-aa6e-6ef0d857607e';

interface ProductFromAPI {
  id: string;
  name: string;
  description: string;
  badge: string | null;
  badgeColor: string;
  imageUrl: string;
  inStock: boolean;
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

export interface OrderItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface Props {
  items: OrderItem[];
  onChange: (items: OrderItem[]) => void;
}

export default function OrderProductPicker({ items, onChange }: Props) {
  const [products, setProducts] = useState<ProductFromAPI[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(PRODUCTS_API)
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  const getSizeIdx = (id: string) => selectedSizes[id] ?? 0;
  const getQty = (id: string) => quantities[id] ?? 1;

  const handleAdd = (product: ProductFromAPI) => {
    if (!product.inStock) return;
    const sizes = productSizes[product.id] || [];
    const sizeIdx = getSizeIdx(product.id);
    const size = sizes[sizeIdx];
    if (!size) return;
    const qty = getQty(product.id);
    const key = `${product.id}-${sizeIdx}`;

    const newItem: OrderItem = {
      name: product.name,
      size: size.label,
      price: size.price,
      quantity: qty,
    };

    const existing = items.findIndex(i => i.name === product.name && i.size === size.label);
    if (existing >= 0) {
      const updated = items.map((it, idx) =>
        idx === existing ? { ...it, quantity: it.quantity + qty } : it
      );
      onChange(updated);
    } else {
      onChange([...items, newItem]);
    }

    setAddedIds(prev => new Set([...prev, key]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(key); return n; }), 1500);
  };

  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const updateQty = (idx: number, qty: number) => {
    if (qty < 1) return;
    onChange(items.map((it, i) => i === idx ? { ...it, quantity: qty } : it));
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="space-y-4">
      <label className="text-eco-700 text-sm font-medium block">Позиции заказа</label>

      {/* Catalog grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.filter(p => p.inStock).map(product => {
          const sizes = productSizes[product.id] || [];
          const sizeIdx = getSizeIdx(product.id);
          const currentSize = sizes[sizeIdx];
          const qty = getQty(product.id);
          const key = `${product.id}-${sizeIdx}`;
          const isAdded = addedIds.has(key);

          return (
            <div key={product.id} className="bg-eco-50 border border-eco-200 rounded-2xl overflow-hidden flex flex-col">
              {/* Image */}
              <div className="relative h-28 overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {product.badge && (
                  <span className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col flex-1 gap-2">
                <div className="font-semibold text-eco-800 text-sm leading-snug">{product.name}</div>

                {/* Size selector */}
                <div className="flex flex-wrap gap-1">
                  {sizes.map((size, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: idx }))}
                      className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                        sizeIdx === idx
                          ? 'bg-eco-600 text-white border-eco-600'
                          : 'bg-white text-eco-700 border-eco-200 hover:border-eco-400'
                      }`}
                    >
                      {size.label.split('×').slice(0, 2).join('×')} мм
                    </button>
                  ))}
                </div>

                {/* Qty + price */}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <div className="flex items-center gap-1.5">
                    <button type="button"
                      onClick={() => setQuantities(p => ({ ...p, [product.id]: Math.max(1, qty - 1) }))}
                      className="w-7 h-7 rounded-lg bg-white border border-eco-200 hover:bg-eco-100 text-eco-700 flex items-center justify-center text-sm font-bold transition-colors"
                    >−</button>
                    <span className="w-7 text-center text-sm font-semibold text-eco-800">{qty}</span>
                    <button type="button"
                      onClick={() => setQuantities(p => ({ ...p, [product.id]: qty + 1 }))}
                      className="w-7 h-7 rounded-lg bg-white border border-eco-200 hover:bg-eco-100 text-eco-700 flex items-center justify-center text-sm font-bold transition-colors"
                    >+</button>
                  </div>
                  {currentSize && (
                    <div className="text-right">
                      <div className="text-xs text-eco-500">Цена:</div>
                      <div className="font-bold text-eco-700 text-sm">{(currentSize.price * qty).toLocaleString('ru-RU')} ₽</div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    isAdded ? 'bg-green-500 text-white' : 'bg-eco-600 hover:bg-eco-700 text-white'
                  }`}
                >
                  <Icon name={isAdded ? 'Check' : 'Plus'} size={13} />
                  {isAdded ? 'Добавлено!' : 'В заказ'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected items */}
      {items.length > 0 && (
        <div className="bg-white border border-eco-200 rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 bg-eco-50 border-b border-eco-100 flex items-center justify-between">
            <span className="text-eco-700 text-sm font-semibold">Выбранные позиции ({items.length})</span>
            <span className="text-eco-600 text-sm font-bold">{total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="divide-y divide-eco-50">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-eco-800 text-sm font-medium truncate">{item.name}</div>
                  <div className="text-eco-500 text-xs">{item.size}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button type="button" onClick={() => updateQty(i, item.quantity - 1)}
                    className="w-6 h-6 rounded bg-eco-100 hover:bg-eco-200 text-eco-700 flex items-center justify-center text-xs font-bold transition-colors">−</button>
                  <span className="w-6 text-center text-sm font-semibold text-eco-800">{item.quantity}</span>
                  <button type="button" onClick={() => updateQty(i, item.quantity + 1)}
                    className="w-6 h-6 rounded bg-eco-100 hover:bg-eco-200 text-eco-700 flex items-center justify-center text-xs font-bold transition-colors">+</button>
                </div>
                <div className="text-eco-700 text-sm font-semibold shrink-0 w-20 text-right">
                  {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                </div>
                <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 transition-colors ml-1">
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
