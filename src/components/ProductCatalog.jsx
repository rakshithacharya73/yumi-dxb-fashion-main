import React from 'react';
import { Eye, Star, Filter, Heart } from 'lucide-react';

export default function ProductCatalog({ 
  products, 
  onSelectProduct, 
  onAddToCart,
  searchQuery,
  setSearchQuery,
  wishlistIds = [],
  onToggleWishlist,
  currentUser,
  showWishlistOnly = false,
  setShowWishlistOnly
}) {
  const [selectedFabric, setSelectedFabric] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('featured');

  // Extract unique fabric categories
  const fabrics = ['All', ...new Set(products.map(p => p.fabric))];

  // Filter & Sort
  const filteredProducts = products.filter(product => {
    const matchesWishlist = !showWishlistOnly || wishlistIds.includes(product.id);
    const matchesFabric = selectedFabric === 'All' || product.fabric === selectedFabric;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWishlist && matchesFabric && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <section id="collections-section" style={{ backgroundColor: '#F7F3EE', padding: '60px 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#C97B7B' }}>
            {showWishlistOnly ? 'YOUR SAVED FAVORITES' : 'PREMIUM NIGHTWEAR & MODEST WEAR'}
          </span>
          <h2 style={{ fontSize: '2.4rem', color: '#1F2A44', fontWeight: 700, marginTop: '4px' }}>
            {showWishlistOnly ? 'My Wishlist Collection' : 'Our Signature Collection'}
          </h2>
        </div>

        {/* Filters & Sorting Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          padding: '16px 24px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px',
          border: '1px solid #E8E2D9'
        }}>
          
          {/* Fabric & Wishlist Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => {
                if (setShowWishlistOnly) {
                  setShowWishlistOnly(!showWishlistOnly);
                }
              }}
              style={{
                backgroundColor: showWishlistOnly ? '#C97B7B' : '#FFF0F0',
                color: showWishlistOnly ? '#FFFFFF' : '#C97B7B',
                border: '1.5px solid #C97B7B',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                marginRight: '8px'
              }}
              title="Show only items in your wishlist"
            >
              <Heart size={14} fill={showWishlistOnly ? "#FFF" : "#C97B7B"} color={showWishlistOnly ? "#FFF" : "#C97B7B"} />
              {showWishlistOnly ? 'Wishlist View Active' : `Saved Wishlist (${wishlistIds.length})`}
            </button>

            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2A44', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}>
              <Filter size={16} color="#C97B7B" /> Fabric:
            </span>
            {fabrics.map(fabric => (
              <button
                key={fabric}
                onClick={() => {
                  setSelectedFabric(fabric);
                  if (showWishlistOnly && setShowWishlistOnly) {
                    setShowWishlistOnly(false);
                  }
                }}
                style={{
                  backgroundColor: (!showWishlistOnly && selectedFabric === fabric) ? '#1F2A44' : '#F7F3EE',
                  color: (!showWishlistOnly && selectedFabric === fabric) ? '#FFFFFF' : '#1A1A1A',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: (!showWishlistOnly && selectedFabric === fabric) ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {fabric}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {searchQuery && (
              <span style={{ fontSize: '0.85rem', color: '#C97B7B', fontWeight: 600 }}>
                Showing results for "{searchQuery}"
              </span>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #E8E2D9',
                backgroundColor: '#F7F3EE',
                color: '#1F2A44',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Wishlist Active Banner */}
        {showWishlistOnly && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#FFF0F0', border: '1.5px solid #C97B7B', padding: '16px 24px',
            borderRadius: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={22} fill="#C97B7B" color="#C97B7B" />
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2A44', margin: 0 }}>
                  Your Saved Wishlist ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})
                </h4>
                <span style={{ fontSize: '0.82rem', color: '#666' }}>Showing products you've saved to your wishlist</span>
              </div>
            </div>
            <button
              onClick={() => { if (setShowWishlistOnly) setShowWishlistOnly(false); }}
              style={{
                backgroundColor: '#1F2A44', color: '#FFF', border: 'none',
                padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Show All Products
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid #E8E2D9' }}>
            {showWishlistOnly ? (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FFF0F0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Heart size={32} color="#C97B7B" fill="#C97B7B" />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#1F2A44', fontWeight: 700 }}>Your Wishlist is Empty</h3>
                <p style={{ fontSize: '0.95rem', color: '#666', marginTop: '6px', maxWidth: '450px', margin: '6px auto 20px auto' }}>
                  You haven't saved any items to your wishlist yet. Click the heart icon on any product card to save your favorites!
                </p>
                <button 
                  onClick={() => { if (setShowWishlistOnly) setShowWishlistOnly(false); setSelectedFabric('All'); setSearchQuery(''); }}
                  className="btn-primary"
                >
                  Explore All Products
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>No products found matching your filter criteria.</p>
                <button 
                  onClick={() => { setSelectedFabric('All'); setSearchQuery(''); if (setShowWishlistOnly) setShowWishlistOnly(false); }}
                  className="btn-secondary"
                  style={{ marginTop: '16px' }}
                >
                  Reset Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div 
            className="products-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '28px'
            }}
          >

            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid #E8E2D9',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'var(--transition)',
                  position: 'relative'
                }}
                className="product-card"
              >
                
                {/* Badge */}
                {product.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#1F2A44',
                    color: '#FFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    zIndex: 3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {product.badge}
                  </div>
                )}

                {/* Wishlist Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleWishlist) onToggleWishlist(product);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: wishlistIds.includes(product.id) ? '#FFF0F0' : 'rgba(255, 255, 255, 0.95)',
                    border: wishlistIds.includes(product.id) ? '1.5px solid #C97B7B' : '1px solid rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 4,
                    boxShadow: wishlistIds.includes(product.id) ? '0 6px 16px rgba(201, 123, 123, 0.4)' : '0 4px 12px rgba(0,0,0,0.12)',
                    transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: wishlistIds.includes(product.id) ? 'scale(1.08)' : 'scale(1)'
                  }}
                  className="wishlist-btn-heart"
                  title={wishlistIds.includes(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart 
                    size={20} 
                    fill={wishlistIds.includes(product.id) ? "#C97B7B" : "none"} 
                    color={wishlistIds.includes(product.id) ? "#C97B7B" : "#1F2A44"} 
                    style={{
                      display: 'block',
                      flexShrink: 0,
                      margin: 'auto',
                      transition: 'transform 0.2s ease',
                      filter: wishlistIds.includes(product.id) ? 'drop-shadow(0 2px 4px rgba(201, 123, 123, 0.4))' : 'none'
                    }}
                  />
                </button>

                {/* Product Image Box */}
                <div 
                  onClick={() => onSelectProduct(product)}
                  style={{
                    position: 'relative',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: '#F7F3EE'
                  }}
                >
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    className="product-img"
                  />

                  {/* Quick Overlay Action */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(31, 42, 68, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }} className="card-hover-overlay">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectProduct(product); }}
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#1F2A44',
                        border: 'none',
                        borderRadius: '50%',
                        width: '42px',
                        height: '42px',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      title="Quick View"
                      className="quick-view-btn"
                    >
                      <Eye size={20} style={{ display: 'block', flexShrink: 0, margin: 'auto' }} />
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="badge-blush" style={{ fontSize: '0.7rem' }}>{product.fabric}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600 }}>
                        <Star size={14} fill="#D4AF37" color="#D4AF37" /> {product.rating}
                      </div>
                    </div>

                    <h3 
                      onClick={() => onSelectProduct(product)}
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#1F2A44',
                        marginBottom: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {product.name}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.4, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Add to Bag */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F0ECE6' }}>
                    <div>
                      <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1F2A44' }}>₹{product.price}</span>
                      {product.originalPrice && (
                        <span style={{ fontSize: '0.85rem', color: '#999', textDecoration: 'line-through', marginLeft: '6px' }}>
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => onSelectProduct(product)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Eye size={16} /> View Details
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
