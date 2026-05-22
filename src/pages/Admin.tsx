import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const initialProducts = [
  { id: '1', name: 'Доска обрезная 25×150', category: 'Доска', price: 8500, unit: 'м³', inStock: true },
  { id: '2', name: 'Брус сосновый 100×100', category: 'Брус', price: 12000, unit: 'м³', inStock: true },
  { id: '3', name: 'Брус сосновый 150×150', category: 'Брус', price: 14500, unit: 'м³', inStock: true },
  { id: '4', name: 'Вагонка сосновая', category: 'Вагонка', price: 6800, unit: 'м²', inStock: true },
  { id: '5', name: 'Террасная доска лиственница', category: 'Террасная доска', price: 18000, unit: 'м²', inStock: false },
  { id: '6', name: 'Блок-хаус сосна', category: 'Блок-хаус', price: 9200, unit: 'м²', inStock: true },
];

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  inStock: boolean;
}

type Tab = 'products' | 'site';

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saved, setSaved] = useState(false);

  const siteBlocks = [
    { id: 'hero', label: 'Главный экран (Hero)', icon: 'Home' },
    { id: 'catalog', label: 'Каталог товаров', icon: 'Package' },
    { id: 'calculator', label: 'Калькулятор', icon: 'Calculator' },
    { id: 'about', label: 'О компании', icon: 'Info' },
    { id: 'reviews', label: 'Отзывы', icon: 'Star' },
    { id: 'tips', label: 'Советы мастера', icon: 'Lightbulb' },
    { id: 'contacts', label: 'Контакты', icon: 'MapPin' },
  ];

  const handleSave = (p: Product) => {
    setProducts(prev => prev.map(x => x.id === p.id ? p : x));
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-eco-800">Панель администратора</h1>
          <p className="text-eco-500 mt-1">Управление товарами, ценами и структурой сайта</p>
        </div>

        {saved && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm flex items-center gap-2 animate-scale-in">
            <Icon name="CheckCircle" size={16} />
            Изменения сохранены
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

        {/* Products tab */}
        {tab === 'products' && (
          <div className="bg-white rounded-2xl border border-eco-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-eco-50 border-b border-eco-100">
                <tr>
                  <th className="text-left px-6 py-4 text-eco-600 font-semibold">Наименование</th>
                  <th className="text-left px-4 py-4 text-eco-600 font-semibold">Категория</th>
                  <th className="text-right px-4 py-4 text-eco-600 font-semibold">Цена (₽)</th>
                  <th className="text-center px-4 py-4 text-eco-600 font-semibold">Ед.</th>
                  <th className="text-center px-4 py-4 text-eco-600 font-semibold">В наличии</th>
                  <th className="text-center px-4 py-4 text-eco-600 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-eco-50 hover:bg-eco-50 transition-colors">
                    {editing?.id === p.id ? (
                      <>
                        <td className="px-6 py-3">
                          <input
                            value={editing.name}
                            onChange={e => setEditing(prev => prev ? { ...prev, name: e.target.value } : prev)}
                            className="border border-eco-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-eco-400"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={editing.category}
                            onChange={e => setEditing(prev => prev ? { ...prev, category: e.target.value } : prev)}
                            className="border border-eco-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-eco-400"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={editing.price}
                            onChange={e => setEditing(prev => prev ? { ...prev, price: Number(e.target.value) } : prev)}
                            className="border border-eco-200 rounded-lg px-3 py-1.5 text-sm w-28 text-right focus:outline-none focus:ring-2 focus:ring-eco-400"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            value={editing.unit}
                            onChange={e => setEditing(prev => prev ? { ...prev, unit: e.target.value } : prev)}
                            className="border border-eco-200 rounded-lg px-2 py-1.5 text-sm w-16 text-center focus:outline-none focus:ring-2 focus:ring-eco-400"
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
                              onClick={() => handleSave(editing)}
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
                        <td className="px-6 py-4 font-medium text-eco-800">{p.name}</td>
                        <td className="px-4 py-4 text-eco-600">{p.category}</td>
                        <td className="px-4 py-4 text-right font-semibold text-eco-800">{p.price.toLocaleString('ru-RU')}</td>
                        <td className="px-4 py-4 text-center text-eco-500">{p.unit}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${p.inStock ? 'bg-green-500' : 'bg-red-400'}`} />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => setEditing(p)}
                            className="text-eco-500 hover:text-eco-800 transition-colors"
                          >
                            <Icon name="Pencil" size={16} />
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

        {/* Site structure tab */}
        {tab === 'site' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {siteBlocks.map(block => (
              <div key={block.id} className="bg-white rounded-2xl border border-eco-100 shadow-sm p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-eco-100 rounded-xl flex items-center justify-center text-eco-600">
                  <Icon name={block.icon as 'Home'} size={22} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-eco-800 text-sm">{block.label}</div>
                  <div className="text-eco-400 text-xs mt-0.5">Раздел активен</div>
                </div>
                <button className="text-eco-400 hover:text-eco-700 transition-colors">
                  <Icon name="Settings" size={18} />
                </button>
              </div>
            ))}
            <div className="bg-eco-50 border-2 border-dashed border-eco-200 rounded-2xl p-6 flex items-center justify-center gap-2 text-eco-400 hover:text-eco-600 hover:border-eco-400 transition-colors cursor-pointer">
              <Icon name="Plus" size={20} />
              <span className="text-sm font-medium">Добавить раздел</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
