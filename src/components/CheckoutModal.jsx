import React, { useState, useEffect } from 'react';
import { 
  X, CreditCard, ShieldCheck, CheckCircle2, Truck, UserCheck, Lock, 
  Trash2, ArrowLeft, ShoppingBag, AlertCircle, Smartphone, Building2, RefreshCw
} from 'lucide-react';
import { PaymentGateway } from '../services/paymentGateway';
import { EmailService, validateEmail } from '../services/emailService';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onCompleteOrder, 
  onReturnToCart, 
  currentUser 
}) {
  const [checkoutMode, setCheckoutMode] = useState(currentUser ? 'account' : 'guest');
  const [upiApp, setUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [showItemSummary, setShowItemSummary] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationOutcome, setSimulationOutcome] = useState('success'); // 'success' | 'failure' | 'cancelled'
  const [checkoutError, setCheckoutError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    paymentMethod: 'UPI',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    selectedBank: 'HDFC'
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
  const shippingFee = subtotal >= 1499 || subtotal === 0 ? 0 : 99;
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setCheckoutError('');

    if (!validateEmail(formData.email)) {
      setCheckoutError('Please provide a valid email address for order confirmation.');
      return;
    }

    setIsProcessing(true);

    if (formData.paymentMethod === 'COD') {
      setTimeout(async () => {
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
          paymentMethod: 'COD',
          paymentStatus: 'Pending (Cash on Delivery)',
          orderStatus: 'Processing',
          checkoutType: checkoutMode
        };

        await EmailService.sendOrderConfirmation(newOrder);
        setIsProcessing(false);
        onCompleteOrder(newOrder);
      }, 800);
      return;
    }

    // Process through Modular Payment Gateway Service
    const payResult = await PaymentGateway.processPayment({
      amount: totalAmount,
      paymentMethod: formData.paymentMethod,
      simulationOutcome,
      customerDetails: formData
    });

    setIsProcessing(false);

    if (payResult.cancelled) {
      setCheckoutError('⚠️ Payment process was cancelled by user. You can try again or select Cash on Delivery.');
      return;
    }

    if (!payResult.success) {
      setCheckoutError(`❌ Payment Failed: ${payResult.errorMessage}`);
      return;
    }

    // Payment Successful
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
      paymentStatus: `Paid Online (${payResult.transactionId})`,
      orderStatus: 'Processing',
      checkoutType: checkoutMode,
      transactionId: payResult.transactionId
    };

    await EmailService.sendOrderConfirmation(newOrder);
    onCompleteOrder(newOrder);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20000,
      backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        border: '1px solid #E8E2D9'
      }} className="animate-fade-in">
        
        {/* Top Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #E8E2D9',
          backgroundColor: '#1F2A44',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onReturnToCart && (
              <button 
                type="button"
                onClick={onReturnToCart} 
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)', border: 'none', color: '#FFF',
                  borderRadius: '20px', padding: '6px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600
                }}
                title="Return to Cart"
              >
                <ArrowLeft size={16} /> Back to Bag
              </button>
            )}
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '1px', color: '#C97B7B', fontWeight: 800, textTransform: 'uppercase' }}>
                SECURE 256-BIT CHECKOUT
              </span>
              <h2 style={{ fontSize: '1.45rem', color: '#FFFFFF', fontWeight: 700, margin: 0 }}>
                Checkout & Payment
              </h2>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF' }}
            title="Cancel Checkout"
          >
            <X size={20} />
          </button>
        </div>

        {/* Empty Cart Handling during Checkout */}
        {cartItems.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <ShoppingBag size={56} color="#C97B7B" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.4rem', color: '#1F2A44', fontWeight: 700 }}>Your bag is empty</h3>
            <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '8px', maxWidth: '420px', margin: '8px auto 24px auto' }}>
              All items were removed. Add items to your bag to proceed with your order.
            </p>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-primary" 
              style={{ padding: '14px 28px' }}
            >
              Return to Catalog
            </button>
          </div>
        ) : (
          <>
            {/* Guest vs Registered Account Mode Banner */}
            <div style={{ padding: '14px 28px', borderBottom: '1px solid #F0ECE6', backgroundColor: '#FBF8F5', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setCheckoutMode('guest')}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: '12px',
                  border: checkoutMode === 'guest' ? '2px solid #C97B7B' : '1px solid #E8E2D9',
                  backgroundColor: checkoutMode === 'guest' ? '#FFF' : '#F7F3EE',
                  color: checkoutMode === 'guest' ? '#1F2A44' : '#666',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <UserCheck size={16} color="#C97B7B" /> Guest Checkout (Quick)
              </button>
              
              <button
                type="button"
                onClick={() => setCheckoutMode('account')}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: '12px',
                  border: checkoutMode === 'account' ? '2px solid #1F2A44' : '1px solid #E8E2D9',
                  backgroundColor: checkoutMode === 'account' ? '#FFF' : '#F7F3EE',
                  color: checkoutMode === 'account' ? '#1F2A44' : '#666',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Lock size={16} color="#1F2A44" /> YUMI Account
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
              
              {/* Order Items & Live Cancellation Section */}
              <div style={{
                backgroundColor: '#F9F6F0', borderRadius: '16px', border: '1px solid #E8E2D9',
                padding: '16px', marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showItemSummary ? '14px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#1F2A44', fontSize: '0.98rem' }}>
                    <ShoppingBag size={18} color="#C97B7B" />
                    <span>Review & Modify Order Items ({cartItems.length})</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowItemSummary(!showItemSummary)}
                    style={{ background: 'none', border: 'none', color: '#C97B7B', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    {showItemSummary ? 'Hide Items' : 'Show Items'}
                  </button>
                </div>

                {showItemSummary && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                    {cartItems.map((item) => (
                      <div 
                        key={`${item.id}-${item.selectedSize}`}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '12px',
                          border: '1px solid #E8E2D9', gap: '12px', flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1F2A44' }}>{item.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#666' }}>
                              Size: <strong>{item.selectedSize}</strong> | Fabric: {item.fabric}
                            </div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#C97B7B', marginTop: '2px' }}>
                              ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* Quantity selector inside Checkout */}
                          {onUpdateQuantity && (
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8E2D9', borderRadius: '6px', overflow: 'hidden' }}>
                              <button 
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                style={{ border: 'none', width: '24px', height: '24px', background: '#F7F3EE', cursor: 'pointer', fontWeight: 700 }}
                              >
                                -
                              </button>
                              <span style={{ padding: '0 8px', fontSize: '0.82rem', fontWeight: 700 }}>{item.quantity}</span>
                              <button 
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                style={{ border: 'none', width: '24px', height: '24px', background: '#F7F3EE', cursor: 'pointer', fontWeight: 700 }}
                              >
                                +
                              </button>
                            </div>
                          )}

                          {/* Explicit Item Cancellation / Removal button */}
                          {onRemoveItem && (
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id, item.selectedSize)}
                              style={{
                                backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none',
                                borderRadius: '8px', padding: '6px 10px', fontSize: '0.75rem', fontWeight: 700,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
                              }}
                              title="Cancel this item from checkout"
                            >
                              <Trash2 size={14} /> Remove Item
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Grid: Form Left, Payment & Summary Right */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
                
                {/* Left Column: Delivery Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#1F2A44', borderBottom: '2px solid #C97B7B', paddingBottom: '6px', fontWeight: 700 }}>
                    1. Delivery Address
                  </h3>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1F2A44' }}>Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Priya Sharma"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1F2A44' }}>Email *</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="priya@example.com"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1F2A44' }}>Mobile Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+91 98765 43210"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1F2A44' }}>Street Address / Landmark *</label>
                    <textarea 
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Flat No, Building, Street Name"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D5CEC4', marginTop: '4px', outline: 'none', resize: 'none', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F2A44' }}>City</label>
                      <input 
                        type="text" 
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F2A44' }}>State</label>
                      <input 
                        type="text" 
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F2A44' }}>Pincode</label>
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

                {/* Right Column: Payment Selection & Totals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  
                  <h3 style={{ fontSize: '1.05rem', color: '#1F2A44', borderBottom: '2px solid #C97B7B', paddingBottom: '6px', fontWeight: 700 }}>
                    2. Select Payment Method
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm / BHIM)', desc: 'Instant 1-Click Payment' },
                      { id: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay Cash / UPI upon doorstep delivery' },
                      { id: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                      { id: 'NETBANKING', label: 'NetBanking', desc: 'HDFC, ICICI, SBI & major banks' }
                    ].map((pm) => (
                      <label 
                        key={pm.id}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px',
                          borderRadius: '12px', border: formData.paymentMethod === pm.id ? '2px solid #C97B7B' : '1px solid #E8E2D9',
                          backgroundColor: formData.paymentMethod === pm.id ? '#FFF5F5' : '#FFF',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={formData.paymentMethod === pm.id}
                          onChange={() => setFormData({...formData, paymentMethod: pm.id})}
                          style={{ marginTop: '4px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1F2A44' }}>{pm.label}</div>
                          <div style={{ fontSize: '0.76rem', color: '#666' }}>{pm.desc}</div>

                          {/* Extra UPI inputs */}
                          {formData.paymentMethod === 'UPI' && pm.id === 'UPI' && (
                            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E8E2D9' }}>
                              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                                {['gpay', 'phonepe', 'paytm', 'bhim'].map(app => (
                                  <button
                                    key={app}
                                    type="button"
                                    onClick={() => setUpiApp(app)}
                                    style={{
                                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700,
                                      border: upiApp === app ? '1.5px solid #C97B7B' : '1px solid #D5CEC4',
                                      backgroundColor: upiApp === app ? '#F4E8E8' : '#F7F3EE',
                                      textTransform: 'uppercase', cursor: 'pointer'
                                    }}
                                  >
                                    {app}
                                  </button>
                                ))}
                              </div>
                              <input 
                                type="text"
                                placeholder="Enter VPA / UPI ID (e.g. mobile@upi)"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #D5CEC4', fontSize: '0.8rem' }}
                              />
                            </div>
                          )}

                          {/* Extra Card inputs */}
                          {formData.paymentMethod === 'CARD' && pm.id === 'CARD' && (
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E8E2D9' }}>
                              <input 
                                type="text"
                                placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                                value={formData.cardNumber}
                                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #D5CEC4', fontSize: '0.8rem' }}
                              />
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <input 
                                  type="text"
                                  placeholder="MM/YY"
                                  value={formData.cardExpiry}
                                  onChange={(e) => setFormData({...formData, cardExpiry: e.target.value})}
                                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #D5CEC4', fontSize: '0.8rem' }}
                                />
                                <input 
                                  type="password"
                                  maxLength={4}
                                  placeholder="CVV"
                                  value={formData.cardCvv}
                                  onChange={(e) => setFormData({...formData, cardCvv: e.target.value})}
                                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #D5CEC4', fontSize: '0.8rem' }}
                                />
                              </div>
                            </div>
                          )}

                        </div>
                      </label>
                    ))}
                  </div>



                  {/* Checkout Error Message */}
                  {checkoutError && (
                    <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '12px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid #FFCDD2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={18} flexShrink={0} />
                      <div>{checkoutError}</div>
                    </div>
                  )}

                  {/* Summary Breakdown Box */}
                  <div style={{ backgroundColor: '#F7F3EE', padding: '16px', borderRadius: '14px', border: '1px solid #E8E2D9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555', marginBottom: '6px' }}>
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555', marginBottom: '8px' }}>
                      <span>Express Shipping</span>
                      <span>{shippingFee === 0 ? <strong style={{ color: '#2E7D32' }}>FREE</strong> : `₹${shippingFee}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: '#1F2A44', paddingTop: '10px', borderTop: '1px dashed #CCC' }}>
                      <span>Total Amount</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Proceed Payment & Cancel Checkout */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      className="btn-primary" 
                      style={{ width: '100%', padding: '16px', fontSize: '1.05rem', backgroundColor: '#1F2A44', borderRadius: '30px', cursor: isProcessing ? 'wait' : 'pointer', opacity: isProcessing ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing Gateway Payment...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={20} /> Pay & Place Order (₹{totalAmount})
                        </>
                      )}
                    </button>

                    <button 
                      type="button" 
                      onClick={onClose}
                      disabled={isProcessing}
                      className="btn-secondary" 
                      style={{ width: '100%', padding: '12px', fontSize: '0.9rem', borderRadius: '30px', borderColor: '#D5CEC4', color: '#666', cursor: 'pointer' }}
                    >
                      Cancel Checkout & Continue Shopping
                    </button>
                  </div>

                </div>

              </div>
            </form>
          </>
        )}

      </div>

    </div>
  );
}
