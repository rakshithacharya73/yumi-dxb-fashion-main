import React from 'react';
import { Eye, ShoppingBag, Star, Filter, Search, Sparkles } from 'lucide-react';

export default function ProductCatalog({ 
  products, 
  onSelectProduct, 
  onAddToCart,
  searchQuery,
  setSearchQuery
}) {
  const [selectedFabric, setSelectedFabric] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('featured');

  // Extract unique fabric categories
  const fabrics = ['All', ...new Set(products.map(p => p.fabric))];

  // Filter & Sort
  const filteredProducts = products.filter(product => {
    const matchesFabric = selectedFabric === 'All' || product.fabric === selectedFabric;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFabric && matchesSearch;
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
            PREMIUM NIGHTWEAR & MODEST WEAR
          </span>
          <h2 style={{ fontSize: '2.4rem', color: '#1F2A44', fontWeight: 700, marginTop: '4px' }}>
            Our Signature Collection
          </h2>
          <p style={{ color: '#666', fontSize: '1rem', marginTop: '6px' }}>
            Thoughtfully crafted with comfort, quality, and timeless modesty in mind.
          </p>
        </div>

        {/* Filters & Sorting Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justify: 'space-between',
          backgroundColor: '#FFFFFF',
          padding: '16px 24px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px',
          border: '1px solid #E8E2D9'
        }}>
          
          {/* Fabric Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2A44', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}>
              <Filter size={16} color="#C97B7B" /> Fabric:
            </span>
            {fabrics.map(fabric => (
              <button
                key={fabric}
                onClick={() => setSelectedFabric(fabric)}
                style={{
                  backgroundColor: selectedFabric === fabric ? '#1F2A44' : '#F7F3EE',
                  color: selectedFabric === fabric ? '#FFFFFF' : '#1A1A1A',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: selectedFabric === fabric ? 600 : 400,
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

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFF', borderRadius: '16px' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>No products found matching your filter criteria.</p>
            <button 
              onClick={() => { setSelectedFabric('All'); setSearchQuery(''); }}
              className="btn-secondary"
              style={{ marginTop: '16px' }}
            >
              Reset Filters
            </button>
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
                    zIndex: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {product.badge}
                  </div>
                )}

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
                    justify: 'center',
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
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      title="Quick View"
                    >
                      <Eye size={20} />
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
                      onClick={() => onAddToCart(product, product.sizes[0] || 'M')}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px' }}
                    >
                      <ShoppingBag size={16} /> Add to Bag
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
