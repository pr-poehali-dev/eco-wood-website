import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

function addToSharedCart(item: { id: string; name: string; size: string; price: number; quantity: number }) {
  const stored = localStorage.getItem('ekodrev_cart');
  const cart = stored ? JSON.parse(stored) : [];
  const idx = cart.findIndex((i: typeof item) => i.id === item.id);
  if (idx >= 0) cart[idx].quantity += item.quantity;
  else cart.push(item);
  localStorage.setItem('ekodrev_cart', JSON.stringify(cart));
}

const projects = [
  {
    id: 1,
    title: 'Деревянная беседка',
    emoji: '🏡',
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/4feeaa04-ef6b-4ca8-8b70-d6b64d9d71d3.jpg',
    description: 'Классическая летняя беседка с крышей.',
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
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/c40dc110-586c-443a-9bbc-a1254a80e214.jpg',
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
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/ef20e40e-7777-484a-9311-64086477f0c6.jpg',
    description: 'Деревянный штакетник, высота 1,5 м.',
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
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/bea76511-ae84-4634-86e4-c8280ec1fb64.jpg',
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
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/1963bea3-aae9-4e6c-ae15-b3fe12684776.jpg',
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
    image: 'https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/48604db6-8899-4d88-bd56-3dd3238e24e1.jpg',
    description: 'Классический дачный туалет-домик 1×1,2 м.',
    materials: [
      { name: 'Брус 50×50 (каркас)', qty: '6 шт по 2,5 м', diameter: '50×50 мм' },
      { name: 'Вагонка сосновая (обшивка)', qty: '12 м²', diameter: '16×96 мм' },
      { name: 'Доска пола 25×120', qty: '4 шт', diameter: '25×120 мм' },
    ],
    tip: 'Обработайте все элементы антисептиком в 2 слоя — срок службы увеличится в 3 раза.',
  },
];

type BuildType = 'gazebo' | 'bath' | 'terrace' | 'fence';

interface BuildConfig {
  label: string;
  emoji: string;
  fields: { key: string; label: string; unit: string; min: number; max: number; step: number; default: number }[];
  calc: (vals: Record<string, number>) => {
    items: { name: string; qty: string; price: number }[];
    total: number;
  };
}

const PRICE_PER_M3_BEAM = 14500;
const PRICE_PER_M2_DECK = 480;
const PRICE_PER_M2_LINING = 115;
const PRICE_PER_PIECE_STAKE = 45;

