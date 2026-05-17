import { useState } from 'react';
import Icon from '@/components/ui/icon';

const materials = [
  { id: 'pine', name: 'Сосна', pricePerCubic: 7500 },
  { id: 'spruce', name: 'Ель', pricePerCubic: 7200 },
  { id: 'larch', name: 'Лиственница', pricePerCubic: 12000 },
  { id: 'cedar', name: 'Кедр', pricePerCubic: 18000 },
];

const profiles = [
  { id: 'beam', name: 'Брус', coeff: 1.0 },
  { id: 'board', name: 'Доска обрезная', coeff: 0.9 },
  { id: 'lining', name: 'Вагонка', coeff: 1.15 },
  { id: 'deck', name: 'Террасная доска', coeff: 1.1 },
];

export default function CalculatorSection() {
  const [material, setMaterial] = useState(materials[0].id);
  const [profile, setProfile] = useState(profiles[0].id);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [length, setLength] = useState(6000);
  const [quantity, setQuantity] = useState(10);

  const selectedMaterial = materials.find(m => m.id === material)!;
  const selectedProfile = profiles.find(p => p.id === profile)!;

  const volumePerPiece = (width / 1000) * (height / 1000) * (length / 1000);
  const totalVolume = volumePerPiece * quantity;
  const pricePerPiece = volumePerPiece * selectedMaterial.pricePerCubic * selectedProfile.coeff;
  const totalPrice = pricePerPiece * quantity;

  const piecesPerCubic = Math.round(1 / volumePerPiece);

  return (
    <section id="calculator" className="py-20 bg-eco-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white border border-eco-200 rounded-full px-4 py-2 text-eco-700 text-sm font-medium mb-4">
            🔢 Калькулятор
          </div>
          <h2 className="section-title mb-4">Рассчитайте стоимость</h2>
          <p className="text-eco-600 text-lg max-w-2xl mx-auto">
            Укажите параметры пиломатериала и получите точный расчёт стоимости и объёма.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-eco-100 p-6 md:p-8 space-y-6">
            {/* Material */}
            <div>
              <label className="text-eco-800 font-semibold text-sm block mb-3">Порода дерева</label>
              <div className="grid grid-cols-2 gap-3">
                {materials.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMaterial(m.id)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 text-left ${
                      material === m.id
                        ? 'bg-eco-600 text-white border-eco-600 shadow-md'
                        : 'bg-eco-50 text-eco-700 border-eco-200 hover:border-eco-400'
                    }`}
                  >
                    <div className="font-semibold">{m.name}</div>
                    <div className={`text-xs mt-0.5 ${material === m.id ? 'text-eco-100' : 'text-eco-500'}`}>
                      {m.pricePerCubic.toLocaleString('ru-RU')} ₽/м³
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile */}
            <div>
              <label className="text-eco-800 font-semibold text-sm block mb-3">Вид пиломатериала</label>
              <div className="grid grid-cols-2 gap-3">
                {profiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProfile(p.id)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 ${
                      profile === p.id
                        ? 'bg-wood-500 text-white border-wood-500 shadow-md'
                        : 'bg-wood-50 text-wood-700 border-wood-200 hover:border-wood-400'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="text-eco-800 font-semibold text-sm block mb-3">Сечение и длина (мм)</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Ширина', value: width, onChange: setWidth, min: 25, max: 500, step: 25 },
                  { label: 'Высота', value: height, onChange: setHeight, min: 25, max: 500, step: 25 },
                  { label: 'Длина', value: length, onChange: setLength, min: 1000, max: 12000, step: 500 },
                ].map(field => (
                  <div key={field.label}>
                    <div className="text-eco-600 text-xs mb-2">{field.label}</div>
                    <input
                      type="number"
                      value={field.value}
                      onChange={e => field.onChange(Number(e.target.value))}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="w-full border border-eco-200 rounded-xl px-3 py-2.5 text-eco-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-eco-400 bg-eco-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-eco-800 font-semibold text-sm block mb-3">
                Количество брусков / штук: <span className="text-eco-600">{quantity} шт</span>
              </label>
              <input
                type="range"
                min={1}
                max={200}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full accent-eco-600 h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-eco-500 mt-1">
                <span>1 шт</span>
                <span>200 шт</span>
              </div>
              <div className="flex gap-3 mt-3">
                {[5, 10, 20, 50, 100].map(q => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      quantity === q
                        ? 'bg-eco-600 text-white border-eco-600'
                        : 'bg-eco-50 text-eco-600 border-eco-200 hover:border-eco-400'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Main result */}
            <div className="bg-eco-700 text-white rounded-2xl p-6 shadow-lg">
              <div className="text-eco-200 text-sm font-medium mb-1">Итого к оплате</div>
              <div className="font-display text-4xl font-bold mb-1">
                {totalPrice.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
              </div>
              <div className="text-eco-300 text-sm">
                {selectedMaterial.name} · {selectedProfile.name}
              </div>
            </div>

            {/* Detail cards */}
            {[
              {
                icon: '📦',
                label: 'Объём всей партии',
                value: `${totalVolume.toFixed(3)} м³`,
              },
              {
                icon: '🪵',
                label: 'Цена за 1 штуку',
                value: `${pricePerPiece.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽`,
              },
              {
                icon: '📐',
                label: 'Объём 1 штуки',
                value: `${volumePerPiece.toFixed(4)} м³`,
              },
              {
                icon: '🔢',
                label: 'Штук в 1 м³',
                value: `≈ ${piecesPerCubic} шт`,
              },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-2xl border border-eco-100 p-4 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 bg-eco-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {card.icon}
                </div>
                <div>
                  <div className="text-eco-500 text-xs">{card.label}</div>
                  <div className="font-semibold text-eco-800">{card.value}</div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="bg-wood-50 border border-wood-200 rounded-2xl p-5 text-center">
              <div className="text-wood-700 text-sm mb-3 leading-relaxed">
                Хотите заказать <strong>{quantity} шт</strong> за{' '}
                <strong>{totalPrice.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽</strong>?
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary w-full py-3 text-sm"
              >
                <Icon name="ShoppingCart" size={16} className="inline mr-2" />
                Перейти в каталог
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
