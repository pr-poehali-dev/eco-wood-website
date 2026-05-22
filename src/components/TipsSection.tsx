import { useState } from 'react';
import Reveal from '@/components/Reveal';

const tips = [
  {
    id: 1,
    category: 'Покраска',
    icon: '🎨',
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'bg-blue-100 text-blue-800',
    title: 'Как выбрать краску для дерева',
    preview: 'Правильная краска продлит жизнь вашему изделию на годы.',
    content: `**Для наружных работ** выбирайте акриловые или алкидные краски — они устойчивы к влаге, ультрафиолету и перепадам температур.

**Для внутренних работ** подойдут водоэмульсионные и акриловые краски без запаха. Они быстро сохнут и легко моются.

**Советы по нанесению:**
• Перед покраской обязательно зашлифуйте поверхность (наждачка P120–P180)
• Нанесите грунтовку для дерева — это улучшит адгезию и сэкономит краску
• Наносите в 2–3 тонких слоя, давая каждому просохнуть 4–6 часов
• Красьте вдоль волокна, а не поперёк

**Расход:** в среднем 100–150 мл на 1 м² в один слой.`,
  },
  {
    id: 2,
    category: 'Защита',
    icon: '🛡️',
    color: 'bg-green-50 border-green-200',
    headerColor: 'bg-green-100 text-green-800',
    title: 'Как защитить древесину от влаги',
    preview: 'Пропитка и обработка — ключ к долговечности любой конструкции.',
    content: `**Антисептические пропитки** — первый шаг для любой деревянной конструкции на улице. Они защищают от грибка, плесени и жуков.

**Масла и воски** идеальны для террас и полов. Проникают глубоко в волокно, не образуют плёнки, дерево «дышит».

**Лаки** создают защитную плёнку на поверхности. Яхтный лак — самый стойкий вариант для наружных конструкций.

**Порядок обработки:**
1. Пропитка антисептиком (2 слоя с интервалом 24 ч)
2. Грунтовка (при необходимости)
3. Финишное покрытие (масло, лак или краска)

Обновляйте покрытие каждые 2–3 года для сохранения защитных свойств.`,
  },
  {
    id: 3,
    category: 'Хранение',
    icon: '📦',
    color: 'bg-wood-50 border-wood-200',
    headerColor: 'bg-wood-100 text-wood-800',
    title: 'Правила хранения пиломатериалов',
    preview: 'Неправильное хранение может испортить даже качественный брус.',
    content: `**Основные правила:**
• Храните древесину в сухом, хорошо проветриваемом месте
• Укладывайте на поддоны или подкладки, не на землю
• Накрывайте сверху от осадков, но оставляйте боковую вентиляцию
• Прокладывайте между рядами рейки 20–30 мм для циркуляции воздуха

**Что нельзя делать:**
• Хранить в герметичной упаковке или под плёнкой без вентиляции
• Класть на землю или бетон без подложки
• Хранить рядом с источниками тепла или влаги

**Срок хранения:** сухой пиломатериал при правильных условиях не теряет качества до 5 лет.`,
  },
  {
    id: 4,
    category: 'Выбор породы',
    icon: '🌳',
    color: 'bg-eco-50 border-eco-200',
    headerColor: 'bg-eco-100 text-eco-800',
    title: 'Какую породу дерева выбрать?',
    preview: 'Правильный выбор породы — залог долговечности вашего проекта.',
    content: `**Сосна** — универсальный выбор. Лёгкая, доступная, хорошо обрабатывается. Подходит для строительства, полов, мебели. Требует обязательной защитной обработки.

**Ель** — чуть мягче сосны, меньше смолы. Хороша для внутренних работ, кровли, декоративной отделки.

**Лиственница** — самая прочная и стойкая к влаге из хвойных. Идеальна для бань, террас, свайных конструкций. Служит 50+ лет без гниения.

**Кедр** — ароматный, красивый. Применяется для отделки бань и саун. Выделяет фитонциды — полезно для здоровья.

**Совет:** для несущих конструкций выбирайте сосну или лиственницу, для отделки — ель, вагонку или кедр.`,
  },
  {
    id: 5,
    category: 'Инструменты',
    icon: '🔨',
    color: 'bg-orange-50 border-orange-200',
    headerColor: 'bg-orange-100 text-orange-800',
    title: 'Чем пилить и обрабатывать древесину',
    preview: 'Правильные инструменты сделают работу чище и быстрее.',
    content: `**Для распила:**
• Циркулярная пила — для ровных прямых резов
• Лобзик — для фигурных резов
• Торцовочная пила — для точных угловых срезов

**Для обработки поверхности:**
• Шлифмашина (эксцентриковая) — для больших плоскостей
• Ручной рубанок или рейсмус — для точной выборки
• Стамеска — для пазов и шипов

**Крепёж:**
• Оцинкованные или нержавеющие саморезы — для уличных конструкций
• Конструкционные шурупы — для несущих соединений
• Металлические уголки и пластины — для усиления узлов

Всегда предварительно засверливайте отверстия в твёрдых породах, чтобы избежать раскола.`,
  },
  {
    id: 6,
    category: 'Сушка',
    icon: '☀️',
    color: 'bg-yellow-50 border-yellow-200',
    headerColor: 'bg-yellow-100 text-yellow-800',
    title: 'Влажность древесины: что важно знать',
    preview: 'Влажность — ключевой параметр любого пиломатериала.',
    content: `**Нормы влажности по назначению:**
• Строительный брус: 20–22%
• Половая доска: 8–12%
• Мебельный щит: 6–8%
• Вагонка: 12–15%

**Как проверить:** используйте влагомер — прибор стоит от 1000 ₽ и всегда окупится.

**Если древесина сырая:**
• Не используйте для чистовой отделки — поведёт и потрескается
• Дайте вылежаться под навесом 3–6 месяцев
• Камерная сушка — быстрее (2–4 недели), но дороже

**Почему это важно:** высохшая древесина усыхает до 10% по поперечнику. Если уложить сырой пол — будут щели. Если сделать мебель — переклинит дверцы.

Вся наша продукция проходит контроль влажности перед отгрузкой.`,
  },
];

