import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-eco-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group"
          >
            <img
              src="https://cdn.poehali.dev/projects/9893030b-b0f1-44eb-bfc4-cfe8fdbd3ab8/bucket/959b4979-43a8-4629-b1a0-51a51b81c558.png"
              alt="ЭкоДрев"
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-display text-3xl font-bold text-eco-800">ЭкоДрев</span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-eco-800 bg-eco-50'
                      : 'text-eco-600 hover:text-eco-800 hover:bg-eco-50'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-eco-500 rounded-full" />
                  )}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => navigate('/diy')}
                className="px-3 py-2 rounded-lg text-sm text-amber-700 font-semibold hover:bg-amber-50 transition-colors"
              >
                🪵 Своими Руками
              </button>
            </li>
          </ul>

          {/* Cart + profile + mobile menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCartOpen}
              className="relative flex items-center gap-2 bg-eco-50 hover:bg-eco-100 border border-eco-200 text-eco-800 rounded-xl px-4 py-2.5 transition-all duration-200 font-medium text-sm"
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
              onClick={() => navigate('/login')}
              className="w-10 h-10 rounded-full bg-eco-100 hover:bg-eco-200 border border-eco-200 flex items-center justify-center transition-all duration-200 text-eco-700 hover:text-eco-900"
              title="Войти"
            >
              <Icon name="User" size={18} />
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
            <button
              onClick={() => { navigate('/diy'); setMenuOpen(false); }}
              className="text-left px-4 py-3 rounded-xl text-amber-700 font-semibold hover:bg-amber-50 transition-colors"
            >
              🪵 Своими Руками
            </button>
          </div>
        )}
      </nav>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollTop}
          className="fixed bottom-8 right-6 z-50 w-12 h-12 bg-eco-600 hover:bg-eco-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          title="Наверх"
        >
          <Icon name="ArrowUp" size={20} />
        </button>
      )}
    </>
  );
}
