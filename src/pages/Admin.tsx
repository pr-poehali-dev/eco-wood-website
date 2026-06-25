import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const PRODUCTS_API = 'https://functions.poehali.dev/ba171918-0d7b-4e3f-aa6e-6ef0d857607e';
const ORDERS_API = 'https://functions.poehali.dev/97eb501c-3e4e-4500-9867-e0cd38ce1d6a';
const GET_REQUESTS_URL = 'https://functions.poehali.dev/a53097dc-0bcc-4e6f-be7f-763852152b16';
const EMPLOYEES_KEY = 'ekodrev_employees';

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

type OrderStatus = 'new' | 'confirmed' | 'delivered' | 'cancelled';
interface Order { id: number; clientName: string; phone: string; email: string; address: string; comment: string; total: number; status: OrderStatus; createdAt: string; items: { name: string; size: string; price: number; quantity: number }[]; }
interface ContactRequest { id: number; name: string; phone: string; message: string; created_at: string; is_called: boolean; }
interface Employee { id: string; name: string; role: string; login: string; password: string; }

const statusLabel: Record<OrderStatus, string> = { new: 'Новый', confirmed: 'Подтверждён', delivered: 'Доставлен', cancelled: 'Отменён' };
const statusColor: Record<OrderStatus, string> = { new: 'bg-blue-100 text-blue-700', confirmed: 'bg-amber-100 text-amber-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

function loadEmployees(): Employee[] { try { return JSON.parse(localStorage.getItem(EMPLOYEES_KEY) || '[]'); } catch { return []; } }
function saveEmployeesLS(list: Employee[]) { localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(list)); }

