import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CatalogSection from '@/components/CatalogSection';
import CalculatorSection from '@/components/CalculatorSection';
import AboutSection from '@/components/AboutSection';
import ReviewsSection from '@/components/ReviewsSection';
import TipsSection from '@/components/TipsSection';
import ContactsSection from '@/components/ContactsSection';
import CartDrawer from '@/components/CartDrawer';
import OrderModal from '@/components/OrderModal';
import Footer from '@/components/Footer';
import SectionFrame from '@/components/SectionFrame';

interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const navigateTo = (section: string) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleOrder = () => {
    setCartOpen(false);
    setOrderOpen(true);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    setOrderOpen(false);
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        activeSection={activeSection}
        cartCount={cartCount}
        onNavigate={navigateTo}
        onCartOpen={() => setCartOpen(true)}
      />

      <main>
        <HeroSection onNavigate={navigateTo} />
        <SectionFrame><CatalogSection onAddToCart={addToCart} /></SectionFrame>
        <SectionFrame><CalculatorSection onAddToCart={addToCart} /></SectionFrame>
        <SectionFrame><AboutSection /></SectionFrame>
        <SectionFrame><ReviewsSection /></SectionFrame>
        <SectionFrame><TipsSection /></SectionFrame>
        <SectionFrame><ContactsSection /></SectionFrame>
      </main>

      <Footer onNavigate={navigateTo} />

      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onOrder={handleOrder}
      />

      <OrderModal
        isOpen={orderOpen}
        items={cartItems}
        onClose={() => setOrderOpen(false)}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default Index;