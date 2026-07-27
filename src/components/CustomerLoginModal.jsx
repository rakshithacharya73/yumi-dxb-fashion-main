import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DB } from '../services/db';

export default function CustomerLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!formData.email || !formData.password) {
          setError('Please enter your email and password');
          setLoading(false);
          return;
        }

        const res = await DB.loginCustomer(formData.email, formData.password);
        if (!res.success) {
          setError(res.message);
          setLoading(false);
          return;
        }

        setSuccessMsg(`Welcome back, ${res.user.name}! Logged in successfully.`);
        setTimeout(() => {
          onLoginSuccess(res.user);
          onClose();
          setSuccessMsg('');
          setLoading(false);
        }, 1000);
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        const res = await DB.registerCustomer({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address
        });

        if (!res.success) {
          setError(res.message);
          setLoading(false);
          return;
        }

        setSuccessMsg(`Account created successfully! Welcome to YUMI DXB, ${res.user.name}.`);
        setTimeout(() => {
          onLoginSuccess(res.user);
          onClose();
          setSuccessMsg('');
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };


  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(31, 42, 68, 0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '440px', width: '100%',
        padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '20px', right: '20px', background: '#F7F3EE',
            border: 'none', borderRadius: '50%', width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <X size={18} color="#1F2A44" />
        </button>

        {/* Modal Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(201, 123, 123, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto'
          }}>
            <User size={28} color="#C97B7B" />
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#1F2A44', marginBottom: '4px' }}>
            {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            {mode === 'login' ? 'Access your saved addresses, wishlists, and orders' : 'Join YUMI DXB for exclusive rewards & easy checkout'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div style={{
          display: 'flex', backgroundColor: '#F7F3EE', borderRadius: '12px', padding: '4px', marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem',
              backgroundColor: mode === 'login' ? '#FFFFFF' : 'transparent',
              color: mode === 'login' ? '#1F2A44' : '#666',
              boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem',
              backgroundColor: mode === 'register' ? '#FFFFFF' : 'transparent',
              color: mode === 'register' ? '#1F2A44' : '#666',
              boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FFEEEE', color: '#CC0000', padding: '10px 14px', borderRadius: '10px',
            fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            backgroundColor: '#EEF9F0', color: '#2E7D32', padding: '10px 14px', borderRadius: '10px',
            fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'
          }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2A44', display: 'block', marginBottom: '4px' }}>Full Name *</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2D9CF', borderRadius: '10px', padding: '8px 12px' }}>
                <User size={16} color="#999" style={{ marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="e.g. Ananya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2A44', display: 'block', marginBottom: '4px' }}>Email Address *</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2D9CF', borderRadius: '10px', padding: '8px 12px' }}>
              <Mail size={16} color="#999" style={{ marginRight: '8px' }} />
              <input
                type="email"
                placeholder="ananya@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2A44', display: 'block', marginBottom: '4px' }}>Password *</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2D9CF', borderRadius: '10px', padding: '8px 12px' }}>
              <Lock size={16} color="#999" style={{ marginRight: '8px' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2A44', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2D9CF', borderRadius: '10px', padding: '8px 12px' }}>
                  <Phone size={16} color="#999" style={{ marginRight: '8px' }} />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2A44', display: 'block', marginBottom: '4px' }}>Delivery Address</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2D9CF', borderRadius: '10px', padding: '8px 12px' }}>
                  <MapPin size={16} color="#999" style={{ marginRight: '8px' }} />
                  <input
                    type="text"
                    placeholder="House / Flat No., Street, City, Pincode"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#8892A2' : '#1F2A44', color: '#FFFFFF', border: 'none', padding: '12px',
              borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px', transition: 'all 0.2s'
            }}
          >
            {loading 
              ? (mode === 'login' ? 'Authenticating...' : 'Creating Account...') 
              : (mode === 'login' ? 'Sign In to Account' : 'Complete Registration')}
          </button>

        </form>

        <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '0.78rem', color: '#888' }}>
          <ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
          Protected by YUMI DXB SSL Encryption & Privacy Guard
        </div>
      </div>
    </div>
  );
}
