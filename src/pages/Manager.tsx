import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const GET_REQUESTS_URL = 'https://functions.poehali.dev/a53097dc-0bcc-4e6f-be7f-763852152b16';

interface Order {
  id: string;
  date: string;
  client: string;
  phone: string;
  city: string;
  product: string;
  qty: number;
  unit: string;
  total: number;
  status: 'new' | 'confirmed' | 'delivered' | 'cancelled';
}

interface ContactRequest {
  id: number;
  name: string;
  phone: string;
  message: string;
  created_at: string;
  is_called: boolean;
}

const initialOrders: Order[] = [
  { id: 'ЭД-001', date: '2026-05-20', client: 'Сергей Воронин', phone: '+7 (901) 234-56-78', city: 'Москва', product: 'Брус сосновый 150×150', qty: 5, unit: 'м³', total: 72500, status: 'delivered' },
  { id: 'ЭД-002', date: '2026-05-21', client: 'Елена Краснова', phone: '+7 (911) 345-67-89', city: 'Санкт-Петербург', product: 'Террасная доска лиственница', qty: 20, unit: 'м²', total: 360000, status: 'confirmed' },
  { id: 'ЭД-003', date: '2026-05-21', client: 'Антон Беляков', phone: '+7 (921) 456-78-90', city: 'Нижний Новгород', product: 'Доска обрезная 25×150', qty: 30, unit: 'м³', total: 255000, status: 'new' },
  { id: 'ЭД-004', date: '2026-05-22', client: 'Ирина Соколова', phone: '+7 (931) 567-89-01', city: 'Москва', product: 'Вагонка сосновая', qty: 15, unit: 'м²', total: 102000, status: 'new' },
  { id: 'ЭД-005', date: '2026-05-22', client: 'Николай Фёдоров', phone: '+7 (941) 678-90-12', city: 'Санкт-Петербург', product: 'Брус сосновый 100×100', qty: 10, unit: 'м³', total: 120000, status: 'confirmed' },
  { id: 'ЭД-006', date: '2026-05-22', client: 'Анастасия Миронова', phone: '+7 (951) 789-01-23', city: 'Нижний Новгород', product: 'Блок-хаус сосна', qty: 25, unit: 'м²', total: 230000, status: 'new' },
];

const statusLabel: Record<Order['status'], string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const statusColor: Record<Order['status'], string> = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-amber-100 text-amber-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Manager() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'orders' | 'requests'>('orders');

  // Orders tab
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const totalSum = filtered.reduce((s, o) => s + o.total, 0);

  const updateStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const downloadCSV = () => {
    const header = 'ID,Дата,Клиент,Телефон,Город,Товар,Количество,Ед,Сумма,Статус\n';
    const rows = filtered.map(o =>
      `${o.id},${o.date},"${o.client}",${o.phone},"${o.city}","${o.product}",${o.qty},${o.unit},${o.total},${statusLabel[o.status]}`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ekodrev-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Requests tab
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
        <div className="flex gap-2 mb-8 border-b border-eco-200">
          <button
            onClick={() => setTab('orders')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === 'orders'
                ? 'border-eco-700 text-eco-800'
                : 'border-transparent text-eco-500 hover:text-eco-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon name="Package" size={16} />
              Заказы
            </span>
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === 'requests'
                ? 'border-eco-700 text-eco-800'
                : 'border-transparent text-eco-500 hover:text-eco-700'
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
        </div>

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-eco-800">Заказы</h1>
                <p className="text-eco-500 mt-1">Учёт и управление заказами клиентов</p>
              </div>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-eco-700 text-white px-5 py-2.5 rounded-xl hover:bg-eco-800 transition-colors text-sm font-medium"
              >
                <Icon name="Download" size={16} />
                Выгрузить CSV
              </button>
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
                    filter === s
                      ? 'bg-eco-700 text-white'
                      : 'bg-white border border-eco-200 text-eco-600 hover:bg-eco-50'
                  }`}
                >
                  {s === 'all' ? 'Все' : statusLabel[s]}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-eco-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-eco-50 border-b border-eco-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-eco-600 font-semibold">№</th>
                      <th className="text-left px-4 py-3 text-eco-600 font-semibold">Дата</th>
                      <th className="text-left px-4 py-3 text-eco-600 font-semibold">Клиент</th>
                      <th className="text-left px-4 py-3 text-eco-600 font-semibold">Город</th>
                      <th className="text-left px-4 py-3 text-eco-600 font-semibold">Товар</th>
                      <th className="text-right px-4 py-3 text-eco-600 font-semibold">Кол-во</th>
                      <th className="text-right px-4 py-3 text-eco-600 font-semibold">Сумма</th>
                      <th className="text-center px-4 py-3 text-eco-600 font-semibold">Статус</th>
                      <th className="text-center px-4 py-3 text-eco-600 font-semibold">Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(order => (
                      <tr key={order.id} className="border-b border-eco-50 hover:bg-eco-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-eco-500 text-xs">{order.id}</td>
                        <td className="px-4 py-3 text-eco-600">{order.date}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-eco-800">{order.client}</div>
                          <div className="text-eco-400 text-xs">{order.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-eco-600">{order.city}</td>
                        <td className="px-4 py-3 text-eco-700">{order.product}</td>
                        <td className="px-4 py-3 text-right text-eco-600">{order.qty} {order.unit}</td>
                        <td className="px-4 py-3 text-right font-semibold text-eco-800">{order.total.toLocaleString('ru-RU')} ₽</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${statusColor[order.status]}`}>
                            {statusLabel[order.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={order.status}
                            onChange={e => updateStatus(order.id, e.target.value as Order['status'])}
                            className="border border-eco-200 rounded-lg px-2 py-1 text-xs text-eco-700 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-white"
                          >
                            <option value="new">Новый</option>
                            <option value="confirmed">Подтверждён</option>
                            <option value="delivered">Доставлен</option>
                            <option value="cancelled">Отменён</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-eco-50 border-t border-eco-200">
                    <tr>
                      <td colSpan={6} className="px-4 py-3 text-right text-eco-600 font-semibold text-sm">
                        Итого по фильтру:
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-eco-800">
                        {totalSum.toLocaleString('ru-RU')} ₽
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}

        {/* REQUESTS TAB */}
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

            {/* Stats */}
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
                        <tr
                          key={req.id}
                          className={`border-b border-eco-50 hover:bg-eco-50 transition-colors ${req.is_called ? 'opacity-50' : ''}`}
                        >
                          <td className="px-4 py-3 text-eco-500 text-xs whitespace-nowrap">{formatDate(req.created_at)}</td>
                          <td className="px-4 py-3 font-medium text-eco-800">{req.name}</td>
                          <td className="px-4 py-3">
                            <a href={`tel:${req.phone}`} className="text-eco-700 hover:text-eco-900 font-medium">
                              {req.phone}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-eco-600 max-w-xs">
                            {req.message ? (
                              <span className="line-clamp-2">{req.message}</span>
                            ) : (
                              <span className="text-eco-300 italic">Без сообщения</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleCalled(req)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                req.is_called
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
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
      </div>
    </div>
  );
}
