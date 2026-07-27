import React from 'react';
import { Heart, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BRAND_DETAILS } from '../data/products';

export default function Story() {
  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '80px 0', borderBottom: '1px solid #E8E2D9' }}>
      <div className="container">
        
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#C97B7B" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#C97B7B' }}>
              OUR BRAND STORY
            </span>
            <Sparkles size={18} color="#C97B7B" />
          </div>

          <h2 style={{ fontSize: '2.5rem', color: '#1F2A44', fontWeight: 700 }}>
            Crafted by Sisters, Made for Your Warmest Moments
          </h2>

          <p style={{ fontSize: '1.15rem', color: '#444444', lineHeight: 1.8, fontStyle: 'italic', fontFamily: 'Playfair Display, serif' }}>
            "{BRAND_DETAILS.story}"
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginTop: '40px',
            textAlign: 'left'
          }}>
            
            <div style={{ backgroundColor: '#F7F3EE', padding: '24px', borderRadius: '16px', border: '1px solid #E8E2D9' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F4E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Heart size={22} color="#C97B7B" />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: '#1F2A44', marginBottom: '8px', fontWeight: 700 }}>The Sisterhood Touch</h4>
              <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.5 }}>
                Founded in 2024 by two sisters passionate about modest fashion that feels cozy, breathable, and gracefully styled.
              </p>
            </div>

            <div style={{ backgroundColor: '#F7F3EE', padding: '24px', borderRadius: '16px', border: '1px solid #E8E2D9' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F4E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={22} color="#C97B7B" />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: '#1F2A44', marginBottom: '8px', fontWeight: 700 }}>Family First Guarantee</h4>
              <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.5 }}>
                Every stitch, button, and fabric weave is evaluated personally. If we wouldn't wear it ourselves, it will never enter our store.
              </p>
            </div>

            <div style={{ backgroundColor: '#F7F3EE', padding: '24px', borderRadius: '16px', border: '1px solid #E8E2D9' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F4E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <CheckCircle2 size={22} color="#C97B7B" />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: '#1F2A44', marginBottom: '8px', fontWeight: 700 }}>Pure Breathable Luxury</h4>
              <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.5 }}>
                We curate only skin-friendly organic cottons, natural rayon, modal, and ultra-smooth satin finishes suitable for everyday warmth.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
