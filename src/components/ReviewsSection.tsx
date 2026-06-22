export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 bg-eco-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white border border-eco-200 rounded-full px-4 py-2 text-eco-700 text-sm font-medium mb-4">
            ⭐ Отзывы клиентов
          </div>
          <h2 className="section-title mb-4">Что говорят о нас</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
          <div className="w-24 h-24 bg-eco-100 rounded-3xl flex items-center justify-center text-5xl">⭐</div>
          <div>
            <h3 className="font-display text-2xl font-semibold text-eco-800 mb-2">Скоро появятся</h3>
            <p className="text-eco-500 text-lg max-w-md">Мы собираем отзывы наших клиентов — они появятся здесь совсем скоро.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
