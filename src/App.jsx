import React, { useState } from 'react';
import { Home, Search, ShoppingBag, MessageCircle, Headphones, User } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import HomeView from './components/HomeView';
import VendorView from './components/VendorView';
import CheckoutView from './components/CheckoutView';
import ChatView from './components/ChatView';
import OrdersView from './components/OrdersView';
import chowpalLogo from './assets/chowpal_logo.png';
import './index.css';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [navigation, setNavigation] = useState({ view: 'root', params: {} });
  const { cart } = useCart();

  const handleNavigate = (view, params = {}) => {
    setNavigation({ view, params });
  };

  const handleBack = () => {
    setNavigation({ view: 'root', params: {} });
  };

  const renderContent = () => {
    // If full page overlays
    if (navigation.view === 'vendor') {
      return <VendorView vendorId={navigation.params} onBack={handleBack} />;
    }
    if (navigation.view === 'checkout') {
      return <CheckoutView onBack={handleBack} />;
    }

    // Otherwise Tabs
    switch (activeTab) {
      case 'home': return <HomeView onNavigate={handleNavigate} />;
      case 'search': return <div className="p-4">Search (Coming Soon)</div>;
      case 'orders': return <OrdersView onNavigate={handleNavigate} />;
      case 'chowpal': return <ChatView onNavigate={handleNavigate} />;
      case 'support': return <div className="p-4">Support (Coming Soon)</div>;
      case 'profile': return <div className="p-4">Profile (Coming Soon)</div>;
      default: return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-container">
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {renderContent()}
      </main>

      {/* Bottom Nav - Only show when at root view */}
      {navigation.view === 'root' && (
        <nav style={{
          position: 'fixed', bottom: 0,
          width: '100%', maxWidth: 480,
          background: 'white', borderTop: '1px solid #eee',
          display: 'flex', justifyContent: 'space-around', padding: '12px 0',
          zIndex: 100, paddingBottom: 20
        }}>
          <NavIcon icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavIcon icon={<Search />} label="Search" active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
          <NavIcon icon={<ShoppingBag />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} badge={cart.length > 0 ? cart.length : null} />
          <NavIcon label="Chowpal" active={activeTab === 'chowpal'} onClick={() => setActiveTab('chowpal')} aiIcon />
          <NavIcon icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} customIcon />
        </nav>
      )}

      {/* Checkout Floater Button (if items in cart and on Home/Vendor) */}
      <CartFloater onCheckout={() => handleNavigate('checkout')} currentView={navigation.view} activeTab={activeTab} />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

const CartFloater = ({ onCheckout, currentView, activeTab }) => {
  const { cart } = useCart();

  // Show only on Home (Root+HomeTab) or Vendor View
  const isVisible = (currentView === 'root' && activeTab === 'home') || (currentView === 'vendor');

  if (cart.length === 0 || !isVisible) return null;

  return (
    <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: 440, zIndex: 90 }}>
      <button
        onClick={onCheckout}
        style={{
          width: '100%', background: '#0C513F', color: 'white',
          padding: 16, borderRadius: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 4px 12px rgba(12, 81, 63, 0.3)'
        }}>
        <span className="font-bold">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
        <span className="font-bold">View Cart</span>
        <span className="font-bold">₦{cart.reduce((s, i) => s + (i.price * i.qty), 0).toLocaleString()}</span>
      </button>
    </div>
  );
};

const NavIcon = ({ icon, label, active, onClick, badge, customIcon, aiIcon }) => (
  <button onClick={onClick} style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 4,
    color: active ? '#0C513F' : '#9CA3AF', background: 'none', position: 'relative'
  }}>
    <div style={{ position: 'relative' }}>
      {customIcon ? (
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #EAB308)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 16 }}>🐔</span>
        </div>
      ) : aiIcon ? (
        <div style={{ width: 26, height: 26, borderRadius: '50%', border: active ? '2px solid #0C513F' : '1px solid transparent', overflow: 'hidden' }}>
          <img src={chowpalLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })
      )}
      {badge && (
        <div style={{ position: 'absolute', top: -4, right: -8, background: '#0C513F', color: 'white', fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</div>
      )}
    </div>
    <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
  </button>
);

export default App;
