import React from 'react';
import { Star, Quote, ShieldCheck, Heart } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      id: 1,
      name: "Fatima Khan",
      location: "Mumbai, Maharashtra",
      rating: 5,
      product: "Iris Garden Robe (Soft Cotton Blend)",
      quote: "The fabric quality is unreal! Soft, breathable, and so comfortable for lounging. You can truly tell it was designed with love and family quality in mind."
    },
    {
      id: 2,
      name: "Ananya Deshmukh",
      location: "Pune, Maharashtra",
      rating: 5,
      product: "Vintage Peony Set (Premium Rayon)",
      quote: "Finally a brand that offers modest, comfortable nightwear without compromising on style. The vintage peony design is gorgeous and washes so well!"
    },
    {
      id: 3,
      name: "Zainab Sheikh",
      location: "Hyderabad, Telangana",
      rating: 5,
      product: "Desert Rose Kaftan (Pure Cotton)",
      quote: "The pure cotton fabric feels lightweight and elegant. Quick doorstep delivery across India. I have already recommended YUMI to my sisters!"
    }
  ];

  return (
    <section style={{ backgroundColor: '#F7F3EE', padding: '70px 0', borderBottom: '1px solid #E8E2D9' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-blush">LOVED BY WOMEN ACROSS INDIA</span>
          <h2 style={{ fontSize: '2.5rem', color: '#1F2A44', fontWeight: 800, marginTop: '8px' }}>
            What Our Customers Say
          </h2>
          <p style={{ color: '#666', fontSize: '1rem', marginTop: '6px' }}>
            Real reviews from women who chose comfort, elegance, and quality.
          </p>
        </div>

        {/* Review Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '28px'
        }}>
          {reviews.map((r) => (
            <div 
              key={r.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '32px 28px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid #E8E2D9',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative'
              }}
              className="product-card"
            >
              <div>
                {/* Rating Stars */}
                <div style={{ display: 'flex', gap: '4px', color: '#D4AF37', marginBottom: '16px' }}>
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>

                <p style={{ fontSize: '0.98rem', color: '#333', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '20px' }}>
                  "{r.quote}"
                </p>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid #F0ECE6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2A44' }}>{r.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: '#777' }}>📍 {r.location}</span>
                </div>

                <span style={{ fontSize: '0.72rem', backgroundColor: '#F4E8E8', color: '#C97B7B', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  Verified Purchase
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
