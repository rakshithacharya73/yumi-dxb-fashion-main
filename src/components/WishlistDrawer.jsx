import React from 'react';
import { X, Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

export default function WishlistDrawer({ 
  isOpen, 
  onClose, 
  wishlistIds = [], 
  products = [], 
  onToggleWishlist, 
  onAddToCart,
  onOpenCart 
}) {
  if (!isOpen) return null;

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20000,
      backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
      display: 'flex', justifyContent: 'flex-end'
    }}>
      
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'slideInRight 0.3s ease-out'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E8E2D9',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          backgroundColor: '#FFF0F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={20} color="#C97B7B" fill="#C97B7B" />
            <h3 style={{ fontSize: '1.25rem', color: '#1F2A44', fontWeight: 700, margin: 0 }}>Your Wishlist</h3>
            <span style={{
              backgroundColor: '#C97B7B', color: '#FFF', borderRadius: '50%', padding: '2px 8px',
              fontSize: '0.78rem', fontWeight: 800
            }}>
              {wishlistProducts.length}
            </span>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A1A1A' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Wishlist Item List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {wishlistProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FFF0F0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Heart size={32} color="#C97B7B" fill="#C97B7B" />
              </div>
              <p style={{ fontSize: '1.1rem', color: '#1F2A44', fontWeight: 600, margin: 0 }}>Your wishlist is empty</p>
              <p style={{ fontSize: '0.85rem', marginTop: '6px', color: '#666' }}>Save items you love by clicking the heart icon on any product.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {wishlistProducts.map((product) => (
                <div 
                  key={product.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #F0ECE6',
                    alignItems: 'center'
                  }}
                >
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#F7F3EE', flexShrink: 0 }}
                  />

                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2A44', margin: 0 }}>{product.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#C97B7B', fontWeight: 600 }}>{product.fabric}</span>
                      </div>

                      <button 
                        onClick={() => onToggleWishlist(product.id)}
                        title="Remove from wishlist"
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} color="#94A3B8" />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span style={{ fontWeight: 800, color: '#1F2A44', fontSize: '0.95rem' }}>₹{product.price}</span>

                      <button
                        onClick={() => {
                          onAddToCart(product, 'M', 1);
                          onClose();
                          if (onOpenCart) onOpenCart();
                        }}
                        style={{
                          backgroundColor: '#1F2A44',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <ShoppingBag size={12} /> Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Action */}
        {wishlistProducts.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #E8E2D9', backgroundColor: '#F7F3EE' }}>
            <button 
              onClick={() => {
                wishlistProducts.forEach(p => onAddToCart(p, 'M', 1));
                onClose();
                if (onOpenCart) onOpenCart();
              }}
              className="btn-accent"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
            >
              Move All ({wishlistProducts.length}) to Bag <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
