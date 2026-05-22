import { useState } from 'react';
import Icon from '@/components/ui/icon';

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
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', comment: '' });
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setForm({ name: '', phone: '', email: '', address: '', comment: '' });
    setAgreed(false);
    onClose();
    if (step === 'success') onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
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
            {/* Order summary */}
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

            {/* Form fields */}
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
                <span className="ml-1 text-eco-400 font-normal text-xs">(пришлём счёт на оплату)</span>
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

            <button
              type="submit"
              disabled={!agreed}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="Package" size={18} />
              Подтвердить заказ
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