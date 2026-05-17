import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface NavbarProps {
  activeSection: string;
  cartCount: number;
  onNavigate: (section: string) => void;
  onCartOpen: () => void;
}

const navItems = [
  { id: 'home', label: 'Главная' },
  { id: 'catalog', label: 'Каталог' },
  { id: 'calculator', label: 'Калькулятор' },
  { id: 'about', label: 'О компании' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'tips', label: 'Советы' },
  { id: 'contacts', label: 'Контакты' },
];

export default function Navbar({ activeSection, cartCount, onNavigate, onCartOpen }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-eco-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 bg-eco-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-white text-lg">🌲</span>
          </div>
          <span className="font-display text-2xl font-bold text-eco-800">ЭкоДрев</span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => handleNav(item.id)}
                className={`nav-link text-sm ${activeSection === item.id ? 'text-eco-800 font-semibold' : ''}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="block h-0.5 bg-eco-500 rounded-full mt-0.5" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Cart + mobile menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-2 bg-eco-50 hover:bg-eco-100 border border-eco-200 text-eco-800 rounded-xl px-4 py-2 transition-all duration-200 font-medium text-sm"
          >
            <Icon name="ShoppingCart" size={18} />
            <span className="hidden sm:inline">Корзина</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-eco-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="lg:hidden text-eco-700 p-2 rounded-lg hover:bg-eco-50"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-eco-100 px-4 py-4 flex flex-col gap-2 shadow-lg">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-left px-4 py-3 rounded-xl transition-colors ${
                activeSection === item.id
                  ? 'bg-eco-100 text-eco-800 font-semibold'
                  : 'text-eco-700 hover:bg-eco-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
