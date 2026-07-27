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
import FashionAiAssistant from './components/FashionAiAssistant';

import { BRAND_DETAILS } from './data/products';
import { DB } from './services/db';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import './styles/theme.css';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'collections' | 'story' | 'contact' | 'admin' | 'customer-dashboard'
  const [searchQuery, setSearchQuery] = useState('');

  // Customer Account & Admin Auth State
  const [currentUser, setCurrentUser] = useState(() => DB.getCurrentSessionCustomer());
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState('login');

  // Core Persistent Data States
  const [products, setProducts] = useState(() => DB.getProducts());
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState(() => DB.getOrders());
  const [wishlistIds, setWishlistIds] = useState(() => DB.getWishlist());

  const handleLogoutCustomer = () => {
    DB.setCurrentSessionCustomer(null);
    setCurrentUser(null);
  };

  const handleToggleWishlist = (product) => {
    const updated = DB.toggleWishlist(product.id, product.name);
    setWishlistIds(updated);
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
    DB.logActivity('cart', `Added "${product.name}" (Size: ${size}) to Bag`, 'bag');
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
          wishlistCount={wishlistIds.length}
          onOpenCart={() => setIsCartOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onOpenCustomerLogin={(mode = 'login') => {
            setLoginModalMode(mode);
            setIsCustomerLoginOpen(true);
          }}
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
            wishlistIds={wishlistIds}
            cartItems={cartItems}
            currentUser={currentUser}
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
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
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
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
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
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>Email: hello@yumidxb.com</p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Pan-India & Global Express Doorstep Shipping</p>

                {/* Social & Google Maps Icons */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {/* Instagram Icon */}
                  <a 
                    href="https://instagram.com/yumi_dxb" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="Instagram - @yumi_dxb"
                    style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', textDecoration: 'none'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C97B7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>

                  {/* Facebook Icon */}
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="Facebook Page - YUMI DXB"
                    style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', textDecoration: 'none'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>

                  {/* Google Maps Icon */}
                  <a 
                    href="https://maps.google.com/?q=Dubai+Fashion+Avenue" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="Google Maps Store Location"
                    style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', textDecoration: 'none'
                    }}
                  >
                    <MapPin size={18} color="#EA4335" />
                  </a>
                </div>
              </div>

            </div>

            <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div>© 2024 - 2026 {BRAND_DETAILS.name}. All rights reserved.</div>
            </div>
          </div>
        </footer>
      )}

      {/* UNIFIED LOGIN & AUTH MODAL */}
      <CustomerLoginModal 
        isOpen={isCustomerLoginOpen}
        initialMode={loginModalMode}
        onClose={() => setIsCustomerLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user?.role === 'admin') {
            setActiveTab('admin');
          } else {
            setActiveTab('customer-dashboard');
          }
        }}
      />


      {/* SHOPPING MODALS */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
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

      {/* GLOBAL AI CHATBOT & VOICE ASSISTANT */}
      {activeTab !== 'admin' && (
        <FashionAiAssistant 
          products={products} 
          onAddToCart={handleAddToCart}
          setActiveTab={setActiveTab}
        />
      )}

    </div>
  );
}
