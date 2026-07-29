import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Story from './components/Story';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
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
import { Mail } from 'lucide-react';
import './styles/theme.css';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'collections' | 'story' | 'contact' | 'admin' | 'customer-dashboard'
  const [searchQuery, setSearchQuery] = useState('');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

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

  // Drawer & Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
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
          onOpenWishlist={() => setIsWishlistOpen(true)}
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
            onExitAdmin={() => {
              DB.setCurrentSessionCustomer(null);
              setCurrentUser(null);
              setActiveTab('home');
              setLoginModalMode('admin');
              setIsCustomerLoginOpen(true);
            }}
          />
        ) : (
          <>
            {/* Home View */}
            {activeTab === 'home' && (
              <>
                <Hero 
                  onExploreClick={() => setActiveTab('collections')}
                  onStoryClick={() => setActiveTab('story')}
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
                  onAddToCart={(p, s) => handleAddToCart(p, s || 'M', 1)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
                  currentUser={currentUser}
                  showWishlistOnly={showWishlistOnly}
                  setShowWishlistOnly={setShowWishlistOnly}
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
                  onAddToCart={(p, s) => handleAddToCart(p, s || 'M', 1)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
                  currentUser={currentUser}
                  showWishlistOnly={showWishlistOnly}
                  setShowWishlistOnly={setShowWishlistOnly}
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
                setOrders={setOrders}
                onContinueShopping={() => setActiveTab('collections')}
                onLogout={handleLogoutCustomer}
              />
            )}
          </>
        )}
      </main>


      {/* Footer */}
      {activeTab !== 'admin' && (
        <footer style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
          color: '#FFFFFF',
          padding: '56px 0 28px 0',
          borderTop: '2px solid rgba(201,123,123,0.35)',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.15)'
        }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <img 
                    src="/logo.png" 
                    alt="YUMI DXB Fashion Logo" 
                    style={{ height: '42px', width: 'auto', borderRadius: '6px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.7rem', fontWeight: '800', letterSpacing: '2px', color: '#FFF' }}>
                    YUMI <span style={{ color: '#C97B7B', fontSize: '1.15rem' }}>DXB</span>
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', marginTop: '8px', lineHeight: 1.6 }}>
                  {BRAND_DETAILS.tagline}. Handcrafted luxury loungewear designed for pure comfort and timeless elegance.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', color: '#FFF', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.5px' }}>Quick Links</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li onClick={() => setActiveTab('home')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.85)', transition: 'color 0.2s' }}>Home</li>
                  <li onClick={() => setActiveTab('collections')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.85)', transition: 'color 0.2s' }}>Collections</li>
                  <li onClick={() => setActiveTab('story')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.85)', transition: 'color 0.2s' }}>Our Story</li>
                  <li onClick={() => setActiveTab('contact')} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.85)', transition: 'color 0.2s' }}>Contact Us</li>
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', color: '#FFF', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.5px' }}>Connect & Support</h4>
                
                {/* Email link with icon */}
                <a 
                  href="mailto:hello@yumidxb.com"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: 'rgba(255,255,255,0.9)', textDecoration: 'none',
                    fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600
                  }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(201,123,123,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={15} color="#C97B7B" />
                  </div>
                  hello@yumidxb.com
                </a>

                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '18px' }}>
                  Pan-India & Global Express Doorstep Delivery 🚚
                </p>

                {/* Original Brand Social & Google Maps Icons */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  
                  {/* Instagram Authentic Gradient Icon */}
                  <a 
                    href="https://instagram.com/yumi_dxb" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="Follow on Instagram (@yumi_dxb)"
                    style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(225,48,108,0.4)', transition: 'transform 0.2s', textDecoration: 'none'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>

                  {/* Facebook Authentic Brand Icon */}
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="Follow on Facebook"
                    style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      backgroundColor: '#1877F2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(24,119,242,0.4)', transition: 'transform 0.2s', textDecoration: 'none'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* Google Maps Authentic Brand Pin */}
                  <a 
                    href="https://maps.google.com/?q=Dubai+Fashion+Avenue" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="Open Store Location on Google Maps"
                    style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'transform 0.2s', textDecoration: 'none'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
                    </svg>
                  </a>

                </div>
              </div>

            </div>

            <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div>© 2024 - 2026 {BRAND_DETAILS.name}. All rights reserved. Designed for Luxury Loungewear.</div>
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

      <WishlistDrawer 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={products}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(p, s) => handleAddToCart(p, s || 'M', 1)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCompleteOrder={handleCompleteOrder}
        onReturnToCart={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(true);
        }}
        currentUser={currentUser}
      />


      {currentConfirmationOrder && (
        <OrderConfirmationModal 
          order={currentConfirmationOrder}
          onClose={() => setCurrentConfirmationOrder(null)}
        />
      )}

      {/* GLOBAL AI CHATBOT & VOICE ASSISTANT */}
      {activeTab !== 'admin' && (
        <FashionAiAssistant 
          products={products} 
          onAddToCart={handleAddToCart}
          setActiveTab={setActiveTab}
          isCartOpen={isCartOpen}
          isCheckoutOpen={isCheckoutOpen}
        />
      )}

    </div>
  );
}
