import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SectionFrame from '@/components/SectionFrame';

const projects = [
  {
    id: 1,
    title: 'Деревянная беседка',
    emoji: '🏡',
    description: 'Классическая летняя беседка 3×3 м с крышей.',
    materials: [
      { name: 'Брус 100×100 (стойки и балки)', qty: '12 шт', diameter: '100×100 мм' },
      { name: 'Доска обрезная 25×150 (пол)', qty: '18 шт', diameter: '25×150 мм' },
      { name: 'Доска необрезная (кровля)', qty: '10 м²', diameter: '20–30 мм' },
    ],
    tip: 'Используйте лиственницу для пола — она не гниёт даже при постоянном контакте с влагой.',
  },
  {
    id: 2,
    title: 'Дровяной сарай',
    emoji: '🪓',
    description: 'Небольшой навес для хранения дров на сезон.',
    materials: [
      { name: 'Брус 50×50 (каркас)', qty: '8 шт по 3 м', diameter: '50×50 мм' },
      { name: 'Вагонка сосновая (стены)', qty: '20 м²', diameter: '16×96 мм' },
      { name: 'Доска 25×100 (настил)', qty: '6 шт по 3 м', diameter: '25×100 мм' },
    ],
    tip: 'Хватит одного погонного куба бруса на каркас. Обработайте антисептиком перед сборкой.',
  },
  {
    id: 3,
    title: 'Забор из досок',
    emoji: '🌿',
    description: 'Деревянный штакетник длиной 20 м, высота 1,5 м.',
    materials: [
      { name: 'Брус 100×100 (столбы)', qty: '11 шт', diameter: '100×100 мм' },
      { name: 'Брус 40×60 (прогоны)', qty: '22 шт по 2 м', diameter: '40×60 мм' },
      { name: 'Штакетник 20×100', qty: '200 шт', diameter: '20×100 мм' },
    ],
    tip: 'На 1 м забора высотой 1,5 м нужно около 10 штакетин с зазором 5 см.',
  },
  {
    id: 4,
    title: 'Баня из бруса 4×6 м',
    emoji: '🔥',
    description: 'Небольшая классическая баня — моечная + парилка + предбанник.',
    materials: [
      { name: 'Брус сосновый 150×150 (сруб)', qty: '15 м³', diameter: '150×150 мм' },
      { name: 'Вагонка осиновая (парилка)', qty: '25 м²', diameter: '16×88 мм' },
      { name: 'Доска пола 35×120', qty: '30 м²', diameter: '35×120 мм' },
    ],
    tip: 'Осина лучше сосны для парилки: не выделяет смолу и не обжигает при высоких температурах.',
  },
  {
    id: 5,
    title: 'Терраса к дому',
    emoji: '🌞',
    description: 'Открытая терраса 4×3 м, прикреплённая к стене дома.',
    materials: [
      { name: 'Брус 150×150 (лаги)', qty: '8 шт по 4 м', diameter: '150×150 мм' },
      { name: 'Террасная доска лиственница', qty: '12 м²', diameter: '28×140 мм' },
      { name: 'Перила балясины 40×40', qty: '30 шт', diameter: '40×40 мм' },
    ],
    tip: 'Террасную доску кладите с зазором 5–8 мм для стока воды и вентиляции.',
  },
  {
    id: 6,
    title: 'Дачный туалет',
    emoji: '🪵',
    description: 'Классический дачный туалет-домик 1×1,2 м.',
    materials: [
      { name: 'Брус 50×50 (каркас)', qty: '6 шт по 2,5 м', diameter: '50×50 мм' },
      { name: 'Вагонка сосновая (обшивка)', qty: '12 м²', diameter: '16×96 мм' },
      { name: 'Доска пола 25×120', qty: '4 шт', diameter: '25×120 мм' },
    ],
    tip: 'Обработайте все элементы антисептиком в 2 слоя — срок службы увеличится в 3 раза.',
  },
];

export default function Diy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-eco-700 hover:text-eco-900 transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="text-sm font-medium">На главную</span>
          </button>
          <div className="w-px h-6 bg-eco-200" />
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/bucket/959b4979-43a8-4629-b1a0-51a51b81c558.png"
              alt="ЭкоДрев"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display text-xl font-bold text-eco-800">ЭкоДрев</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Hero */}
        <SectionFrame>
        <div className="text-center mb-16 py-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-4 py-2 text-amber-800 text-sm font-medium mb-4">
            🪵 Проекты из дерева
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-eco-900 mb-4">
            Своими Руками
          </h1>
          <p className="text-eco-600 text-lg max-w-2xl mx-auto">
            Популярные проекты из дерева с точным расчётом материалов — количество, сечение и полезные советы мастера.
          </p>
        </div>
        </SectionFrame>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {projects.map(project => (
            <SectionFrame key={project.id}>
            <div
              className="bg-white rounded-3xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Card header */}
              <div className="bg-gradient-to-br from-amber-50 to-eco-50 px-6 py-5 border-b border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{project.emoji}</span>
                  <h2 className="font-display text-xl font-bold text-eco-800">{project.title}</h2>
                </div>
                <p className="text-eco-600 text-sm">{project.description}</p>
              </div>

              {/* Materials table */}
              <div className="px-6 py-4">
                <div className="text-xs font-semibold text-eco-500 uppercase tracking-wide mb-3">
                  Необходимые материалы
                </div>
                <div className="space-y-2">
                  {project.materials.map((mat, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 text-sm">
                      <span className="text-eco-700 flex-1">{mat.name}</span>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-eco-800">{mat.qty}</div>
                        <div className="text-eco-400 text-xs">{mat.diameter}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="px-6 pb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">💡</span>
                  <p className="text-amber-800 text-xs leading-relaxed">{project.tip}</p>
                </div>
              </div>
            </div>
            </SectionFrame>
          ))}
        </div>

        {/* CTA */}
        <SectionFrame>
        <div className="mt-16 text-center bg-white rounded-3xl border border-eco-100 shadow-sm px-8 py-10">
          <h2 className="font-display text-2xl font-bold text-eco-800 mb-3">
            Нашли подходящий проект?
          </h2>
          <p className="text-eco-500 mb-6">
            Перейдите в каталог — подберём нужный пиломатериал и рассчитаем стоимость
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary px-8 py-3"
          >
            Перейти в каталог
          </button>
        </div>
        </SectionFrame>
      </div>
    </div>
  );
}