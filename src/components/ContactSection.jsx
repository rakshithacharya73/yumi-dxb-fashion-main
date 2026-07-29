import React, { useState } from 'react';
import { Mail, Send, Sparkles, CheckCircle2, MapPin, AlertCircle } from 'lucide-react';
import { BRAND_DETAILS } from '../data/products';
import { DB } from '../services/db';
import { EmailService, validateEmail } from '../services/emailService';

const InstagramIcon = ({ size = 22, color = "#C97B7B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ContactSection() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateEmail(formState.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    DB.saveContactMessage(formState);
    await EmailService.sendSupportMessage(formState);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', message: '' });
    }, 4000);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!validateEmail(newsletterEmail)) {
      alert('Please enter a valid email address for newsletter subscription.');
      return;
    }
    DB.saveSubscriber(newsletterEmail);
    setNewsletterSubscribed(true);
    setTimeout(() => setNewsletterSubscribed(false), 4000);
    setNewsletterEmail('');
  };

  return (
    <section id="contact-section" style={{ backgroundColor: '#FFFFFF', padding: '80px 0', borderTop: '1px solid #E8E2D9' }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'flex-start'
        }}>
          
          {/* Left Column: Contact & Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div>
              <span className="badge-blush">WE'D LOVE TO HEAR FROM YOU</span>
              <h2 style={{ fontSize: '2.4rem', color: '#1F2A44', fontWeight: 700, marginTop: '8px' }}>
                Get in Touch with YUMI
              </h2>
              <p style={{ color: '#555', fontSize: '1rem', marginTop: '8px', lineHeight: 1.6 }}>
                Have questions about sizes, fabrics, custom orders, or shipping? Send us a message or connect with us directly on Instagram.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: '#F7F3EE', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E8E2D9' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F4E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <InstagramIcon size={22} color="#C97B7B" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>INSTAGRAM</div>
                  <a href={`https://instagram.com/yumi_dxb`} target="_blank" rel="noreferrer" style={{ fontSize: '1rem', fontWeight: 700, color: '#1F2A44', textDecoration: 'none' }}>
                    {BRAND_DETAILS.instagram}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: '#F7F3EE', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E8E2D9' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F4E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} color="#C97B7B" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMAIL SUPPORT</div>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1F2A44' }}>
                    hello@yumidxb.com
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: '#F7F3EE', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E8E2D9' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F4E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={22} color="#C97B7B" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DELIVERY AREA</div>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1F2A44' }}>
                    Pan-India Shipping & Express Delivery
                  </span>
                </div>
              </div>

            </div>

            {/* Newsletter Subscription Box */}
            <div style={{ backgroundColor: '#1F2A44', color: '#FFF', padding: '28px', borderRadius: '20px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} color="#C97B7B" />
                <h4 style={{ fontSize: '1.1rem', color: '#FFF', fontWeight: 700 }}>Join the YUMI Circle</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
                Subscribe for exclusive preview launches, silk care tips, and early bird discounts on new collections.
              </p>
              
              <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: 'none', outline: 'none', fontSize: '0.88rem' }}
                />
                <button type="submit" className="btn-accent" style={{ padding: '10px 18px', borderRadius: '8px', fontSize: '0.88rem' }}>
                  Subscribe
                </button>
              </form>

              {newsletterSubscribed && (
                <div style={{ marginTop: '12px', color: '#E8F5E9', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#A5D6A7" /> Thank you! You're subscribed to the YUMI newsletter.
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div style={{ backgroundColor: '#F7F3EE', padding: '36px', borderRadius: '20px', border: '1px solid #E8E2D9' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#1F2A44', fontWeight: 700, marginBottom: '6px' }}>
              Send Us a Direct Message
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '24px' }}>
              We usually respond within a few hours on business days!
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({...formState, name: e.target.value})}
                  placeholder="e.g. Fatima Khan"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({...formState, email: e.target.value})}
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Your Message</label>
                <textarea 
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  placeholder="How can we help you today?"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none', resize: 'none' }}
                />
              </div>

              {errorMsg && (
                <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #FFCDD2' }}>
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '0.98rem', marginTop: '8px' }}>
                <Send size={18} /> Send Message
              </button>

              {submitted && (
                <div style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '12px', borderRadius: '8px', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} /> Thank you! Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
