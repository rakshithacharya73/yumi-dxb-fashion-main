import React from 'react';
import { CheckCircle2, PackageCheck, ArrowRight, ShieldCheck, Home, Eye } from 'lucide-react';
import { BRAND_DETAILS } from '../data/products';

export default function OrderConfirmationModal({ order, onClose, onViewInAdmin }) {
  if (!order) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(31, 42, 68, 0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid #E8E2D9',
        padding: '40px 36px'
      }} className="animate-fade-in">
        
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#E8F5E9',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32',
            marginBottom: '16px', boxShadow: '0 8px 20px rgba(46, 125, 50, 0.15)'
          }}>
            <CheckCircle2 size={44} />
          </div>

          <span className="badge-blush">ORDER CONFIRMED</span>
          
          <h2 style={{ fontSize: '2.2rem', color: '#1F2A44', fontWeight: 700, marginTop: '8px' }}>
            Thank You for Shopping with YUMI!
          </h2>

          <p style={{ color: '#555', fontSize: '1rem', marginTop: '6px' }}>
            We've received your order and started preparing your cozy package.
          </p>
        </div>

        {/* Order Info Card */}
        <div style={{ backgroundColor: '#F7F3EE', padding: '24px', borderRadius: '16px', border: '1px solid #E8E2D9', marginBottom: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderBottom: '1px solid #E8E2D9', paddingBottom: '16px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ORDER NUMBER</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2A44' }}>{order.orderId}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ORDER DATE & TIME</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1F2A44' }}>{order.date}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DELIVER TO</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1F2A44', marginTop: '2px' }}>{order.customerName}</div>
              <div style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.3 }}>{order.address}</div>
              <div style={{ fontSize: '0.82rem', color: '#555' }}>📞 {order.customerPhone}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PAYMENT METHOD</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1F2A44', marginTop: '2px' }}>{order.paymentMethod}</div>
              <div style={{ fontSize: '0.82rem', color: order.paymentStatus.includes('Paid') ? '#2E7D32' : '#C97B7B', fontWeight: 600 }}>
                Status: {order.paymentStatus}
              </div>
            </div>
          </div>

        </div>

        {/* Purchased Items List */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '1rem', color: '#1F2A44', fontWeight: 700, marginBottom: '12px' }}>Items Ordered:</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#FFF', border: '1px solid #F0ECE6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={item.images[0]} alt="" style={{ width: '44px', height: '54px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2A44' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#666' }}>Size: {item.selectedSize} | Fabric: {item.fabric} | Qty: {item.quantity}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2A44' }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #E8E2D9', fontSize: '1.15rem', fontWeight: 700, color: '#1F2A44' }}>
            <span>Total Paid Amount:</span>
            <span style={{ color: '#1F2A44' }}>₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={onClose} 
            className="btn-primary" 
            style={{ flex: 1, padding: '14px' }}
          >
            <Home size={18} /> Return to Storefront
          </button>
          
          {onViewInAdmin && (
            <button 
              onClick={onViewInAdmin} 
              className="btn-secondary" 
              style={{ flex: 1, padding: '14px' }}
            >
              <Eye size={18} /> View in Admin Dashboard
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
