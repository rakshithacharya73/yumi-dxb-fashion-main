import React from 'react';
import { ArrowRight, ShieldCheck, Heart, Truck, Award, Star, Sparkles, CheckCircle } from 'lucide-react';
import { BRAND_DETAILS } from '../data/products';

export default function Hero({ onExploreClick, onStoryClick }) {
  return (
    <section style={{ 
      backgroundColor: '#F7F3EE', 
      padding: '70px 0 60px 0', 
      borderBottom: '1px solid #E8E2D9',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Subtle Fashion Texture Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201, 123, 123, 0.18) 0%, rgba(247, 243, 238, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          
          {/* Left Text & Brand Presentation */}
          <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Top Brand Pill & Rating Star Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="badge-blush" style={{ boxShadow: '0 4px 14px rgba(201, 123, 123, 0.2)' }}>
                ✨ EST. 2024 • BY TWO SISTERS
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FFFFFF', padding: '4px 12px', borderRadius: '20px', border: '1px solid #E8E2D9', fontSize: '0.8rem', fontWeight: 700, color: '#1F2A44' }}>
                <Star size={14} fill="#D4AF37" color="#D4AF37" /> 4.9 / 5 Rating (500+ Verified Women)
              </div>
            </div>

            {/* Main Luxury Heading */}
            <h1 style={{ 
              fontSize: '3.4rem', 
              fontWeight: 800, 
              color: '#1F2A44', 
              lineHeight: 1.12, 
              letterSpacing: '-0.5px' 
            }}>
              Where Comfort Meets <span style={{ color: '#C97B7B', fontStyle: 'italic', position: 'relative' }}>
                Elegance
                <svg style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%', height: '10px' }} viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,5 100,15" stroke="#C97B7B" strokeWidth="4" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: '1.12rem', color: '#444444', maxWidth: '540px', lineHeight: 1.65 }}>
              Handcrafted luxury nightwear and elegant modest wear designed for serene nights and relaxed days. Made with skin-friendly soft cotton blend, modal, and natural rayon.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
              <button onClick={onExploreClick} className="btn-primary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
                Explore Signature Collection <ArrowRight size={18} />
              </button>
              <button onClick={onStoryClick} className="btn-secondary" style={{ padding: '15px 30px', fontSize: '1rem' }}>
                Read Our Story
              </button>
            </div>

            {/* Trust Highlights Bar */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '16px', 
              marginTop: '24px', 
              paddingTop: '24px', 
              borderTop: '1px solid #E8E2D9' 
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1F2A44', fontWeight: 800, fontSize: '0.92rem' }}>
                  <Truck size={18} color="#C97B7B" /> All-India Express
                </div>
                <span style={{ fontSize: '0.78rem', color: '#666' }}>Free shipping over ₹1,499</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1F2A44', fontWeight: 800, fontSize: '0.92rem' }}>
                  <ShieldCheck size={18} color="#C97B7B" /> Family Tested
                </div>
                <span style={{ fontSize: '0.78rem', color: '#666' }}>100% Quality Inspected</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1F2A44', fontWeight: 800, fontSize: '0.92rem' }}>
                  <Heart size={18} color="#C97B7B" /> Premium Fabrics
                </div>
                <span style={{ fontSize: '0.78rem', color: '#666' }}>Soft Cotton, Modal & Rayon</span>
              </div>
            </div>

          </div>

          {/* Right Fashion Model Image Showcase */}
          <div style={{ position: 'relative' }} className="animate-fade-up">
            
            {/* Main Visual Image Card */}
            <div style={{
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(31, 42, 68, 0.18)',
              position: 'relative',
              aspectRatio: '4/5',
              maxHeight: '540px',
              border: '2px solid #FFFFFF'
            }}>
              <img 
                src="/products/iris-garden-model.png" 
                alt="YUMI DXB High Fashion Robe & Modest Wear" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Overlay Gradient Card Footer */}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(31,42,68,0.92) 0%, rgba(31,42,68,0.4) 60%, transparent 100%)',
                padding: '36px 28px 24px 28px',
                color: '#FFF',
                display: 'flex',
                alignItems: 'flex-end',
                justify: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', letterSpacing: '1.8px', textTransform: 'uppercase', color: '#F4E8E8', fontWeight: 700 }}>
                    ✨ NEW COLLECTION • 2024
                  </span>
                  <h3 style={{ fontSize: '1.5rem', color: '#FFF', marginTop: '4px', fontWeight: 700 }}>
                    Iris & Peony Signature Line
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
                    Crafted with Soft Cotton Blend @ ₹999
                  </p>
                </div>

                <div style={{
                  backgroundColor: '#C97B7B', color: '#FFF', padding: '8px 16px', borderRadius: '20px',
                  fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(201,123,123,0.4)'
                }}>
                  ₹999
                </div>
              </div>
            </div>

            {/* Floating Quality Assurance Pill - Positioned at Bottom Left Corner Away from Face */}
            <div 
              className="animate-float"
              style={{
                position: 'absolute',
                bottom: '80px',
                left: '-28px',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '14px 20px',
                boxShadow: '0 16px 40px rgba(31,42,68,0.16)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                border: '1.5px solid #E8E2D9',
                zIndex: 10
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#F4E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} color="#C97B7B" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1F2A44' }}>100% Quality Inspected</div>
                <div style={{ fontSize: '0.78rem', color: '#666' }}>Family Tested Promise</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