const buildConfigs: Record<BuildType, BuildConfig> = {
  gazebo: {
    label: 'Беседка',
    emoji: '🏡',
    fields: [
      { key: 'width', label: 'Ширина', unit: 'м', min: 2, max: 8, step: 0.5, default: 3 },
      { key: 'length', label: 'Длина', unit: 'м', min: 2, max: 8, step: 0.5, default: 3 },
      { key: 'height', label: 'Высота стен', unit: 'м', min: 2, max: 3.5, step: 0.1, default: 2.5 },
    ],
    calc: (v) => {
      const area = v.width * v.length;
      const perimeter = 2 * (v.width + v.length);
      const beamVolume = Math.ceil(perimeter * v.height * 0.01 * 0.01 * 4) / 100;
      const floorArea = area;
      const roofArea = area * 1.2;
      const beamCost = Math.ceil(beamVolume * PRICE_PER_M3_BEAM);
      const floorCost = Math.ceil(floorArea * PRICE_PER_M2_DECK);
      const roofCost = Math.ceil(roofArea * 350);
      return {
        items: [
          { name: 'Брус 100×100 (стойки, балки)', qty: `${beamVolume.toFixed(2)} м³`, price: beamCost },
          { name: 'Террасная доска (пол)', qty: `${floorArea.toFixed(1)} м²`, price: floorCost },
          { name: 'Доска обрезная (кровля)', qty: `${roofArea.toFixed(1)} м²`, price: roofCost },
        ],
        total: beamCost + floorCost + roofCost,
      };
    },
  },
  bath: {
    label: 'Баня',
    emoji: '🔥',
    fields: [
      { key: 'width', label: 'Ширина', unit: 'м', min: 3, max: 8, step: 0.5, default: 4 },
      { key: 'length', label: 'Длина', unit: 'м', min: 3, max: 10, step: 0.5, default: 6 },
      { key: 'height', label: 'Высота стен', unit: 'м', min: 2, max: 3, step: 0.1, default: 2.4 },
    ],
    calc: (v) => {
      const wallArea = 2 * (v.width + v.length) * v.height;
      const beamVolume = parseFloat((wallArea * 0.15 * 0.15).toFixed(2));
      const floorArea = v.width * v.length;
      const liningArea = wallArea * 0.4;
      const beamCost = Math.ceil(beamVolume * PRICE_PER_M3_BEAM);
      const floorCost = Math.ceil(floorArea * 420);
      const liningCost = Math.ceil(liningArea * PRICE_PER_M2_LINING);
      return {
        items: [
          { name: 'Брус 150×150 (сруб)', qty: `${beamVolume} м³`, price: beamCost },
          { name: 'Доска пола 35×120', qty: `${floorArea.toFixed(1)} м²`, price: floorCost },
          { name: 'Вагонка осиновая (парилка)', qty: `${liningArea.toFixed(1)} м²`, price: liningCost },
        ],
        total: beamCost + floorCost + liningCost,
      };
    },
  },
  terrace: {
    label: 'Терраса',
    emoji: '🌞',
    fields: [
      { key: 'width', label: 'Ширина', unit: 'м', min: 2, max: 10, step: 0.5, default: 4 },
      { key: 'length', label: 'Длина', unit: 'м', min: 2, max: 10, step: 0.5, default: 3 },
    ],
    calc: (v) => {
      const area = v.width * v.length;
      const deckCost = Math.ceil(area * PRICE_PER_M2_DECK);
      const lagCount = Math.ceil(v.length / 0.6) + 1;
      const lagCost = Math.ceil(lagCount * v.width * 890 / 6);
      const railCost = Math.ceil((2 * (v.width + v.length)) * 280);
      return {
        items: [
          { name: 'Террасная доска лиственница', qty: `${area.toFixed(1)} м²`, price: deckCost },
          { name: 'Брус 150×150 (лаги)', qty: `${lagCount} шт`, price: lagCost },
          { name: 'Перила и балясины', qty: `${(2 * (v.width + v.length)).toFixed(1)} п.м.`, price: railCost },
        ],
        total: deckCost + lagCost + railCost,
      };
    },
  },
  fence: {
    label: 'Забор',
    emoji: '🌿',
    fields: [
      { key: 'length', label: 'Длина забора', unit: 'м', min: 5, max: 200, step: 1, default: 20 },
      { key: 'height', label: 'Высота', unit: 'м', min: 1, max: 2.5, step: 0.1, default: 1.5 },
    ],
    calc: (v) => {
      const postCount = Math.ceil(v.length / 2) + 1;
      const stakesCount = Math.ceil(v.length / 0.12);
      const railCount = Math.ceil(v.length / 2) * 2;
      const postCost = postCount * 420;
      const stakeCost = stakesCount * PRICE_PER_PIECE_STAKE;
      const railCost = railCount * 95;
      return {
        items: [
          { name: 'Брус 100×100 (столбы)', qty: `${postCount} шт`, price: postCost },
          { name: 'Штакетник 20×100', qty: `${stakesCount} шт`, price: stakeCost },
          { name: 'Доска 25×100 (прогоны)', qty: `${railCount} шт`, price: railCost },
        ],
        total: postCost + stakeCost + railCost,
      };
    },
  },
};

