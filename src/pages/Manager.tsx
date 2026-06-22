import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const EMPLOYEES_KEY = 'ekodrev_employees';
interface Employee { id: string; name: string; role: string; login: string; password: string; }
function loadEmployees(): Employee[] {
  try { return JSON.parse(localStorage.getItem(EMPLOYEES_KEY) || '[]'); } catch { return []; }
}
function saveEmployees(list: Employee[]) { localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(list)); }

const ORDERS_API = 'https://functions.poehali.dev/97eb501c-3e4e-4500-9867-e0cd38ce1d6a';
const GET_REQUESTS_URL = 'https://functions.poehali.dev/a53097dc-0bcc-4e6f-be7f-763852152b16';

type OrderStatus = 'new' | 'confirmed' | 'delivered' | 'cancelled';

interface Order {
  id: number;
  clientName: string;
  phone: string;
  email: string;
  address: string;
  comment: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: { name: string; size: string; price: number; quantity: number }[];
}

interface ContactRequest {
  id: number;
  name: string;
  phone: string;
  message: string;
  created_at: string;
  is_called: boolean;
}

const statusLabel: Record<OrderStatus, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const statusColor: Record<OrderStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-amber-100 text-amber-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Manager() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'orders' | 'requests' | 'stats' | 'employees'>('orders');

  // ── Orders ──────────────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const prevIdsRef = useRef<Set<number>>(new Set());
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Employees ──
  const [employees, setEmployees] = useState<Employee[]>(loadEmployees);
  const [empForm, setEmpForm] = useState({ name: '', role: '', login: '', password: '' });
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [showPassId, setShowPassId] = useState<string | null>(null);

  const addEmployee = () => {
    if (!empForm.name || !empForm.login || !empForm.password) return;
    const list = [...employees, { ...empForm, id: Date.now().toString() }];
    setEmployees(list); saveEmployees(list);
    setEmpForm({ name: '', role: '', login: '', password: '' }); setShowEmpForm(false);
  };
  const removeEmployee = (id: string) => {
    const list = employees.filter(e => e.id !== id);
    setEmployees(list); saveEmployees(list);
  };

  // ── Orders ──
  const loadOrders = async (silent = false) => {
    if (!silent) setOrdersLoading(true);
    try {
      const res = await fetch(ORDERS_API);
      const data = await res.json();
      const fetched: Order[] = data.orders || [];

      const fetchedIds = new Set(fetched.map(o => o.id));
      const appeared = fetched.filter(o => !prevIdsRef.current.has(o.id) && prevIdsRef.current.size > 0);
      if (appeared.length > 0) {
        // Browser notification
        if (Notification.permission === 'granted') {
          appeared.forEach(o => new Notification('🆕 Новый заказ — ЭкоДрев', {
            body: `${o.clientName} · ${o.total.toLocaleString('ru-RU')} ₽`,
            icon: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/bucket/959b4979-43a8-4629-b1a0-51a51b81c558.png',
          }));
        }
        setNewIds(prev => {
          const next = new Set(prev);
          appeared.forEach(o => next.add(o.id));
          return next;
        });
        setTimeout(() => {
          setNewIds(prev => {
            const next = new Set(prev);
            appeared.forEach(o => next.delete(o.id));
            return next;
          });
        }, 4000);
      }
      prevIdsRef.current = fetchedIds;
      setOrders(fetched);
    } finally {
      if (!silent) setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
    loadOrders();
    pollingRef.current = setInterval(() => loadOrders(true), 15000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const updateStatus = async (id: number, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await fetch(ORDERS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_status', id, status }),
    });
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const totalSum = filtered.reduce((s, o) => s + o.total, 0);

  const downloadCSV = () => {
    const header = 'ID,Дата,Клиент,Телефон,Email,Адрес,Сумма,Статус\n';
    const rows = filtered.map(o =>
      `${o.id},${formatDate(o.createdAt)},"${o.clientName}",${o.phone},"${o.email || ''}","${o.address || ''}",${o.total},${statusLabel[o.status]}`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ekodrev-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Requests ─────────────────────────────────────────────
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(false);

  const loadRequests = async () => {
    setReqLoading(true);
    try {
      const res = await fetch(GET_REQUESTS_URL);
      const data = await res.json();
      setRequests(data.requests || []);
    } finally {
      setReqLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'requests') loadRequests();
  }, [tab]);

  const toggleCalled = async (req: ContactRequest) => {
    const updated = { ...req, is_called: !req.is_called };
    setRequests(prev => prev.map(r => r.id === req.id ? updated : r));
    await fetch(GET_REQUESTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: req.id, is_called: updated.is_called }),
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const uncalledCount = requests.filter(r => !r.is_called).length;
  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  return (
    <div className="min-h-screen bg-eco-50">
      {/* Header */}
      <div className="bg-eco-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/bucket/959b4979-43a8-4629-b1a0-51a51b81c558.png"
              alt="ЭкоДрев"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display text-lg font-bold">ЭкоДрев</span>
            <span className="text-eco-300 text-sm">/ Менеджер</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-eco-400 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
              обновление каждые 15 сек
            </span>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-eco-300 hover:text-white transition-colors text-sm"
            >
              <Icon name="LogOut" size={16} />
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-eco-200">
          <button
            onClick={() => setTab('orders')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === 'orders' ? 'border-eco-700 text-eco-800' : 'border-transparent text-eco-500 hover:text-eco-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon name="Package" size={16} />
              Заказы
              {newOrdersCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {newOrdersCount}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === 'requests' ? 'border-eco-700 text-eco-800' : 'border-transparent text-eco-500 hover:text-eco-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon name="Phone" size={16} />
              Заявки на звонок
              {uncalledCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {uncalledCount}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setTab('stats')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === 'stats' ? 'border-eco-700 text-eco-800' : 'border-transparent text-eco-500 hover:text-eco-700'
            }`}
          >
            <span className="flex items-center gap-2"><Icon name="BarChart2" size={16} />Статистика</span>
          </button>
          <button
            onClick={() => setTab('employees')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === 'employees' ? 'border-eco-700 text-eco-800' : 'border-transparent text-eco-500 hover:text-eco-700'
            }`}
          >
            <span className="flex items-center gap-2"><Icon name="Users" size={16} />Сотрудники</span>
          </button>
        </div>

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-eco-800">Заказы</h1>
                <p className="text-eco-500 mt-1">Заказы с сайта в реальном времени</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => loadOrders()}
                  className="flex items-center gap-2 bg-white border border-eco-200 text-eco-700 px-4 py-2.5 rounded-xl hover:bg-eco-50 transition-colors text-sm font-medium"
                >
                  <Icon name="RefreshCw" size={15} />
                  Обновить
                </button>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 bg-eco-700 text-white px-4 py-2.5 rounded-xl hover:bg-eco-800 transition-colors text-sm font-medium"
                >
                  <Icon name="Download" size={15} />
                  CSV
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Всего заказов', value: orders.length, color: 'bg-eco-100 text-eco-700' },
                { label: 'Новых', value: orders.filter(o => o.status === 'new').length, color: 'bg-blue-100 text-blue-700' },
                { label: 'Подтверждённых', value: orders.filter(o => o.status === 'confirmed').length, color: 'bg-amber-100 text-amber-700' },
                { label: 'Доставлено', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-100 text-green-700' },
              ].map(stat => (
                <div key={stat.label} className={`rounded-2xl p-4 ${stat.color}`}>
                  <div className="text-2xl font-bold font-display">{stat.value}</div>
                  <div className="text-xs mt-1 opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap mb-4">
              {(['all', 'new', 'confirmed', 'delivered', 'cancelled'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filter === s ? 'bg-eco-700 text-white' : 'bg-white border border-eco-200 text-eco-600 hover:bg-eco-50'
                  }`}
                >
                  {s === 'all' ? 'Все' : statusLabel[s]}
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-20 text-eco-400 gap-3">
                <Icon name="Loader2" size={24} className="animate-spin" />
                Загрузка заказов...
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-16 text-center text-eco-400">
                <div className="text-5xl mb-4">📦</div>
                <p className="font-medium text-eco-600">Заказов пока нет</p>
                <p className="text-sm mt-1">Как только клиент оформит заказ на сайте — он появится здесь автоматически</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(order => (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-500 ${
                      newIds.has(order.id) ? 'border-blue-400 shadow-blue-100 shadow-md' : 'border-eco-100'
                    }`}
                  >
                    {/* Row */}
                    <div
                      className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-eco-50 transition-colors"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      {newIds.has(order.id) && (
                        <span className="shrink-0 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                          НОВЫЙ
                        </span>
                      )}
                      <div className="font-mono text-eco-400 text-xs shrink-0">#{order.id}</div>
                      <div className="text-eco-400 text-xs shrink-0 hidden sm:block">{formatDate(order.createdAt)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-eco-800 truncate">{order.clientName}</div>
                        <div className="text-eco-500 text-xs">{order.phone}</div>
                      </div>
                      <div className="font-semibold text-eco-800 shrink-0 hidden sm:block">
                        {order.total.toLocaleString('ru-RU')} ₽
                      </div>
                      <span className={`shrink-0 inline-block px-2 py-1 rounded-lg text-xs font-medium ${statusColor[order.status]}`}>
                        {statusLabel[order.status]}
                      </span>
                      <Icon name={expandedId === order.id ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-eco-400 shrink-0" />
                    </div>

                    {/* Expanded */}
                    {expandedId === order.id && (
                      <div className="border-t border-eco-100 px-5 py-4 bg-eco-50 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-eco-500 text-xs mb-1">Телефон</div>
                            <a href={`tel:${order.phone}`} className="text-eco-800 font-medium hover:text-eco-900">{order.phone}</a>
                          </div>
                          {order.email && (
                            <div>
                              <div className="text-eco-500 text-xs mb-1">Email</div>
                              <span className="text-eco-800">{order.email}</span>
                            </div>
                          )}
                          {order.address && (
                            <div>
                              <div className="text-eco-500 text-xs mb-1">Адрес доставки</div>
                              <span className="text-eco-800">{order.address}</span>
                            </div>
                          )}
                          {order.comment && (
                            <div>
                              <div className="text-eco-500 text-xs mb-1">Комментарий</div>
                              <span className="text-eco-700">{order.comment}</span>
                            </div>
                          )}
                        </div>

                        {/* Items */}
                        <div>
                          <div className="text-eco-500 text-xs font-semibold uppercase tracking-wide mb-2">Состав заказа</div>
                          <div className="space-y-1.5">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-sm bg-white rounded-lg px-3 py-2 border border-eco-100">
                                <div>
                                  <span className="font-medium text-eco-800">{item.name}</span>
                                  {item.size && <span className="text-eco-500 text-xs ml-2">{item.size}</span>}
                                  <span className="text-eco-500 text-xs ml-2">× {item.quantity} шт</span>
                                </div>
                                <span className="font-semibold text-eco-700">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between font-bold text-eco-800 pt-2 px-3">
                            <span>Итого:</span>
                            <span>{order.total.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        </div>

                        {/* Status change */}
                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-eco-600 text-sm font-medium">Статус:</span>
                          <select
                            value={order.status}
                            onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                            className="border border-eco-200 rounded-lg px-3 py-1.5 text-sm text-eco-700 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-white"
                          >
                            <option value="new">Новый</option>
                            <option value="confirmed">Подтверждён</option>
                            <option value="delivered">Доставлен</option>
                            <option value="cancelled">Отменён</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Total */}
                <div className="bg-white rounded-2xl border border-eco-200 px-5 py-3 flex justify-between font-semibold text-eco-800">
                  <span>Итого по фильтру ({filtered.length} заказов):</span>
                  <span className="font-display text-lg">{totalSum.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── REQUESTS TAB ── */}
        {tab === 'requests' && (
          <>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-eco-800">Заявки на звонок</h1>
                <p className="text-eco-500 mt-1">Клиенты, оставившие заявку через форму на сайте</p>
              </div>
              <button
                onClick={loadRequests}
                disabled={reqLoading}
                className="flex items-center gap-2 bg-eco-700 text-white px-5 py-2.5 rounded-xl hover:bg-eco-800 transition-colors text-sm font-medium disabled:opacity-60"
              >
                <Icon name={reqLoading ? 'Loader2' : 'RefreshCw'} size={16} className={reqLoading ? 'animate-spin' : ''} />
                Обновить
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
              <div className="rounded-2xl p-4 bg-red-100 text-red-700">
                <div className="text-2xl font-bold font-display">{requests.filter(r => !r.is_called).length}</div>
                <div className="text-xs mt-1 opacity-80">Не обзвонили</div>
              </div>
              <div className="rounded-2xl p-4 bg-green-100 text-green-700">
                <div className="text-2xl font-bold font-display">{requests.filter(r => r.is_called).length}</div>
                <div className="text-xs mt-1 opacity-80">Позвонили</div>
              </div>
            </div>

            {reqLoading ? (
              <div className="flex items-center justify-center py-20 text-eco-400 gap-3">
                <Icon name="Loader2" size={24} className="animate-spin" />
                Загрузка заявок...
              </div>
            ) : requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-16 text-center text-eco-400">
                <div className="text-5xl mb-4">📭</div>
                <p className="font-medium text-eco-600">Заявок пока нет</p>
                <p className="text-sm mt-1">Как только клиент заполнит форму на сайте — заявка появится здесь</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-eco-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-eco-50 border-b border-eco-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-eco-600 font-semibold">Дата и время</th>
                        <th className="text-left px-4 py-3 text-eco-600 font-semibold">Клиент</th>
                        <th className="text-left px-4 py-3 text-eco-600 font-semibold">Телефон</th>
                        <th className="text-left px-4 py-3 text-eco-600 font-semibold">Сообщение</th>
                        <th className="text-center px-4 py-3 text-eco-600 font-semibold">Позвонили?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(req => (
                        <tr key={req.id} className={`border-b border-eco-50 hover:bg-eco-50 transition-colors ${req.is_called ? 'opacity-50' : ''}`}>
                          <td className="px-4 py-3 text-eco-500 text-xs whitespace-nowrap">{formatDate(req.created_at)}</td>
                          <td className="px-4 py-3 font-medium text-eco-800">{req.name}</td>
                          <td className="px-4 py-3">
                            <a href={`tel:${req.phone}`} className="text-eco-700 hover:text-eco-900 font-medium">{req.phone}</a>
                          </td>
                          <td className="px-4 py-3 text-eco-600 max-w-xs">
                            {req.message ? <span className="line-clamp-2">{req.message}</span> : <span className="text-eco-300 italic">Без сообщения</span>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleCalled(req)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                req.is_called ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              <Icon name={req.is_called ? 'CheckCircle' : 'Phone'} size={13} />
                              {req.is_called ? 'Позвонили' : 'Позвонить'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <>
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-eco-800">Статистика</h1>
              <p className="text-eco-500 mt-1">Сводные данные по заказам</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-16 text-center">
                <div className="text-5xl mb-4">📊</div>
                <p className="font-medium text-eco-600 text-lg">Данных пока нет</p>
                <p className="text-eco-400 text-sm mt-2">Статистика появится после первых заказов</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Всего заказов', value: orders.length, color: 'bg-eco-100 text-eco-700', icon: '📦' },
                    { label: 'Выручка (руб.)', value: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0).toLocaleString('ru-RU') + ' ₽', color: 'bg-green-100 text-green-700', icon: '💰' },
                    { label: 'Новых', value: orders.filter(o => o.status === 'new').length, color: 'bg-blue-100 text-blue-700', icon: '🆕' },
                    { label: 'Доставлено', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-amber-100 text-amber-700', icon: '✅' },
                  ].map(s => (
                    <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="font-display text-2xl font-bold">{s.value}</div>
                      <div className="text-xs mt-1 opacity-75">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-6">
                  <h3 className="font-semibold text-eco-800 mb-4">Распределение по статусам</h3>
                  <div className="space-y-3">
                    {(['new','confirmed','delivered','cancelled'] as OrderStatus[]).map(s => {
                      const count = orders.filter(o => o.status === s).length;
                      const pct = orders.length ? Math.round(count / orders.length * 100) : 0;
                      return (
                        <div key={s}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-eco-700">{statusLabel[s]}</span>
                            <span className="font-medium text-eco-800">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-eco-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${s==='new'?'bg-blue-400':s==='confirmed'?'bg-amber-400':s==='delivered'?'bg-green-500':'bg-red-400'}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── EMPLOYEES TAB ── */}
        {tab === 'employees' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-eco-800">Сотрудники</h1>
                <p className="text-eco-500 mt-1">Логины и пароли сотрудников системы</p>
              </div>
              <button
                onClick={() => setShowEmpForm(v => !v)}
                className="flex items-center gap-2 bg-eco-700 text-white px-5 py-2.5 rounded-xl hover:bg-eco-800 transition-colors text-sm font-medium"
              >
                <Icon name="UserPlus" size={16} />
                Добавить сотрудника
              </button>
            </div>

            {showEmpForm && (
              <div className="bg-white rounded-2xl border border-eco-200 shadow-sm p-6 mb-6 space-y-4">
                <h3 className="font-semibold text-eco-800">Новый сотрудник</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Имя', placeholder: 'Иван Иванов' },
                    { key: 'role', label: 'Должность', placeholder: 'Менеджер' },
                    { key: 'login', label: 'Логин', placeholder: 'ivan.ivanov' },
                    { key: 'password', label: 'Пароль', placeholder: '••••••••' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-eco-700 text-sm font-medium block mb-1">{f.label}</label>
                      <input
                        type={f.key === 'password' ? 'text' : 'text'}
                        placeholder={f.placeholder}
                        value={empForm[f.key as keyof typeof empForm]}
                        onChange={e => setEmpForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full border border-eco-200 rounded-xl px-3 py-2.5 text-sm text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={addEmployee} className="btn-primary px-6 py-2 text-sm">Добавить</button>
                  <button onClick={() => setShowEmpForm(false)} className="btn-secondary px-6 py-2 text-sm">Отмена</button>
                </div>
              </div>
            )}

            {employees.length === 0 ? (
              <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-16 text-center">
                <div className="text-5xl mb-4">👥</div>
                <p className="font-medium text-eco-600">Сотрудников пока нет</p>
                <p className="text-eco-400 text-sm mt-2">Нажмите «Добавить сотрудника» чтобы создать первую запись</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-eco-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-eco-50 border-b border-eco-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-eco-600 font-semibold">Имя</th>
                      <th className="text-left px-5 py-3 text-eco-600 font-semibold">Должность</th>
                      <th className="text-left px-5 py-3 text-eco-600 font-semibold">Логин</th>
                      <th className="text-left px-5 py-3 text-eco-600 font-semibold">Пароль</th>
                      <th className="text-center px-5 py-3 text-eco-600 font-semibold">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id} className="border-b border-eco-50 hover:bg-eco-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-eco-800">{emp.name}</td>
                        <td className="px-5 py-3 text-eco-600">{emp.role || '—'}</td>
                        <td className="px-5 py-3 font-mono text-eco-700">{emp.login}</td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => setShowPassId(showPassId === emp.id ? null : emp.id)}
                            className="flex items-center gap-1.5 text-xs text-eco-500 hover:text-eco-800 transition-colors"
                          >
                            <Icon name={showPassId === emp.id ? 'EyeOff' : 'Eye'} size={14} />
                            {showPassId === emp.id ? emp.password : '••••••••'}
                          </button>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => removeEmployee(emp.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Удалить"
                          >
                            <Icon name="Trash2" size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}