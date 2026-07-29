import React from 'react';

export default function FashionLookbook({ onCategorySelect, onSelectCategory }) {
  const handleCategorySelect = onCategorySelect || onSelectCategory;
  const lookbookItems = [
    {
      id: 1,
      title: "Soft Cotton Blend Robes",
      subtitle: "Iris Garden Line",
      image: "/products/iris-garden-model.png",
      tag: "Robes & Lounge"
    },
    {
      id: 2,
      title: "Premium Rayon Co-ords",
      subtitle: "Vintage Peony Set",
      image: "/products/lavender-grace-model.png",
      tag: "Nightwear Sets"
    },
    {
      id: 3,
      title: "Pure Organic Cotton Kaftans",
      subtitle: "Desert Rose Kaftan",
      image: "/products/desert-rose-model.png",
      tag: "Modest Kaftans"
    },
    {
      id: 4,
      title: "Breathable Satin & Modal Gowns",
      subtitle: "Ethereal Orchid",
      image: "/products/crimson-bloom-model.png",
      tag: "Luxury Satin"
    }
  ];

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '80px 0', borderBottom: '1px solid #E8E2D9' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="badge-blush">2024 EDITORIAL LOOKBOOK</span>
            <h2 style={{ fontSize: '2.4rem', color: '#1F2A44', fontWeight: 800, marginTop: '6px' }}>
              Crafted for Comfort, Designed for Grace
            </h2>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#666', maxWidth: '380px' }}>
            Explore our curated fashion lines crafted with temperature-regulating organic fabrics for everyday elegance.
          </div>
        </div>

        {/* Lookbook 4-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {lookbookItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleCategorySelect && handleCategorySelect(item.tag)}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '3/4',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid #E8E2D9',
                backgroundColor: '#F7F3EE'
              }}
              className="product-card"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                className="product-img"
              />

              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(31,42,68,0.92) 0%, rgba(31,42,68,0.4) 45%, transparent 75%)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#FFF'
              }}>
                <div>
                  <span style={{ 
                    backgroundColor: 'rgba(255,255,255,0.22)', 
                    backdropFilter: 'blur(8px)', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}>
                    {item.tag}
                  </span>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                    {item.subtitle}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px', color: '#FFF', lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
