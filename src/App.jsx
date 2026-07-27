import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Story from './components/Story';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import CustomerLoginModal from './components/CustomerLoginModal';
import ContactSection from './components/ContactSection';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';

import FashionLookbook from './components/FashionLookbook';
import TestimonialsSection from './components/TestimonialsSection';

import { BRAND_DETAILS } from './data/products';
import { DB } from './services/db';
import './styles/theme.css';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'collections' | 'story' | 'contact' | 'admin' | 'customer-dashboard'
  const [searchQuery, setSearchQuery] = useState('');


  // Customer Account & Admin Auth State
  const [currentUser, setCurrentUser] = useState(() => DB.getCurrentSessionCustomer());
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);

  // Core Persistent Data States
  const [products, setProducts] = useState(() => DB.getProducts());
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState(() => DB.getOrders());

  const handleLogoutCustomer = () => {
    DB.setCurrentSessionCustomer(null);
    setCurrentUser(null);
  };


  useEffect(() => {
    // Check if direct admin URL parameter exists e.g. ?admin=true or #admin
    if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
      setActiveTab('admin');
    }

    async function loadCloudData() {
      const fetchedProducts = await DB.fetchProductsAsync();
      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      }
      const fetchedOrders = await DB.fetchOrdersAsync();
      if (fetchedOrders && fetchedOrders.length > 0) {
        setOrders(fetchedOrders);
      }
    }
    loadCloudData();
  }, []);

  // Active Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentConfirmationOrder, setCurrentConfirmationOrder] = useState(null);

  // Cart Handlers
  const handleAddToCart = (product, size = 'M', qty = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.selectedSize === size);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { ...product, selectedSize: size, quantity: qty }];
    });
  };

  const handleUpdateCartQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId, size);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === productId && item.selectedSize === size) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (productId, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)));
  };

  const handleCompleteOrder = (newOrder) => {
    const updatedOrders = DB.addOrder(newOrder);
    setOrders(updatedOrders);
    setProducts(DB.getProducts());
    setCartItems([]);
    setIsCheckoutOpen(false);
    setCurrentConfirmationOrder(newOrder);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7F3EE' }}>
      
      {/* Customer Navigation Header */}
      {activeTab !== 'admin' && (
        <Header 
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onOpenCustomerLogin={() => setIsCustomerLoginOpen(true)}
          onLogoutCustomer={handleLogoutCustomer}
        />
      )}


      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'admin' ? (
          <AdminDashboard 
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            onExitAdmin={() => setActiveTab('home')}
          />
        ) : (
          <>
            {/* Home View */}
            {activeTab === 'home' && (
              <>
                <Hero 
                  onExplore={() => setActiveTab('collections')}
                  onOpenStory={() => setActiveTab('story')}
                />
                <FashionLookbook 
                  onSelectCategory={(cat) => {
                    setActiveTab('collections');
                  }}
                />
                <ProductCatalog 
                  products={products}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onQuickAdd={(p) => handleAddToCart(p, 'M', 1)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                <TestimonialsSection />
                <Story />
                <ContactSection />
              </>
            )}

            {/* Story View */}
            {activeTab === 'story' && (
              <Story />
            )}

            {/* Collections View */}
            {activeTab === 'collections' && (
              <>
                <div style={{ backgroundColor: '#1F2A44', color: '#FFF', padding: '40px 0', textAlign: 'center' }}>
                  <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '8px' }}>
                    Curated Collections
                  </h1>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
                    Explore our handcrafted robes, pyjama co-ords, kaftans, and slip dresses designed with pure comfort & elegance.
                  </p>
                </div>
                <ProductCatalog 
                  products={products}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onQuickAdd={(p) => handleAddToCart(p, 'M', 1)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </>
            )}

            {/* Contact View */}
            {activeTab === 'contact' && (
              <ContactSection />
            )}

            {/* Customer Dashboard View */}
            {activeTab === 'customer-dashboard' && (
              <CustomerDashboard 
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                orders={orders}
                onContinueShopping={() => setActiveTab('collections')}
                onLogout={handleLogoutCustomer}
              />
            )}
          </>
        )}
      </main>


      {/* Footer */}
      {activeTab !== 'admin' && (
        <footer style={{ backgroundColor: '#1F2A44', color: '#FFFFFF', padding: '48px 0 24px 0', borderTop: '1px solid #E8E2D9' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '36px', marginBottom: '36px' }}>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <img 
                    src="/logo.png" 
                    alt="YUMI DXB Fashion Logo" 
                    style={{ height: '40px', width: 'auto', borderRadius: '6px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: '700', letterSpacing: '2px', color: '#FFF' }}>
                    YUMI <span style={{ color: '#C97B7B', fontSize: '1.1rem' }}>DXB</span>
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '8px', lineHeight: 1.5 }}>
                  {BRAND_DETAILS.tagline}. Started in 2024 by two sisters with a commitment to family-first quality.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '12px' }}>Quick Navigation</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                  <li onClick={() => setActiveTab('home')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>Home</li>
                  <li onClick={() => setActiveTab('collections')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>Collections</li>
                  <li onClick={() => setActiveTab('story')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>Our Story</li>
                  <li onClick={() => setActiveTab('contact')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>Contact Us</li>
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '12px' }}>Contact & Connect</h4>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>Instagram: <strong>{BRAND_DETAILS.instagram}</strong></p>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>Email: hello@yumidxb.com</p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Pan-India Express Doorstep Shipping</p>
              </div>

            </div>

            <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>© 2024 - 2026 {BRAND_DETAILS.name}. All rights reserved.</div>
              {/* Separate Store Owner / Admin Portal Access */}
              <button 
                onClick={() => setActiveTab('admin')}
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem',
                  cursor: 'pointer', textDecoration: 'underline'
                }}
              >
                Store Staff & Admin Portal 🔒
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* CUSTOMER LOGIN MODAL */}
      <CustomerLoginModal 
        isOpen={isCustomerLoginOpen}
        onClose={() => setIsCustomerLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab('customer-dashboard');
        }}
      />


      {/* SHOPPING MODALS */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onCompleteOrder={handleCompleteOrder}
        currentUser={currentUser}
      />


      {currentConfirmationOrder && (
        <OrderConfirmationModal 
          order={currentConfirmationOrder}
          onClose={() => setCurrentConfirmationOrder(null)}
          onViewInAdmin={() => {
            setCurrentConfirmationOrder(null);
            setActiveTab('admin');
          }}
        />
      )}

    </div>
  );
}
