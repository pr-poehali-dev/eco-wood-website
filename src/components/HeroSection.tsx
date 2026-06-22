interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #e8f5e8 0%, #d4ebd3 35%, #eadcc8 80%, #e5d0b0 100%)',
      }}
    >
      {/* Wood texture overlay */}
      <div className="absolute inset-0 wood-pattern opacity-60" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-eco-200 rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-wood-200 rounded-full opacity-25 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-eco-100 border border-eco-200 rounded-full px-4 py-2 text-eco-700 text-sm font-medium animate-fade-in">
              🌿 Экологически чистая продукция
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-eco-900 leading-tight animate-fade-in animate-delay-100">
              Природная
              <br />
              <span className="text-eco-600">древесина</span>
              <br />
              для ваших идей
            </h1>

            <p className="text-eco-700 text-lg md:text-xl leading-relaxed max-w-lg animate-fade-in animate-delay-200">
              Качественный пиломатериал от производителя. Сосна, ель, лиственница — 
              широкий выбор размеров и пород дерева с доставкой по всей России.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animate-delay-300">
              <button
                onClick={() => onNavigate('catalog')}
                className="btn-primary text-base px-8 py-4"
              >
                🪵 Смотреть каталог
              </button>
              <button
                onClick={() => onNavigate('calculator')}
                className="btn-secondary text-base px-8 py-4"
              >
                🔢 Рассчитать стоимость
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4 animate-fade-in animate-delay-400">
              {[
                { value: '10+', label: 'лет на рынке' },
                { value: '20+', label: 'видов древесины' },
                { value: '2000+', label: 'довольных клиентов' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-3xl font-bold text-eco-700">{stat.value}</div>
                  <div className="text-eco-600 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className="relative animate-fade-in animate-delay-300">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/files/a074c008-0356-4004-968d-4fd917afa2be.jpg"
                alt="Древесина ЭкоДрев"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-eco-900/30 to-transparent" />
            </div>

            {/* ГОСТ качество badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-eco-100 animate-fade-in animate-delay-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-wood-100 rounded-xl flex items-center justify-center text-xl">✅</div>
                <div>
                  <div className="font-semibold text-wood-800 text-sm">ГОСТ качество</div>
                  <div className="text-wood-600 text-xs">Сертифицировано</div>
                </div>
              </div>
            </div>

            {/* Truck animation */}
            <div className="absolute -bottom-6 left-0 right-0 h-16 overflow-hidden">
              <div className="truck-drive flex items-center gap-0" style={{ width: 'max-content' }}>
                {/* Flag banner */}
                <div className="relative mr-1" style={{ top: '-4px' }}>
                  <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-md whitespace-nowrap"
                    style={{ clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)' }}>
                    Быстрая доставка
                  </div>
                  <div className="w-px h-4 bg-gray-500 mx-auto" />
                </div>
                {/* Red truck SVG */}
                <svg viewBox="0 0 120 60" width="100" height="50" xmlns="http://www.w3.org/2000/svg">
                  {/* Cabin */}
                  <rect x="70" y="15" width="40" height="28" rx="4" fill="#cc2222"/>
                  {/* Windshield */}
                  <rect x="98" y="18" width="10" height="12" rx="2" fill="#b3d9f7" opacity="0.85"/>
                  {/* Body/trailer */}
                  <rect x="10" y="18" width="62" height="25" rx="3" fill="#dd3333"/>
                  {/* Undercarriage */}
                  <rect x="10" y="40" width="100" height="5" rx="2" fill="#aa1111"/>
                  {/* Wheels */}
                  <circle cx="28" cy="48" r="8" fill="#222"/>
                  <circle cx="28" cy="48" r="4" fill="#555"/>
                  <circle cx="90" cy="48" r="8" fill="#222"/>
                  <circle cx="90" cy="48" r="4" fill="#555"/>
                  <circle cx="108" cy="48" r="6" fill="#222"/>
                  <circle cx="108" cy="48" r="3" fill="#555"/>
                  {/* Headlight */}
                  <rect x="108" y="26" width="4" height="5" rx="1" fill="#ffe066"/>
                  {/* Exhaust puff */}
                  <circle cx="6" cy="22" r="3" fill="white" opacity="0.5"/>
                  <circle cx="2" cy="18" r="2" fill="white" opacity="0.3"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 30C1440 30 1200 0 720 0C240 0 0 30 0 30L0 60Z" fill="#f0f7f0" />
        </svg>
      </div>
    </section>
  );
}