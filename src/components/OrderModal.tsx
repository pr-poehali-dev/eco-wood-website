import { useState } from 'react';
import Icon from '@/components/ui/icon';

const ORDERS_API = 'https://functions.poehali.dev/97eb501c-3e4e-4500-9867-e0cd38ce1d6a';

interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface OrderModalProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderModal({ isOpen, items, onClose, onSuccess }: OrderModalProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', comment: '', payment: '' });
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const PAYMENT_OPTIONS = [
    'Безналичная (расчётный счёт)',
    'Оплата картой',
    'Наличный расчёт',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(ORDERS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          comment: form.comment,
          payment: form.payment,
          total,
          items: items.map(i => ({ name: i.name, size: i.size, price: i.price, quantity: i.quantity })),
        }),
      });
      if (!res.ok) throw new Error('Ошибка сервера');
      setStep('success');
    } catch {
      setError('Не удалось отправить заказ. Позвоните нам напрямую.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setForm({ name: '', phone: '', email: '', address: '', comment: '', payment: '' });
    setAgreed(false);
    setError('');
    onClose();
    if (step === 'success') onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-eco-100">
          <div>
            <h2 className="font-display text-2xl font-semibold text-eco-800">Оформление заказа</h2>
            <p className="text-eco-500 text-sm">Сумма: {total.toLocaleString('ru-RU')} ₽</p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl bg-eco-50 hover:bg-eco-100 flex items-center justify-center transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="bg-eco-50 rounded-2xl border border-eco-100 p-4 space-y-2">
              <div className="text-eco-600 text-xs font-semibold uppercase tracking-wide mb-3">Состав заказа</div>
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-eco-700">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-eco-800">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                </div>
              ))}
              <div className="border-t border-eco-200 pt-2 mt-2 flex justify-between font-semibold text-eco-800">
                <span>Итого:</span>
                <span className="font-display text-lg">{total.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <div>
              <label className="text-eco-700 text-sm font-medium block mb-2">Ваше имя *</label>
              <input
                required
                type="text"
                placeholder="Иван Иванов"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full border border-eco-200 rounded-xl px-4 py-3 text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 placeholder-eco-300 text-sm"
              />
            </div>

            <div>
              <label className="text-eco-700 text-sm font-medium block mb-2">Телефон *</label>
              <input
                required
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full border border-eco-200 rounded-xl px-4 py-3 text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 placeholder-eco-300 text-sm"
              />
            </div>

            <div>
              <label className="text-eco-700 text-sm font-medium block mb-2">
                E-mail *
              </label>
              <input
                required
                type="email"
                placeholder="example@mail.ru"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full border border-eco-200 rounded-xl px-4 py-3 text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 placeholder-eco-300 text-sm"
              />
            </div>

            <div>
              <label className="text-eco-700 text-sm font-medium block mb-2">Адрес доставки</label>
              <input
                type="text"
                placeholder="Город, улица, дом"
                value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className="w-full border border-eco-200 rounded-xl px-4 py-3 text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 placeholder-eco-300 text-sm"
              />
            </div>

            <div>
              <label className="text-eco-700 text-sm font-medium block mb-2">Способ оплаты *</label>
              <div className="flex flex-col gap-2">
                {PAYMENT_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${form.payment === opt ? 'border-eco-600 bg-eco-600' : 'border-eco-300 group-hover:border-eco-500'}`}>
                      {form.payment === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <input type="radio" name="payment" value={opt} required className="sr-only"
                      checked={form.payment === opt}
                      onChange={() => setForm(p => ({ ...p, payment: opt }))}
                    />
                    <span className="text-eco-700 text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-eco-700 text-sm font-medium block mb-2">Комментарий</label>
              <textarea
                rows={3}
                placeholder="Пожелания по доставке, удобное время..."
                value={form.comment}
                onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                className="w-full border border-eco-200 rounded-xl px-4 py-3 text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 placeholder-eco-300 resize-none text-sm"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${agreed ? 'bg-eco-600 border-eco-600' : 'border-eco-300 group-hover:border-eco-500'}`}>
                {agreed && <Icon name="Check" size={12} className="text-white" />}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                required
              />
              <span className="text-eco-600 text-sm leading-relaxed">
                Я ознакомлен(а) и согласен(а) с{' '}
                <span className="text-eco-700 underline cursor-pointer hover:text-eco-900">
                  пользовательским соглашением
                </span>{' '}
                и политикой обработки персональных данных
              </span>
            </label>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={!agreed || loading}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Icon name="Loader2" size={18} className="animate-spin" />
              ) : (
                <Icon name="Package" size={18} />
              )}
              {loading ? 'Отправляем...' : 'Подтвердить заказ'}
            </button>

            <p className="text-eco-400 text-xs text-center">
              После отправки менеджер свяжется с вами для уточнения деталей и подтверждения заказа
            </p>
          </form>
        ) : (
          <div className="p-10 flex flex-col items-center text-center gap-6">
            <div className="w-24 h-24 bg-eco-100 rounded-3xl flex items-center justify-center text-5xl animate-scale-in">
              🎉
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-eco-800 mb-2">Заказ оформлен!</h3>
              <p className="text-eco-600 leading-relaxed">
                Спасибо, <strong>{form.name}</strong>! Ваш заказ на сумму <strong>{total.toLocaleString('ru-RU')} ₽</strong> принят.
              </p>
              <p className="text-eco-500 text-sm mt-2">
                Наш менеджер свяжется с вами по номеру <strong>{form.phone}</strong> в течение 30–60 минут для подтверждения заказа и уточнения деталей доставки.
              </p>
            </div>
            <button onClick={handleClose} className="btn-primary px-8">
              Отлично!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}