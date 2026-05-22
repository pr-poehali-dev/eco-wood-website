import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const PRODUCTS_API = 'https://functions.poehali.dev/ba171918-0d7b-4e3f-aa6e-6ef0d857607e';

interface Product {
  id: string;
  name: string;
  description: string;
  badge: string | null;
  badgeColor: string;
  imageUrl: string;
  inStock: boolean;
  sortOrder: number;
}

export default function Admin() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setProductsLoading(true);
    const res = await fetch(PRODUCTS_API);
    const data = await res.json();
    setProducts(data.products || []);
    setProductsLoading(false);
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleToggleStock = async (product: Product) => {
    const newVal = !product.inStock;
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: newVal } : p));
    await fetch(PRODUCTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_stock', id: product.id, inStock: newVal }),
    });
    showSaved();
  };

  const handleSaveProduct = async (p: Product) => {
    setProducts(prev => prev.map(x => x.id === p.id ? p : x));
    setEditing(null);
    await fetch(PRODUCTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_product',
        id: p.id,
        name: p.name,
        description: p.description,
        badge: p.badge,
      }),
    });
    showSaved();
  };

  return (
    <div className="min-h-screen bg-eco-50">
      {/* Header */}
      <div className="bg-eco-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/bucket/959b4979-43a8-4629-b1a0-51a51b81c558.png"
              alt="ЭкоДрев"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display text-lg font-bold">ЭкоДрев</span>
            <span className="text-eco-300 text-sm">/ Администратор</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-eco-300 hover:text-white transition-colors text-sm"
          >
            <Icon name="LogOut" size={16} />
            Выйти
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-eco-800">Панель администратора</h1>
          <p className="text-eco-500 mt-1">Управление товарами и ценами</p>
        </div>

        {saved && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm flex items-center gap-2 animate-scale-in">
            <Icon name="CheckCircle" size={16} />
            Изменения сохранены и применены на сайте
          </div>
        )}

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm flex items-start gap-2">
          <Icon name="Info" size={16} className="mt-0.5 shrink-0" />
          <span>Изменения применяются на сайте в реальном времени. Если товар отмечен как «Недоступен» — карточка на сайте становится серой и недоступной для заказа.</span>
        </div>

        {productsLoading ? (
          <div className="flex items-center justify-center py-16 text-eco-400 gap-3">
            <Icon name="Loader2" size={24} className="animate-spin" />
            Загрузка товаров...
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-eco-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-eco-50 border-b border-eco-100">
                <tr>
                  <th className="text-left px-6 py-4 text-eco-600 font-semibold">Фото</th>
                  <th className="text-left px-4 py-4 text-eco-600 font-semibold">Наименование</th>
                  <th className="text-left px-4 py-4 text-eco-600 font-semibold">Описание</th>
                  <th className="text-left px-4 py-4 text-eco-600 font-semibold">Метка</th>
                  <th className="text-center px-4 py-4 text-eco-600 font-semibold">Доступен</th>
                  <th className="text-center px-4 py-4 text-eco-600 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr
                    key={p.id}
                    className={`border-b border-eco-50 hover:bg-eco-50 transition-colors ${!p.inStock ? 'opacity-60' : ''}`}
                  >
                    {editing?.id === p.id ? (
                      <>
                        <td className="px-6 py-3">
                          <img src={editing.imageUrl} alt="" className="w-14 h-14 object-cover rounded-lg" />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={editing.name}
                            onChange={e => setEditing(prev => prev ? { ...prev, name: e.target.value } : prev)}
                            className="border border-eco-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-eco-400"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            value={editing.description}
                            rows={2}
                            onChange={e => setEditing(prev => prev ? { ...prev, description: e.target.value } : prev)}
                            className="border border-eco-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-eco-400 resize-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={editing.badge || ''}
                            placeholder="Метка..."
                            onChange={e => setEditing(prev => prev ? { ...prev, badge: e.target.value || null } : prev)}
                            className="border border-eco-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-eco-400"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={editing.inStock}
                            onChange={e => setEditing(prev => prev ? { ...prev, inStock: e.target.checked } : prev)}
                            className="w-4 h-4 accent-eco-600"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleSaveProduct(editing)}
                              className="bg-eco-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-eco-700 transition-colors"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="bg-eco-100 text-eco-700 px-3 py-1.5 rounded-lg text-xs hover:bg-eco-200 transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-3">
                          <div className="relative">
                            <img src={p.imageUrl} alt="" className="w-14 h-14 object-cover rounded-lg" />
                            {!p.inStock && (
                              <div className="absolute inset-0 bg-gray-400/50 rounded-lg flex items-center justify-center">
                                <Icon name="X" size={16} className="text-white" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-eco-800">{p.name}</td>
                        <td className="px-4 py-3 text-eco-500 text-xs max-w-xs">
                          <span className="line-clamp-2">{p.description}</span>
                        </td>
                        <td className="px-4 py-3">
                          {p.badge ? (
                            <span className="bg-eco-100 text-eco-700 px-2 py-1 rounded-lg text-xs font-medium">{p.badge}</span>
                          ) : (
                            <span className="text-eco-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              p.inStock
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            <Icon name={p.inStock ? 'CheckCircle' : 'XCircle'} size={13} />
                            {p.inStock ? 'В наличии' : 'Недоступен'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setEditing({ ...p })}
                            className="flex items-center gap-1 text-eco-500 hover:text-eco-700 transition-colors px-2 py-1 rounded-lg hover:bg-eco-100 text-xs mx-auto"
                          >
                            <Icon name="Pencil" size={13} />
                            Изменить
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
