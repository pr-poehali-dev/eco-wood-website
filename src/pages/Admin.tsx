import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const PRODUCTS_API = 'https://functions.poehali.dev/ba171918-0d7b-4e3f-aa6e-6ef0d857607e';
const SECTIONS_API = 'https://functions.poehali.dev/e0eb1640-c731-4a50-9e29-bdd97ce016b0';

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

interface Section {
  id: string;
  label: string;
  icon: string;
  sortOrder: number;
  visible: boolean;
}

type Tab = 'products' | 'site';

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('products');
  const [saved, setSaved] = useState(false);

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);

  // Sections
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (tab === 'site') loadSections();
  }, [tab]);

  const loadProducts = async () => {
    setProductsLoading(true);
    const res = await fetch(PRODUCTS_API);
    const data = await res.json();
    setProducts(data.products || []);
    setProductsLoading(false);
  };

  const loadSections = async () => {
    setSectionsLoading(true);
    const res = await fetch(SECTIONS_API);
    const data = await res.json();
    setSections(data.sections || []);
    setSectionsLoading(false);
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

  const handleToggleVisible = async (section: Section) => {
    const newVal = !section.visible;
    setSections(prev => prev.map(s => s.id === section.id ? { ...s, visible: newVal } : s));
    await fetch(SECTIONS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_visible', id: section.id, visible: newVal }),
    });
    showSaved();
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = async (dropIdx: number) => {
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    const updated = [...sections];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(dropIdx, 0, moved);
    const reordered = updated.map((s, i) => ({ ...s, sortOrder: i + 1 }));
    setSections(reordered);
    setDragIdx(null);
    setDragOverIdx(null);
    await fetch(SECTIONS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reorder',
        items: reordered.map(s => ({ id: s.id, sortOrder: s.sortOrder })),
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
          <p className="text-eco-500 mt-1">Управление товарами, ценами и структурой сайта</p>
        </div>

        {saved && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm flex items-center gap-2 animate-scale-in">
            <Icon name="CheckCircle" size={16} />
            Изменения сохранены и применены на сайте
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-eco-200">
          {[
            { id: 'products' as Tab, label: 'Товары и цены', icon: 'Package' },
            { id: 'site' as Tab, label: 'Структура сайта', icon: 'Layout' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.id
                  ? 'border-eco-600 text-eco-800'
                  : 'border-transparent text-eco-500 hover:text-eco-700'
              }`}
            >
              <Icon name={t.icon as 'Package'} size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <>
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
          </>
        )}

        {/* SITE STRUCTURE TAB */}
        {tab === 'site' && (
          <>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm flex items-start gap-2">
              <Icon name="Info" size={16} className="mt-0.5 shrink-0" />
              <span>Перетащите блоки для изменения порядка на сайте. Используйте переключатель для скрытия/показа секции.</span>
            </div>

            {sectionsLoading ? (
              <div className="flex items-center justify-center py-16 text-eco-400 gap-3">
                <Icon name="Loader2" size={24} className="animate-spin" />
                Загрузка секций...
              </div>
            ) : (
              <div className="space-y-3">
                {sections.map((section, idx) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={e => handleDragOver(e, idx)}
                    onDrop={() => handleDrop(idx)}
                    onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                    className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 cursor-grab active:cursor-grabbing transition-all ${
                      dragOverIdx === idx && dragIdx !== idx
                        ? 'border-eco-400 shadow-md scale-[1.01]'
                        : 'border-eco-100'
                    } ${!section.visible ? 'opacity-50' : ''}`}
                  >
                    <div className="text-eco-300 hover:text-eco-500 transition-colors shrink-0">
                      <Icon name="GripVertical" size={20} />
                    </div>

                    <div className="w-8 h-8 bg-eco-100 rounded-lg flex items-center justify-center shrink-0">
                      <Icon name={section.icon as 'Home'} size={16} className="text-eco-600" />
                    </div>

                    <div className="flex-1">
                      <div className="font-medium text-eco-800">{section.label}</div>
                      <div className="text-eco-400 text-xs mt-0.5">Позиция #{idx + 1}</div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {!section.visible && (
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg">Скрыта</span>
                      )}
                      <button
                        onClick={() => handleToggleVisible(section)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          section.visible ? 'bg-eco-600' : 'bg-eco-200'
                        }`}
                        title={section.visible ? 'Скрыть секцию' : 'Показать секцию'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            section.visible ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
