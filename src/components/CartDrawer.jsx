import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onProceedToCheckout 
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeShippingThreshold = 1499;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(31, 42, 68, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'flex-end'
    }}>
      
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideInRight 0.3s ease-out'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E8E2D9',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          backgroundColor: '#F7F3EE'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#1F2A44" />
            <h3 style={{ fontSize: '1.25rem', color: '#1F2A44', fontWeight: 700 }}>Your Shopping Bag</h3>
            <span className="badge-blush">{cartItems.length}</span>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A1A1A' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ backgroundColor: '#F4E8E8', padding: '12px 24px', borderBottom: '1px solid #E8E2D9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#1F2A44' }}>
            <Truck size={16} color="#C97B7B" />
            {amountForFreeShipping === 0 ? (
              <span>🎉 Congratulations! You unlocked <strong>FREE Shipping</strong>!</span>
            ) : (
              <span>Add <strong>₹{amountForFreeShipping}</strong> more for <strong>FREE Shipping</strong></span>
            )}
          </div>
          
          <div style={{ width: '100%', height: '6px', backgroundColor: '#E8E2D9', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${freeShippingProgress}%`, height: '100%', backgroundColor: '#C97B7B', transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <ShoppingBag size={48} color="#CCC" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '1.1rem', color: '#1F2A44', fontWeight: 600 }}>Your bag is empty</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Explore our collection to add comfort to your wardrobe.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div 
                  key={`${item.id}-${item.selectedSize}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #F0ECE6'
                  }}
                >
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#F7F3EE' }}
                  />

                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2A44' }}>{item.name}</h4>
                        <button 
                          onClick={() => onRemoveItem(item.id, item.selectedSize)}
                          style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '2px' }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                        Fabric: {item.fabric} | Size: <strong>{item.selectedSize}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      {/* Quantity modifier */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8E2D9', borderRadius: '6px', overflow: 'hidden' }}>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          style={{ border: 'none', width: '26px', height: '26px', background: '#F7F3EE', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 600 }}>{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          style={{ border: 'none', width: '26px', height: '26px', background: '#F7F3EE', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>

                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1F2A44' }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #E8E2D9', backgroundColor: '#F7F3EE' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#555' }}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem', color: '#555' }}>
              <span>Estimated Delivery</span>
              <span style={{ color: amountForFreeShipping === 0 ? '#2E7D32' : '#1F2A44', fontWeight: 600 }}>
                {amountForFreeShipping === 0 ? 'FREE' : '₹99'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.25rem', fontWeight: 700, color: '#1F2A44', paddingTop: '8px', borderTop: '1px dashed #D5CEC4' }}>
              <span>Total Amount</span>
              <span>₹{subtotal + (amountForFreeShipping === 0 ? 0 : 99)}</span>
            </div>

            <button 
              onClick={onProceedToCheckout}
              className="btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
