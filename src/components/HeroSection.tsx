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

              {/* Truck animation — inside the image, left→right */}
              <div className="truck-drive" style={{ display: 'flex', alignItems: 'flex-end' }}>
                {/* Flag banner trailing BEHIND the truck (to the left) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: '4px', paddingBottom: '10px' }}>
                  {/* Rope from flag to trailer */}
                  <div style={{ height: '2px', width: '30px', background: '#888', alignSelf: 'flex-end', marginBottom: '2px' }} />
                  {/* Flag */}
                  <div className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-xs whitespace-nowrap shadow-md"
                    style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0 50%)' }}>
                    Быстрая доставка
                  </div>
                </div>
                {/* Truck SVG (faces right) */}
                <svg viewBox="0 0 140 60" width="120" height="52" xmlns="http://www.w3.org/2000/svg">
                  {/* Trailer body */}
                  <rect x="8" y="12" width="80" height="32" rx="3" fill="#dd3333"/>
                  {/* Cabin */}
                  <rect x="88" y="16" width="38" height="28" rx="4" fill="#cc1111"/>
                  {/* Windshield */}
                  <rect x="118" y="19" width="6" height="14" rx="2" fill="#b3d9f7" opacity="0.9"/>
                  {/* Undercarriage */}
                  <rect x="8" y="41" width="118" height="5" rx="2" fill="#aa0000"/>
                  {/* Wheels */}
                  <circle cx="30" cy="50" r="8" fill="#1a1a1a"/>
                  <circle cx="30" cy="50" r="4" fill="#444"/>
                  <circle cx="95" cy="50" r="8" fill="#1a1a1a"/>
                  <circle cx="95" cy="50" r="4" fill="#444"/>
                  <circle cx="116" cy="50" r="6" fill="#1a1a1a"/>
                  <circle cx="116" cy="50" r="3" fill="#444"/>
                  {/* Headlight */}
                  <rect x="124" y="24" width="5" height="6" rx="1" fill="#ffe066"/>
                  {/* Exhaust smoke */}
                  <circle cx="14" cy="8" r="4" fill="white" opacity="0.4"/>
                  <circle cx="10" cy="4" r="2.5" fill="white" opacity="0.25"/>
                </svg>
              </div>
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