export default function Diy() {
  const navigate = useNavigate();
  const [buildType, setBuildType] = useState<BuildType>('gazebo');
  const [values, setValues] = useState<Record<string, number>>({
    width: 3, length: 3, height: 2.5,
  });
  const [reserve, setReserve] = useState<5 | 10 | 15 | 0>(0);
  const [addedCalc, setAddedCalc] = useState(false);

  const config = buildConfigs[buildType];
  const baseResult = config.calc(values);
  const reserveMultiplier = 1 + reserve / 100;
  const result = {
    items: baseResult.items.map(i => ({ ...i, price: Math.round(i.price * reserveMultiplier) })),
    total: Math.round(baseResult.total * reserveMultiplier),
  };

  const handleTypeChange = (type: BuildType) => {
    setBuildType(type);
    const defaults: Record<string, number> = {};
    buildConfigs[type].fields.forEach(f => { defaults[f.key] = f.default; });
    setValues(defaults);
  };

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

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-4 py-2 text-amber-800 text-sm font-medium mb-4">
            🪵 Проекты из дерева
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-eco-900 mb-4">
            Своими Руками!
          </h1>
          <p className="text-eco-600 text-lg max-w-2xl mx-auto">
            Популярные проекты из дерева с точным расчётом материалов и стоимости.
          </p>
        </div>

        {/* CALCULATOR */}
        <div className="bg-white rounded-3xl border border-amber-200 shadow-md p-6 md:p-8 mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Icon name="Calculator" size={20} className="text-amber-700" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-eco-800">Калькулятор стройки</h2>
              <p className="text-eco-500 text-sm">Укажите размеры — мы подсчитаем материалы и цену</p>
            </div>
          </div>

          {/* Build type selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(buildConfigs) as BuildType[]).map(type => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  buildType === type
                    ? 'bg-eco-700 text-white shadow-sm'
                    : 'bg-eco-50 text-eco-700 border border-eco-200 hover:border-eco-400'
                }`}
              >
                <span>{buildConfigs[type].emoji}</span>
                {buildConfigs[type].label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div>
              <h3 className="font-medium text-eco-700 mb-4">Размеры постройки</h3>
              <div className="space-y-5">
                {config.fields.map(field => (
                  <div key={field.key}>
                    <div className="flex justify-between mb-2">
                      <label className="text-eco-700 text-sm font-medium">{field.label}</label>
                      <span className="text-eco-800 font-bold text-sm">
                        {values[field.key] ?? field.default} {field.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={values[field.key] ?? field.default}
                      onChange={e => setValues(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) }))}
                      className="w-full accent-eco-600 h-2 rounded-full"
                    />
                    <div className="flex justify-between text-xs text-eco-400 mt-1">
                      <span>{field.min} {field.unit}</span>
                      <span>{field.max} {field.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Result */}
            <div>
              <h3 className="font-medium text-eco-700 mb-4">Необходимые материалы</h3>
              <div className="space-y-3 mb-6">
                {result.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 bg-eco-50 rounded-xl">
                    <div>
                      <div className="text-eco-800 text-sm font-medium">{item.name}</div>
                      <div className="text-eco-500 text-xs">{item.qty}</div>
                    </div>
                    <div className="font-semibold text-eco-700 text-sm shrink-0">
                      {item.price.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                ))}
              </div>

              {/* Непредвиденные расходы */}
              <div>
                <div className="text-eco-700 text-sm font-semibold mb-2">Запас на непредвиденные расходы:</div>
                <div className="flex gap-2">
                  {([0, 5, 10, 15] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setReserve(v)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        reserve === v
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                          : 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      {v === 0 ? 'Без запаса' : `+${v}%`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-eco-700 text-white rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-eco-200 text-sm">Итоговая стоимость материалов</div>
                    <div className="font-display text-3xl font-bold mt-1">
                      {result.total.toLocaleString('ru-RU')} ₽
                    </div>
                    {reserve > 0 && (
                      <div className="text-eco-300 text-xs mt-1">включая запас +{reserve}%</div>
                    )}
                  </div>
                  <div className="text-5xl opacity-30">{config.emoji}</div>
                </div>
                <button
                  onClick={() => {
                    result.items.forEach((item, i) => {
                      addToSharedCart({
                        id: `diy-${buildType}-${i}`,
                        name: item.name,
                        size: item.qty,
                        price: item.price,
                        quantity: 1,
                      });
                    });
                    setAddedCalc(true);
                    setTimeout(() => setAddedCalc(false), 2000);
                  }}
                  className={`mt-4 w-full font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 ${
                    addedCalc ? 'bg-green-400 text-white' : 'bg-white text-eco-700 hover:bg-eco-50'
                  }`}
                >
                  <Icon name={addedCalc ? 'Check' : 'ShoppingCart'} size={16} />
                  {addedCalc ? 'Добавлено в корзину!' : 'Добавить в корзину'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-eco-800 mb-2">Готовые проекты</h2>
          <p className="text-eco-500 text-sm">Нажмите на проект, чтобы увидеть список материалов</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-3xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Project image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-2xl">{project.emoji}</span>
                  <h3 className="font-display text-lg font-bold text-white">{project.title}</h3>
                </div>
              </div>

              {/* Card content */}
              <div className="px-5 pt-4 pb-2">
                <p className="text-eco-600 text-sm mb-4">{project.description}</p>
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
              <div className="px-5 pb-5 pt-3">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                  <span className="text-amber-500 shrink-0 mt-0.5">💡</span>
                  <p className="text-amber-800 text-xs leading-relaxed">{project.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-white rounded-3xl border border-eco-100 shadow-sm px-8 py-10">
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
      </div>
    </div>
  );
}