export default function TipsSection() {
  const [openTip, setOpenTip] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categories = [...new Set(tips.map(t => t.category))];
  const filtered = filterCategory ? tips.filter(t => t.category === filterCategory) : tips;

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-eco-800 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={i} className="text-eco-700 text-sm">
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          </p>
        );
      }
      if (line.startsWith('•')) {
        return <li key={i} className="text-eco-700 text-sm ml-4 list-disc">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\./)) {
        return <li key={i} className="text-eco-700 text-sm ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
      }
      if (line === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-eco-700 text-sm leading-relaxed">{line}</p>;
    });
  };

  return (
    <section id="tips" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-eco-100 rounded-full px-4 py-2 text-eco-700 text-sm font-medium mb-4">
            💡 Полезные советы
          </div>
          <h2 className="section-title mb-4">Всё о работе с деревом</h2>
          <p className="text-eco-600 text-lg max-w-2xl mx-auto">
            Советы от наших мастеров — как выбрать, хранить, обрабатывать и красить древесину.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              !filterCategory ? 'bg-eco-600 text-white border-eco-600' : 'bg-eco-50 text-eco-600 border-eco-200 hover:border-eco-400'
            }`}
          >
            Все темы
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                filterCategory === cat ? 'bg-eco-600 text-white border-eco-600' : 'bg-eco-50 text-eco-600 border-eco-200 hover:border-eco-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tips grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tip, idx) => (
            <Reveal key={tip.id} delay={idx * 80}>
            <div
              className={`border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md ${tip.color} ${
                openTip === tip.id ? 'shadow-md' : ''
              }`}
              onClick={() => setOpenTip(openTip === tip.id ? null : tip.id)}
            >
              {/* Header */}
              <div className={`px-5 py-4 flex items-center gap-3 ${tip.headerColor}`}>
                <span className="text-2xl">{tip.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-medium opacity-70 uppercase tracking-wide">{tip.category}</div>
                  <h3 className="font-display text-lg font-semibold leading-tight">{tip.title}</h3>
                </div>
                <div className={`text-xl transition-transform duration-200 ${openTip === tip.id ? 'rotate-180' : ''}`}>
                  ↓
                </div>
              </div>

              {/* Preview always visible */}
              {openTip !== tip.id && (
                <div className="px-5 py-4">
                  <p className="text-eco-600 text-sm">{tip.preview}</p>
                  <div className="text-eco-500 text-xs mt-3 flex items-center gap-1">
                    Нажмите, чтобы раскрыть →
                  </div>
                </div>
              )}

              {/* Expanded content */}
              {openTip === tip.id && (
                <div className="px-5 py-4 space-y-1">
                  {formatContent(tip.content)}
                </div>
              )}
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}