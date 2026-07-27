import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, RefreshCw, Sparkles, Check, Info } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(() => product?.sizes?.[0] || 'M');
  const [selectedImage, setSelectedImage] = useState(() => product?.images?.[0] || product?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || 'M');
      setSelectedImage(product.images?.[0] || product.image || '');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(31, 42, 68, 0.65)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid #E8E2D9'
      }} className="animate-fade-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 10,
            backgroundColor: '#F7F3EE', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#1A1A1A'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          padding: '36px 32px'
        }}>
          
          {/* Left Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              aspectRatio: '3/4',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#F7F3EE',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <img 
                src={selectedImage} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail switcher if multiple images */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '64px', height: '80px', borderRadius: '8px', overflow: 'hidden',
                      border: selectedImage === img ? '2px solid #C97B7B' : '1px solid #E8E2D9',
                      cursor: 'pointer', padding: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <span className="badge-blush">{product.fabric}</span>
              <h2 style={{ fontSize: '2rem', color: '#1F2A44', fontWeight: 700, marginTop: '8px' }}>
                {product.name}
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D4AF37', fontWeight: 700 }}>
                  <Star size={16} fill="#D4AF37" color="#D4AF37" /> {product.rating}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>({product.reviewsCount} customer reviews)</span>
                <span style={{ fontSize: '0.85rem', color: product.stock > 0 ? '#2E7D32' : '#D32F2F', fontWeight: 600 }}>
                  • {product.stock > 0 ? `In Stock (${product.stock} items available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', backgroundColor: '#F7F3EE', padding: '16px 20px', borderRadius: '12px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: '#1F2A44' }}>₹{product.price}</span>
              {product.originalPrice && (
                <span style={{ fontSize: '1.1rem', color: '#888', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice}
                </span>
              )}
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#2E7D32', fontWeight: 700, backgroundColor: '#E8F5E9', padding: '4px 10px', borderRadius: '12px' }}>
                Inclusive of all taxes
              </span>
            </div>

            {/* Description */}
            <p style={{ color: '#444', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Size Selector */}
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2A44', display: 'block', marginBottom: '8px' }}>
                Select Size:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      minWidth: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      border: selectedSize === size ? '2px solid #1F2A44' : '1px solid #E8E2D9',
                      backgroundColor: selectedSize === size ? '#1F2A44' : '#FFF',
                      color: selectedSize === size ? '#FFF' : '#1A1A1A',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2A44' }}>Quantity:</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8E2D9', borderRadius: '8px', overflow: 'hidden' }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ border: 'none', padding: '8px 16px', background: '#F7F3EE', cursor: 'pointer', fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ padding: '8px 16px', fontWeight: 600, fontSize: '0.95rem' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ border: 'none', padding: '8px 16px', background: '#F7F3EE', cursor: 'pointer', fontWeight: 700 }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Bag CTA */}
            <div style={{ marginTop: '8px' }}>
              <button 
                onClick={handleAdd}
                className="btn-primary" 
                style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
              >
                <ShoppingBag size={20} /> Add to Bag (₹{product.price * quantity})
              </button>

              {addedToast && (
                <div style={{
                  marginTop: '10px', backgroundColor: '#E8F5E9', color: '#2E7D32',
                  padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem',
                  fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                  <Check size={16} /> Added {quantity} item(s) to your bag!
                </div>
              )}
            </div>

            {/* Care Instructions Accordion / Card */}
            {product.careInstructions && (
              <div style={{ backgroundColor: '#F7F3EE', padding: '16px', borderRadius: '12px', border: '1px solid #E8E2D9', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#1F2A44', fontSize: '0.9rem', marginBottom: '4px' }}>
                  <Info size={16} color="#C97B7B" /> Fabric Care Instructions
                </div>
                <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.4 }}>
                  {product.careInstructions}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
