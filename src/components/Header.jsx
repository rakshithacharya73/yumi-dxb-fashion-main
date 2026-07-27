import React, { useState } from 'react';
import { ShoppingBag, Search, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { BRAND_DETAILS } from '../data/products';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery,
  currentUser,
  onOpenCustomerLogin,
  onLogoutCustomer
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#F7F3EE', borderBottom: '1px solid #E8E2D9' }}>
      {/* Top Announcement Bar */}
      <div style={{ backgroundColor: '#1F2A44', color: '#FFFFFF', padding: '6px 16px', fontSize: '0.8rem', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={14} color="#C97B7B" />
        <span>Welcome to YUMI DXB Fashion — Free Shipping across India on orders over ₹1,499</span>
        <Sparkles size={14} color="#C97B7B" />
      </div>

      {/* Main Header Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        
        {/* Mobile Hamburger Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A1A1A' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <img 
            src="/logo.png" 
            alt="YUMI DXB Fashion Logo" 
            style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.65rem', fontWeight: '700', letterSpacing: '2px', color: '#1F2A44', lineHeight: 1.1 }}>
              YUMI <span style={{ color: '#C97B7B', fontSize: '1.15rem', fontWeight: 400 }}>DXB</span>
            </span>
            <span style={{ fontSize: '0.68rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '2px' }}>
              {BRAND_DETAILS.tagline}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
          <button 
            onClick={() => setActiveTab('home')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: activeTab === 'home' ? 700 : 500,
              color: activeTab === 'home' ? '#C97B7B' : '#1A1A1A', borderBottom: activeTab === 'home' ? '2px solid #C97B7B' : '2px solid transparent',
              paddingBottom: '4px', transition: 'all 0.2s'
            }}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('collections')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: activeTab === 'collections' ? 700 : 500,
              color: activeTab === 'collections' ? '#C97B7B' : '#1A1A1A', borderBottom: activeTab === 'collections' ? '2px solid #C97B7B' : '2px solid transparent',
              paddingBottom: '4px', transition: 'all 0.2s'
            }}
          >
            Collections
          </button>
          <button 
            onClick={() => setActiveTab('story')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: activeTab === 'story' ? 700 : 500,
              color: activeTab === 'story' ? '#C97B7B' : '#1A1A1A', borderBottom: activeTab === 'story' ? '2px solid #C97B7B' : '2px solid transparent',
              paddingBottom: '4px', transition: 'all 0.2s'
            }}
          >
            Our Story
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: activeTab === 'contact' ? 700 : 500,
              color: activeTab === 'contact' ? '#C97B7B' : '#1A1A1A', borderBottom: activeTab === 'contact' ? '2px solid #C97B7B' : '2px solid transparent',
              paddingBottom: '4px', transition: 'all 0.2s'
            }}
          >
            Contact Us
          </button>
        </nav>

        {/* Right Action Icons (Search, Customer Account, Shopping Bag) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Search Trigger */}
          <div style={{ position: 'relative' }}>
            {showSearch ? (
              <div style={{ display: 'flex', alignItems: 'center', background: '#FFF', borderRadius: '20px', border: '1px solid #C97B7B', padding: '4px 12px' }}>
                <Search size={16} color="#C97B7B" />
                <input 
                  type="text" 
                  placeholder="Search robe, kaftan..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{ border: 'none', outline: 'none', padding: '4px 8px', fontSize: '0.85rem', width: '130px', background: 'transparent' }}
                />
                <X size={14} style={{ cursor: 'pointer', color: '#999' }} onClick={() => { setShowSearch(false); setSearchQuery(''); }} />
              </div>
            ) : (
              <button 
                onClick={() => { setShowSearch(true); setActiveTab('collections'); }}
                title="Search Products"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A1A1A', padding: '6px' }}
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Customer Portal Button */}
          {currentUser ? (
            <button 
              onClick={() => setActiveTab('customer-dashboard')}
              title="View Customer Dashboard & My Orders"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: activeTab === 'customer-dashboard' ? '#1F2A44' : 'rgba(201, 123, 123, 0.12)',
                color: activeTab === 'customer-dashboard' ? '#FFF' : '#1F2A44',
                padding: '6px 14px', borderRadius: '20px',
                border: activeTab === 'customer-dashboard' ? '1px solid #1F2A44' : '1px solid rgba(201, 123, 123, 0.4)',
                cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.2s'
              }}
            >
              <User size={14} color={activeTab === 'customer-dashboard' ? '#C97B7B' : '#C97B7B'} />
              <span>My Account</span>
            </button>
          ) : (
            <button 
              onClick={onOpenCustomerLogin}
              title="Customer Sign In / Register"
              style={{
                backgroundColor: 'transparent', color: '#1F2A44', border: '1px solid rgba(31, 42, 68, 0.25)',
                padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center',
                gap: '6px', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <User size={15} color="#C97B7B" /> Sign In / Register
            </button>
          )}

          {/* Shopping Bag / Cart */}
          <button 
            onClick={onOpenCart}
            style={{
              position: 'relative', background: '#1F2A44', color: '#FFFFFF', border: 'none',
              padding: '10px 16px', borderRadius: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s'
            }}
            className="cart-btn"
          >

            <ShoppingBag size={18} color="#FFF" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span style={{
                backgroundColor: '#C97B7B', color: '#FFF', borderRadius: '50%', padding: '2px 7px',
                fontSize: '0.75rem', fontWeight: 700
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#F7F3EE', borderTop: '1px solid #E8E2D9', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', padding: '8px 0', border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600 }}>Home</button>
          <button onClick={() => { setActiveTab('collections'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', padding: '8px 0', border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600 }}>Collections</button>
          <button onClick={() => { setActiveTab('story'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', padding: '8px 0', border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600 }}>Our Story</button>
          <button onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', padding: '8px 0', border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600 }}>Contact Us</button>
          {!currentUser && (
            <button onClick={() => { onOpenCustomerLogin(); setMobileMenuOpen(false); }} style={{ textAlign: 'left', padding: '8px 0', border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600, color: '#C97B7B' }}>
              Sign In / Account
            </button>
          )}
        </div>
      )}
    </header>
  );
}