const PAYMENT_OPTIONS = ['Безналичная (расчётный счёт)', 'Оплата картой', 'Наличный расчёт'];

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'products' | 'orders' | 'requests' | 'stats' | 'employees'>('products');
  const [saved, setSaved] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const prevIdsRef = useRef<Set<number>>(new Set());
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Requests state
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(false);

  // Employees state
  const [employees, setEmployees] = useState<Employee[]>(loadEmployees);
  const [empForm, setEmpForm] = useState({ name: '', role: '', login: '', password: '' });
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [showPassId, setShowPassId] = useState<string | null>(null);

  // Create order state
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const emptyOrderForm = { name: '', phone: '', email: '', address: '', comment: '', payment: '' };
  const [orderForm, setOrderForm] = useState(emptyOrderForm);
  const [orderItems, setOrderItems] = useState<{ name: string; size: string; price: number; quantity: number }[]>([]);
  const [newItem, setNewItem] = useState({ name: '', size: '', price: '', quantity: '1' });
  const orderTotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const addOrderItem = () => {
    if (!newItem.name || !newItem.price) return;
    setOrderItems(prev => [...prev, { name: newItem.name, size: newItem.size, price: Number(newItem.price), quantity: Number(newItem.quantity) || 1 }]);
    setNewItem({ name: '', size: '', price: '', quantity: '1' });
  };
  const removeOrderItem = (idx: number) => setOrderItems(prev => prev.filter((_, i) => i !== idx));

  const submitCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) { setCreateError('Добавьте хотя бы одну позицию'); return; }
    if (!orderForm.payment) { setCreateError('Выберите способ оплаты'); return; }
    setCreateLoading(true); setCreateError('');
    try {
      const res = await fetch(ORDERS_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create', ...orderForm, total: orderTotal, items: orderItems }) });
      if (!res.ok) throw new Error();
      setShowCreateOrder(false); setOrderForm(emptyOrderForm); setOrderItems([]); loadOrders();
    } catch { setCreateError('Ошибка при создании заказа'); }
    finally { setCreateLoading(false); }
  };

  const loadOrders = async (silent = false) => {
    if (!silent) setOrdersLoading(true);
    try {
      const res = await fetch(ORDERS_API);
      const data = await res.json();
      const fetched: Order[] = data.orders || [];
      const fetchedIds = new Set(fetched.map(o => o.id));
      const appeared = fetched.filter(o => !prevIdsRef.current.has(o.id) && prevIdsRef.current.size > 0);
      if (appeared.length > 0) {
        if (Notification.permission === 'granted') appeared.forEach(o => new Notification('🆕 Новый заказ — ЭкоДрев', { body: `${o.clientName} · ${o.total.toLocaleString('ru-RU')} ₽` }));
        setNewIds(prev => { const next = new Set(prev); appeared.forEach(o => next.add(o.id)); return next; });
        setTimeout(() => setNewIds(prev => { const next = new Set(prev); appeared.forEach(o => next.delete(o.id)); return next; }), 4000);
      }
      prevIdsRef.current = fetchedIds; setOrders(fetched);
    } finally { if (!silent) setOrdersLoading(false); }
  };

  const updateStatus = async (id: number, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await fetch(ORDERS_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update_status', id, status }) });
  };

  const loadRequests = async () => {
    setReqLoading(true);
    try { const res = await fetch(GET_REQUESTS_URL); const data = await res.json(); setRequests(data.requests || []); }
    finally { setReqLoading(false); }
  };

  const toggleCalled = async (req: ContactRequest) => {
    const updated = { ...req, is_called: !req.is_called };
    setRequests(prev => prev.map(r => r.id === req.id ? updated : r));
    await fetch(GET_REQUESTS_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: req.id, is_called: updated.is_called }) });
  };

  const addEmployee = () => {
    if (!empForm.name || !empForm.login || !empForm.password) return;
    const list = [...employees, { ...empForm, id: Date.now().toString() }];
    setEmployees(list); saveEmployeesLS(list);
    setEmpForm({ name: '', role: '', login: '', password: '' }); setShowEmpForm(false);
  };
  const removeEmployee = (id: string) => { const list = employees.filter(e => e.id !== id); setEmployees(list); saveEmployeesLS(list); };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const downloadCSV = () => {
    const header = 'ID,Дата,Клиент,Телефон,Email,Адрес,Сумма,Статус\n';
    const rows = filtered.map(o => `${o.id},${formatDate(o.createdAt)},"${o.clientName}",${o.phone},"${o.email || ''}","${o.address || ''}",${o.total},${statusLabel[o.status]}`).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `ekodrev-orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const totalSum = filtered.reduce((s, o) => s + o.total, 0);
  const uncalledCount = requests.filter(r => !r.is_called).length;
  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
    loadOrders();
    pollingRef.current = setInterval(() => loadOrders(true), 15000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  useEffect(() => { if (tab === 'requests') loadRequests(); }, [tab]);

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
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-eco-200 overflow-x-auto">
          {[
            { id: 'products', label: 'Товары', icon: 'ShoppingBag' },
            { id: 'orders', label: 'Заказы', icon: 'Package', badge: newOrdersCount > 0 ? newOrdersCount : null },
            { id: 'requests', label: 'Заявки', icon: 'Phone', badge: uncalledCount > 0 ? uncalledCount : null },
            { id: 'stats', label: 'Статистика', icon: 'BarChart2' },
            { id: 'employees', label: 'Сотрудники', icon: 'Users' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${tab === t.id ? 'border-eco-700 text-eco-800' : 'border-transparent text-eco-500 hover:text-eco-700'}`}>
              <Icon name={t.icon as 'Package'} size={16} />
              {t.label}
              {t.badge && <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && <>
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
        </>}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-eco-800">Заказы</h1>
                <p className="text-eco-500 mt-1">Заказы с сайта в реальном времени</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setShowCreateOrder(v => !v)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium">
                  <Icon name="PlusCircle" size={15} />Создать заказ
                </button>
                <button onClick={() => loadOrders()} className="flex items-center gap-2 bg-white border border-eco-200 text-eco-700 px-4 py-2.5 rounded-xl hover:bg-eco-50 transition-colors text-sm font-medium">
                  <Icon name="RefreshCw" size={15} />Обновить
                </button>
                <button onClick={downloadCSV} className="flex items-center gap-2 bg-eco-700 text-white px-4 py-2.5 rounded-xl hover:bg-eco-800 transition-colors text-sm font-medium">
                  <Icon name="Download" size={15} />CSV
                </button>
              </div>
            </div>

            {showCreateOrder && (
              <form onSubmit={submitCreateOrder} className="bg-white rounded-2xl border border-green-200 shadow-sm p-6 mb-6 space-y-5">
                <h3 className="font-display text-xl font-semibold text-eco-800 flex items-center gap-2"><Icon name="PlusCircle" size={20} className="text-green-600" />Новый заказ для клиента</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[{ key: 'name', label: 'Имя клиента *', placeholder: 'Иван Иванов', required: true, type: 'text' }, { key: 'phone', label: 'Телефон *', placeholder: '+7', required: true, type: 'tel' }, { key: 'email', label: 'E-mail *', placeholder: 'example@mail.ru', required: true, type: 'email' }, { key: 'address', label: 'Адрес доставки', placeholder: 'Город, улица, дом', required: false, type: 'text' }].map(f => (
                    <div key={f.key}>
                      <label className="text-eco-700 text-sm font-medium block mb-1">{f.label}</label>
                      <input required={f.required} type={f.type} placeholder={f.placeholder} value={orderForm[f.key as keyof typeof orderForm]}
                        onChange={e => setOrderForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full border border-eco-200 rounded-xl px-3 py-2.5 text-sm text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-eco-700 text-sm font-medium block mb-2">Способ оплаты *</label>
                  <div className="flex flex-col gap-2">
                    {PAYMENT_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${orderForm.payment === opt ? 'border-eco-600 bg-eco-600' : 'border-eco-300'}`}>
                          {orderForm.payment === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <input type="radio" name="adm-payment" value={opt} className="sr-only" checked={orderForm.payment === opt} onChange={() => setOrderForm(p => ({ ...p, payment: opt }))} />
                        <span className="text-eco-700 text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-eco-700 text-sm font-medium block mb-2">Позиции заказа</label>
                  {orderItems.length > 0 && <div className="space-y-2 mb-3">
                    {orderItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-eco-50 rounded-xl px-3 py-2 text-sm">
                        <span className="flex-1 text-eco-800">{item.name} {item.size && `· ${item.size}`}</span>
                        <span className="text-eco-600 shrink-0">{item.quantity} шт × {item.price.toLocaleString('ru-RU')} ₽</span>
                        <button type="button" onClick={() => removeOrderItem(i)} className="text-red-400 hover:text-red-600"><Icon name="X" size={14} /></button>
                      </div>
                    ))}
                    <div className="font-semibold text-eco-800 text-sm text-right px-3">Итого: {orderTotal.toLocaleString('ru-RU')} ₽</div>
                  </div>}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input placeholder="Название *" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} className="col-span-2 sm:col-span-1 border border-eco-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50" />
                    <input placeholder="Размер (мм)" value={newItem.size} onChange={e => setNewItem(p => ({ ...p, size: e.target.value }))} className="border border-eco-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50" />
                    <input placeholder="Цена ₽ *" type="number" min="1" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))} className="border border-eco-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50" />
                    <div className="flex gap-2">
                      <input placeholder="Кол-во" type="number" min="1" value={newItem.quantity} onChange={e => setNewItem(p => ({ ...p, quantity: e.target.value }))} className="w-20 border border-eco-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50" />
                      <button type="button" onClick={addOrderItem} className="flex-1 bg-eco-100 hover:bg-eco-200 text-eco-700 rounded-xl px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"><Icon name="Plus" size={14} />Добавить</button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-eco-700 text-sm font-medium block mb-1">Комментарий</label>
                  <textarea rows={2} placeholder="Пожелания клиента..." value={orderForm.comment} onChange={e => setOrderForm(p => ({ ...p, comment: e.target.value }))} className="w-full border border-eco-200 rounded-xl px-3 py-2.5 text-sm text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 resize-none" />
                </div>
                {createError && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{createError}</p>}
                <div className="flex gap-3">
                  <button type="submit" disabled={createLoading} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold disabled:opacity-60">
                    <Icon name={createLoading ? 'Loader2' : 'Check'} size={16} className={createLoading ? 'animate-spin' : ''} />
                    {createLoading ? 'Сохраняем...' : 'Оформить заказ'}
                  </button>
                  <button type="button" onClick={() => { setShowCreateOrder(false); setCreateError(''); setOrderItems([]); setOrderForm(emptyOrderForm); }} className="px-6 py-2.5 rounded-xl border border-eco-200 text-eco-600 hover:bg-eco-50 transition-colors text-sm">Отмена</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[{ label: 'Всего', value: orders.length, color: 'bg-eco-100 text-eco-700' }, { label: 'Новых', value: orders.filter(o => o.status === 'new').length, color: 'bg-blue-100 text-blue-700' }, { label: 'Подтверждённых', value: orders.filter(o => o.status === 'confirmed').length, color: 'bg-amber-100 text-amber-700' }, { label: 'Доставлено', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-100 text-green-700' }].map(stat => (
                <div key={stat.label} className={`rounded-2xl p-4 ${stat.color}`}><div className="text-2xl font-bold font-display">{stat.value}</div><div className="text-xs mt-1 opacity-80">{stat.label}</div></div>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              {(['all', 'new', 'confirmed', 'delivered', 'cancelled'] as const).map(s => (
                <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === s ? 'bg-eco-700 text-white' : 'bg-white border border-eco-200 text-eco-600 hover:bg-eco-50'}`}>
                  {s === 'all' ? 'Все' : statusLabel[s]}
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-20 text-eco-400 gap-3"><Icon name="Loader2" size={24} className="animate-spin" />Загрузка заказов...</div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-16 text-center text-eco-400"><div className="text-5xl mb-4">📦</div><p className="font-medium text-eco-600">Заказов пока нет</p></div>
            ) : (
              <div className="space-y-3">
                {filtered.map(order => (
                  <div key={order.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${newIds.has(order.id) ? 'border-blue-400 shadow-blue-100' : 'border-eco-100'}`}>
                    <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-eco-50 transition-colors" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                      <div className="font-mono text-eco-400 text-xs shrink-0">#{order.id}</div>
                      <div className="text-eco-400 text-xs shrink-0 hidden sm:block">{formatDate(order.createdAt)}</div>
                      <div className="flex-1 min-w-0"><div className="font-medium text-eco-800 truncate">{order.clientName}</div><div className="text-eco-500 text-xs">{order.phone}</div></div>
                      <div className="font-semibold text-eco-800 shrink-0 hidden sm:block">{order.total.toLocaleString('ru-RU')} ₽</div>
                      <span className={`shrink-0 inline-block px-2 py-1 rounded-lg text-xs font-medium ${statusColor[order.status]}`}>{statusLabel[order.status]}</span>
                      <Icon name={expandedId === order.id ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-eco-400 shrink-0" />
                    </div>
                    {expandedId === order.id && (
                      <div className="border-t border-eco-100 px-5 py-4 bg-eco-50 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div><div className="text-eco-500 text-xs mb-1">Телефон</div><a href={`tel:${order.phone}`} className="text-eco-800 font-medium">{order.phone}</a></div>
                          {order.email && <div><div className="text-eco-500 text-xs mb-1">Email</div><span className="text-eco-800">{order.email}</span></div>}
                          {order.address && <div><div className="text-eco-500 text-xs mb-1">Адрес</div><span className="text-eco-800">{order.address}</span></div>}
                          {order.comment && <div><div className="text-eco-500 text-xs mb-1">Комментарий</div><span className="text-eco-700">{order.comment}</span></div>}
                        </div>
                        <div>
                          <div className="text-eco-500 text-xs font-semibold uppercase tracking-wide mb-2">Состав заказа</div>
                          <div className="space-y-1.5">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-sm bg-white rounded-lg px-3 py-2 border border-eco-100">
                                <div><span className="font-medium text-eco-800">{item.name}</span>{item.size && <span className="text-eco-500 text-xs ml-2">{item.size}</span>}<span className="text-eco-500 text-xs ml-2">× {item.quantity} шт</span></div>
                                <span className="font-semibold text-eco-700">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between font-bold text-eco-800 pt-2 px-3"><span>Итого:</span><span>{order.total.toLocaleString('ru-RU')} ₽</span></div>
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-eco-600 text-sm font-medium">Статус:</span>
                          <select value={order.status} onChange={e => updateStatus(order.id, e.target.value as OrderStatus)} className="border border-eco-200 rounded-lg px-3 py-1.5 text-sm text-eco-700 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-white">
                            <option value="new">Новый</option><option value="confirmed">Подтверждён</option><option value="delivered">Доставлен</option><option value="cancelled">Отменён</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="bg-white rounded-2xl border border-eco-200 px-5 py-3 flex justify-between font-semibold text-eco-800">
                  <span>Итого ({filtered.length} заказов):</span><span className="font-display text-lg">{totalSum.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── REQUESTS TAB ── */}
        {tab === 'requests' && (
          <>
            <div className="mb-6 flex justify-between items-center gap-4">
              <div><h1 className="font-display text-3xl font-bold text-eco-800">Заявки на звонок</h1><p className="text-eco-500 mt-1">Клиенты из формы на сайте</p></div>
              <button onClick={loadRequests} disabled={reqLoading} className="flex items-center gap-2 bg-eco-700 text-white px-5 py-2.5 rounded-xl hover:bg-eco-800 transition-colors text-sm font-medium disabled:opacity-60">
                <Icon name={reqLoading ? 'Loader2' : 'RefreshCw'} size={16} className={reqLoading ? 'animate-spin' : ''} />Обновить
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
              <div className="rounded-2xl p-4 bg-red-100 text-red-700"><div className="text-2xl font-bold font-display">{requests.filter(r => !r.is_called).length}</div><div className="text-xs mt-1 opacity-80">Не обзвонили</div></div>
              <div className="rounded-2xl p-4 bg-green-100 text-green-700"><div className="text-2xl font-bold font-display">{requests.filter(r => r.is_called).length}</div><div className="text-xs mt-1 opacity-80">Позвонили</div></div>
            </div>
            {reqLoading ? <div className="flex items-center justify-center py-20 text-eco-400 gap-3"><Icon name="Loader2" size={24} className="animate-spin" />Загрузка...</div>
            : requests.length === 0 ? <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-16 text-center text-eco-400"><div className="text-5xl mb-4">📭</div><p className="font-medium text-eco-600">Заявок пока нет</p></div>
            : <div className="bg-white rounded-2xl border border-eco-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-eco-50 border-b border-eco-100"><tr>
                      <th className="text-left px-4 py-3 text-eco-600 font-semibold">Дата</th>
                      <th className="text-left px-4 py-3 text-eco-600 font-semibold">Клиент</th>
                      <th className="text-left px-4 py-3 text-eco-600 font-semibold">Телефон</th>
                      <th className="text-left px-4 py-3 text-eco-600 font-semibold">Сообщение</th>
                      <th className="text-center px-4 py-3 text-eco-600 font-semibold">Позвонили?</th>
                    </tr></thead>
                    <tbody>
                      {requests.map(req => (
                        <tr key={req.id} className={`border-b border-eco-50 hover:bg-eco-50 ${req.is_called ? 'opacity-50' : ''}`}>
                          <td className="px-4 py-3 text-eco-500 text-xs whitespace-nowrap">{formatDate(req.created_at)}</td>
                          <td className="px-4 py-3 font-medium text-eco-800">{req.name}</td>
                          <td className="px-4 py-3"><a href={`tel:${req.phone}`} className="text-eco-700 hover:text-eco-900 font-medium">{req.phone}</a></td>
                          <td className="px-4 py-3 text-eco-600 max-w-xs">{req.message ? <span className="line-clamp-2">{req.message}</span> : <span className="text-eco-300 italic">Без сообщения</span>}</td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => toggleCalled(req)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${req.is_called ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                              {req.is_called ? 'Позвонили ✓' : 'Позвонить'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>}
          </>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <>
            <div className="mb-8"><h1 className="font-display text-3xl font-bold text-eco-800">Статистика</h1><p className="text-eco-500 mt-1">Сводные данные по заказам</p></div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-16 text-center"><div className="text-5xl mb-4">📊</div><p className="font-medium text-eco-600 text-lg">Данных пока нет</p><p className="text-eco-400 text-sm mt-2">Статистика появится после первых заказов</p></div>
            ) : <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[{ label: 'Всего заказов', value: orders.length, color: 'bg-eco-100 text-eco-700', icon: '📦' }, { label: 'Выручка', value: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0).toLocaleString('ru-RU') + ' ₽', color: 'bg-green-100 text-green-700', icon: '💰' }, { label: 'Новых', value: orders.filter(o => o.status === 'new').length, color: 'bg-blue-100 text-blue-700', icon: '🆕' }, { label: 'Доставлено', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-amber-100 text-amber-700', icon: '✅' }].map(s => (
                  <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}><div className="text-2xl mb-1">{s.icon}</div><div className="font-display text-2xl font-bold">{s.value}</div><div className="text-xs mt-1 opacity-75">{s.label}</div></div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-6">
                <h3 className="font-semibold text-eco-800 mb-4">Распределение по статусам</h3>
                <div className="space-y-3">
                  {(['new','confirmed','delivered','cancelled'] as OrderStatus[]).map(s => {
                    const count = orders.filter(o => o.status === s).length;
                    const pct = orders.length ? Math.round(count / orders.length * 100) : 0;
                    return <div key={s}><div className="flex justify-between text-sm mb-1"><span className="text-eco-700">{statusLabel[s]}</span><span className="font-medium text-eco-800">{count} ({pct}%)</span></div><div className="h-2 bg-eco-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${s==='new'?'bg-blue-400':s==='confirmed'?'bg-amber-400':s==='delivered'?'bg-green-500':'bg-red-400'}`} style={{ width: `${pct}%` }} /></div></div>;
                  })}
                </div>
              </div>
            </>}
          </>
        )}

        {/* ── EMPLOYEES TAB ── */}
        {tab === 'employees' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div><h1 className="font-display text-3xl font-bold text-eco-800">Сотрудники</h1><p className="text-eco-500 mt-1">Логины и пароли сотрудников</p></div>
              <button onClick={() => setShowEmpForm(v => !v)} className="flex items-center gap-2 bg-eco-700 text-white px-5 py-2.5 rounded-xl hover:bg-eco-800 transition-colors text-sm font-medium">
                <Icon name="UserPlus" size={16} />Добавить сотрудника
              </button>
            </div>
            {showEmpForm && (
              <div className="bg-white rounded-2xl border border-eco-200 shadow-sm p-6 mb-6 space-y-4">
                <h3 className="font-semibold text-eco-800">Новый сотрудник</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[{ key: 'name', label: 'Имя', placeholder: 'Иван Иванов' }, { key: 'role', label: 'Должность', placeholder: 'Менеджер' }, { key: 'login', label: 'Логин', placeholder: 'ivan.ivanov' }, { key: 'password', label: 'Пароль', placeholder: '••••••••' }].map(f => (
                    <div key={f.key}><label className="text-eco-700 text-sm font-medium block mb-1">{f.label}</label>
                      <input type="text" placeholder={f.placeholder} value={empForm[f.key as keyof typeof empForm]} onChange={e => setEmpForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full border border-eco-200 rounded-xl px-3 py-2.5 text-sm text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={addEmployee} className="btn-primary px-6 py-2 text-sm">Добавить</button>
                  <button onClick={() => setShowEmpForm(false)} className="btn-secondary px-6 py-2 text-sm">Отмена</button>
                </div>
              </div>
            )}
            {employees.length === 0 ? <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-16 text-center"><div className="text-5xl mb-4">👥</div><p className="font-medium text-eco-600">Сотрудников пока нет</p></div>
            : <div className="bg-white rounded-2xl border border-eco-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-eco-50 border-b border-eco-100"><tr>
                    <th className="text-left px-5 py-3 text-eco-600 font-semibold">Имя</th>
                    <th className="text-left px-5 py-3 text-eco-600 font-semibold">Должность</th>
                    <th className="text-left px-5 py-3 text-eco-600 font-semibold">Логин</th>
                    <th className="text-left px-5 py-3 text-eco-600 font-semibold">Пароль</th>
                    <th className="text-center px-5 py-3 text-eco-600 font-semibold">Действия</th>
                  </tr></thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id} className="border-b border-eco-50 hover:bg-eco-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-eco-800">{emp.name}</td>
                        <td className="px-5 py-3 text-eco-600">{emp.role || '—'}</td>
                        <td className="px-5 py-3 font-mono text-eco-700">{emp.login}</td>
                        <td className="px-5 py-3">
                          <button onClick={() => setShowPassId(showPassId === emp.id ? null : emp.id)} className="flex items-center gap-1.5 text-xs text-eco-500 hover:text-eco-800 transition-colors">
                            <Icon name={showPassId === emp.id ? 'EyeOff' : 'Eye'} size={14} />{showPassId === emp.id ? emp.password : '••••••••'}
                          </button>
                        </td>
                        <td className="px-5 py-3 text-center"><button onClick={() => removeEmployee(emp.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Удалить"><Icon name="Trash2" size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>}
          </>
        )}
      </div>
    </div>
  );
}