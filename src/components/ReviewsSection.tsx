import { useState } from 'react';
import Icon from '@/components/ui/icon';

const reviews = [
  {
    id: 1,
    name: 'Сергей Воронин',
    city: 'Москва',
    rating: 5,
    date: 'Март 2026',
    text: 'Заказывал брус 150×150 для строительства бани. Качество отличное — ровный, без трещин. Доставили точно в срок, менеджер Дмитрий помог с расчётом количества. Буду заказывать ещё!',
    product: 'Брус сосновый 150×150',
    avatar: '👨‍🔧',
  },
  {
    id: 2,
    name: 'Елена Краснова',
    city: 'Санкт-Петербург',
    rating: 5,
    text: 'Брали террасную доску из лиственницы для летней веранды. Три года прошло — как новая. Никакого гниения, цвет сохранился. Всем рекомендую именно лиственницу от ЭкоДрев.',
    date: 'Январь 2026',
    product: 'Террасная доска лиственница',
    avatar: '👩‍🏡',
  },
  {
    id: 3,
    name: 'Антон Беляков',
    city: 'Нижний Новгород',
    rating: 5,
    text: 'Оптовый заказ на 30 кубов обрезной доски. Сортировка аккуратная, упаковка хорошая. Цена ниже, чем у местных поставщиков, даже с учётом доставки. Работаем постоянно!',
    date: 'Февраль 2026',
    product: 'Доска обрезная (оптом)',
    avatar: '👨‍💼',
  },
  {
    id: 4,
    name: 'Ирина Соколова',
    city: 'Москва',
    rating: 4,
    text: 'Заказала вагонку для отделки дачи. Качество хорошее, дерево сухое. Единственное — доставка немного задержалась на 2 дня. Но менеджер предупредил заранее. В целом довольна.',
    date: 'Апрель 2026',
    product: 'Вагонка сосновая',
    avatar: '👩‍🎨',
  },
  {
    id: 5,
    name: 'Николай Фёдоров',
    city: 'Санкт-Петербург',
    rating: 5,
    text: 'Строю дом из бруса. ЭкоДрев — лучший поставщик из тех, что я нашёл. Геометрия точная, влажность в норме. Калькулятор на сайте очень помог с расчётом — сэкономил время и деньги.',
    date: 'Март 2026',
    product: 'Брус сосновый (крупный заказ)',
    avatar: '👷',
  },
  {
    id: 6,
    name: 'Анастасия Миронова',
    city: 'Нижний Новгород',
    rating: 5,
    text: 'Первый раз заказывала через интернет такой крупный стройматериал — переживала. Но всё прошло гладко. Отзывчивые менеджеры, быстрый ответ, качественная продукция. Спасибо!',
    date: 'Май 2026',
    product: 'Доска + брус для беседки',
    avatar: '👩‍💻',
  },
];

export default function ReviewsSection() {
  const [visibleCount, setVisibleCount] = useState(4);

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section id="reviews" className="py-20 bg-eco-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white border border-eco-200 rounded-full px-4 py-2 text-eco-700 text-sm font-medium mb-4">
            ⭐ Отзывы клиентов
          </div>
          <h2 className="section-title mb-4">Что говорят о нас</h2>

          {/* Rating summary */}
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl border border-eco-100 shadow-sm px-6 py-4 mt-2">
            <div className="text-center">
              <div className="font-display text-4xl font-bold text-eco-700">{avgRating}</div>
              <div className="flex gap-1 justify-center mt-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-eco-200" />
            <div className="text-left">
              <div className="text-eco-800 font-semibold">{reviews.length} отзывов</div>
              <div className="text-eco-500 text-sm">от реальных покупателей</div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.slice(0, visibleCount).map(review => (
            <div key={review.id} className="card-eco p-6 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-eco-100 rounded-2xl flex items-center justify-center text-2xl">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-eco-800">{review.name}</div>
                    <div className="text-eco-500 text-sm flex items-center gap-1">
                      <Icon name="MapPin" size={12} />
                      {review.city}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`text-base ${i <= review.rating ? 'text-yellow-400' : 'text-eco-200'}`}>★</span>
                    ))}
                  </div>
                  <div className="text-eco-400 text-xs mt-1">{review.date}</div>
                </div>
              </div>

              {/* Text */}
              <p className="text-eco-700 text-sm leading-relaxed flex-1">"{review.text}"</p>

              {/* Product tag */}
              <div className="inline-flex items-center gap-1.5 bg-eco-50 border border-eco-200 rounded-lg px-3 py-1.5 text-eco-600 text-xs w-fit">
                <span>🪵</span>
                {review.product}
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {visibleCount < reviews.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount(prev => prev + 2)}
              className="btn-secondary px-8 py-3"
            >
              Показать ещё отзывы
            </button>
          </div>
        )}
      </div>
    </section>
  );
}