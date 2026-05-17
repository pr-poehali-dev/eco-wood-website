interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const links = [
    { id: 'home', label: 'Главная' },
    { id: 'catalog', label: 'Каталог' },
    { id: 'calculator', label: 'Калькулятор' },
    { id: 'about', label: 'О компании' },
    { id: 'reviews', label: 'Отзывы' },
    { id: 'tips', label: 'Советы' },
    { id: 'contacts', label: 'Контакты' },
  ];

  return (
    <footer className="bg-eco-900 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-eco-500 rounded-xl flex items-center justify-center text-lg">🌲</div>
              <span className="font-display text-2xl font-bold">ЭкоДрев</span>
            </div>
            <p className="text-eco-300 text-sm leading-relaxed max-w-xs">
              Производим и продаём качественный пиломатериал с 2009 года. Прямо от производителя — без посредников.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-eco-100 mb-4 text-sm uppercase tracking-wide">Навигация</h4>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-eco-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold text-eco-100 mb-4 text-sm uppercase tracking-wide">Контакты</h4>
            <div className="space-y-3 text-eco-300 text-sm">
              <div>📞 +7 (800) 123-45-67</div>
              <div>📧 info@ekodrev.ru</div>
              <div>📍 Вологда, ул. Лесная, 12</div>
              <div className="pt-2">
                <div className="text-eco-400 text-xs">Пн–Пт: 8:00 – 18:00</div>
                <div className="text-eco-400 text-xs">Сб: 9:00 – 15:00</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-eco-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-eco-500 text-sm">
            © 2024 ЭкоДрев. Все права защищены.
          </div>
          <div className="flex gap-6 text-eco-500 text-xs">
            <span className="cursor-pointer hover:text-eco-300 transition-colors">Политика конфиденциальности</span>
            <span className="cursor-pointer hover:text-eco-300 transition-colors">Условия использования</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
