import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function ContactsSection() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const contacts = [
    { icon: '📞', label: 'Телефон', value: '+7 (800) 123-45-67', sub: 'Бесплатно по России' },
    { icon: '📧', label: 'Email', value: 'info@ekodrev.ru', sub: 'Отвечаем за 2 часа' },
    { icon: '📍', label: 'Адрес', value: 'Арзамас, ул. Лесная, 12', sub: 'Пн–Пт 8:00–18:00' },
    { icon: '💬', label: 'WhatsApp', value: '+7 (900) 123-45-67', sub: 'Быстрая связь' },
  ];

  return (
    <section id="contacts" className="py-20 bg-eco-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white border border-eco-200 rounded-full px-4 py-2 text-eco-700 text-sm font-medium mb-4">
            📬 Контакты
          </div>
          <h2 className="section-title mb-4">Свяжитесь с нами</h2>
          <p className="text-eco-600 text-lg max-w-2xl mx-auto">
            Готовы ответить на любые вопросы и помочь с выбором. Оставьте заявку — перезвоним в течение часа.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {contacts.map(c => (
                <div key={c.label} className="bg-white rounded-2xl p-5 border border-eco-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="text-3xl">{c.icon}</div>
                  <div>
                    <div className="text-eco-500 text-xs font-medium uppercase tracking-wide">{c.label}</div>
                    <div className="font-semibold text-eco-800 mt-0.5">{c.value}</div>
                    <div className="text-eco-500 text-xs mt-0.5">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Working hours */}
            <div className="bg-eco-700 text-white rounded-2xl p-6">
              <h3 className="font-display text-xl font-semibold mb-4">Режим работы</h3>
              <div className="space-y-2">
                {[
                  { days: 'Понедельник – пятница', hours: '08:00 – 18:00' },
                  { days: 'Суббота', hours: '09:00 – 15:00' },
                  { days: 'Воскресенье', hours: 'Выходной' },
                ].map(row => (
                  <div key={row.days} className="flex justify-between items-center py-1 border-b border-eco-600 last:border-0">
                    <span className="text-eco-200 text-sm">{row.days}</span>
                    <span className="font-medium text-white text-sm">{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <a
              href="https://yandex.ru/maps/?pt=43.892200,55.359400&z=16&l=map"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-eco-100 rounded-2xl h-48 flex items-center justify-center border border-eco-200 cursor-pointer hover:border-eco-400 hover:bg-eco-200 transition-colors block"
            >
              <div className="text-center text-eco-500">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="text-sm font-medium">Арзамас, ул. Лесная, 12</div>
                <div className="text-xs mt-1 text-eco-400">Открыть на Яндекс.Картах →</div>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-8">
            {!sent ? (
              <>
                <h3 className="font-display text-2xl font-semibold text-eco-800 mb-2">Оставить заявку</h3>
                <p className="text-eco-500 text-sm mb-6">Менеджер свяжется с вами в течение 1 часа и поможет с выбором.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-eco-700 text-sm font-medium block mb-2">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      placeholder="Иван Иванов"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full border border-eco-200 rounded-xl px-4 py-3 text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 placeholder-eco-300"
                    />
                  </div>

                  <div>
                    <label className="text-eco-700 text-sm font-medium block mb-2">Телефон *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (___) ___-__-__"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full border border-eco-200 rounded-xl px-4 py-3 text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 placeholder-eco-300"
                    />
                  </div>

                  <div>
                    <label className="text-eco-700 text-sm font-medium block mb-2">Сообщение</label>
                    <textarea
                      rows={4}
                      placeholder="Опишите, что вам нужно: порода, размеры, количество..."
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full border border-eco-200 rounded-xl px-4 py-3 text-eco-800 focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50 placeholder-eco-300 resize-none"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
                    <Icon name="Send" size={18} />
                    Отправить заявку
                  </button>

                  <p className="text-eco-400 text-xs text-center">
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                  </p>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-6">
                <div className="w-20 h-20 bg-eco-100 rounded-3xl flex items-center justify-center text-4xl animate-scale-in">
                  ✅
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-eco-800 mb-2">Заявка отправлена!</h3>
                  <p className="text-eco-600 leading-relaxed">
                    Спасибо, {form.name}! Наш менеджер свяжется с вами по номеру <strong>{form.phone}</strong> в течение часа.
                  </p>
                </div>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', phone: '', message: '' }); }}
                  className="btn-secondary"
                >
                  Отправить ещё заявку
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}