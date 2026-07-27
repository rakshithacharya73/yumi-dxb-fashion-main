import React, { useState, useEffect } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Truck, UserCheck, Lock } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartItems, onCompleteOrder, currentUser }) {
  const [checkoutMode, setCheckoutMode] = useState(currentUser ? 'account' : 'guest');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    paymentMethod: 'UPI'
  });

  useEffect(() => {
    if (currentUser) {
      setCheckoutMode('account');
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        address: currentUser.address || prev.address
      }));
    } else {
      setCheckoutMode('guest');
    }
  }, [currentUser, isOpen]);


  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 1499 ? 0 : 99;
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      orderId: `YUMI-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString(),
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      items: cartItems,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'COD' ? 'Pending (COD)' : 'Paid Online',
      orderStatus: 'Processing',
      checkoutType: checkoutMode
    };

    onCompleteOrder(newOrder);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(31, 42, 68, 0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid #E8E2D9'
      }} className="animate-fade-in">
        
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #E8E2D9',
          backgroundColor: '#F7F3EE',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span className="badge-blush">SECURE CHECKOUT</span>
            <h2 style={{ fontSize: '1.6rem', color: '#1F2A44', fontWeight: 700, marginTop: '4px' }}>
              Delivery & Payment Details
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A1A1A' }}>
            <X size={24} />
          </button>
        </div>

        {/* Checkout Option Toggle (Guest vs Registered) */}
        <div style={{ padding: '16px 32px', borderBottom: '1px solid #F0ECE6', backgroundColor: '#FFF', display: 'flex', gap: '16px' }}>
          <button
            type="button"
            onClick={() => setCheckoutMode('guest')}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              border: checkoutMode === 'guest' ? '2px solid #1F2A44' : '1px solid #E8E2D9',
              backgroundColor: checkoutMode === 'guest' ? '#F7F3EE' : '#FFF',
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <UserCheck size={18} color="#C97B7B" /> Guest Checkout (Quick)
          </button>
          
          <button
            type="button"
            onClick={() => setCheckoutMode('account')}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              border: checkoutMode === 'account' ? '2px solid #1F2A44' : '1px solid #E8E2D9',
              backgroundColor: checkoutMode === 'account' ? '#F7F3EE' : '#FFF',
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <Lock size={18} color="#1F2A44" /> YUMI Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            {/* Left Column: Customer & Shipping Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1F2A44', borderBottom: '1px solid #E8E2D9', paddingBottom: '8px', fontWeight: 700 }}>
                1. Shipping Information
              </h3>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Mobile Number</label>
                  <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Street Address / Flat No.</label>
                <textarea 
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#444' }}>City</label>
                  <input 
                    type="text" 
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#444' }}>State</label>
                  <input 
                    type="text" 
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#444' }}>Pincode</label>
                  <input 
                    type="text" 
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Payment Method & Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <h3 style={{ fontSize: '1.1rem', color: '#1F2A44', borderBottom: '1px solid #E8E2D9', paddingBottom: '8px', fontWeight: 700 }}>
                2. Select Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'UPI', label: 'UPI / GooglePay / PhonePe', desc: 'Instant & Secure Gateway' },
                  { id: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay when package arrives' },
                  { id: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay' },
                  { id: 'NETBANKING', label: 'NetBanking', desc: 'All Major Indian Banks' }
                ].map((pm) => (
                  <label 
                    key={pm.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                      borderRadius: '12px', border: formData.paymentMethod === pm.id ? '2px solid #C97B7B' : '1px solid #E8E2D9',
                      backgroundColor: formData.paymentMethod === pm.id ? '#F4E8E8' : '#FFF',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={formData.paymentMethod === pm.id}
                      onChange={() => setFormData({...formData, paymentMethod: pm.id})}
                    />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2A44' }}>{pm.label}</div>
                      <div style={{ fontSize: '0.78rem', color: '#666' }}>{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Order Amount Breakdown Box */}
              <div style={{ backgroundColor: '#F7F3EE', padding: '16px', borderRadius: '12px', border: '1px solid #E8E2D9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555', marginBottom: '6px' }}>
                  <span>Items Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555', marginBottom: '8px' }}>
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <strong style={{ color: '#2E7D32' }}>FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, color: '#1F2A44', paddingTop: '8px', borderTop: '1px dashed #CCC' }}>
                  <span>Total Payable</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '8px' }}
              >
                <ShieldCheck size={20} /> Complete Order (₹{totalAmount})
              </button>

            </div>

          </div>
        </form>

      </div>

    </div>
  );
}
