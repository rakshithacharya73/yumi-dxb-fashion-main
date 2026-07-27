import React, { useState } from 'react';
import { User, Package, MapPin, Phone, Mail, LogOut, ShoppingBag, Clock, CheckCircle2, Truck, ShieldCheck, ArrowRight, Edit2, Sparkles, Download } from 'lucide-react';
import { DB } from '../services/db';

export default function CustomerDashboard({ 
  currentUser, 
  setCurrentUser, 
  orders = [], 
  onContinueShopping,
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || ''
  });
  const [msg, setMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filter orders for logged in customer by email or phone
  const userEmail = (currentUser?.email || '').toLowerCase();
  const userOrders = orders.filter(o => 
    (o.customerEmail || o.email || '').toLowerCase() === userEmail ||
    (currentUser?.phone && (o.customerPhone || o.phone) === currentUser.phone)
  );

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg('');

    const res = await DB.updateCustomerProfile({
      email: currentUser.email,
      name: profileData.name,
      phone: profileData.phone,
      address: profileData.address
    });

    if (res.success) {
      setCurrentUser(res.user);
      setMsg('Profile and delivery address updated successfully!');
    } else {
      setMsg('Failed to update profile. Please try again.');
    }
    setIsSaving(false);
  };

  const handleDownloadReceipt = (order) => {
    const orderDate = new Date(order.date || order.dateTime || Date.now()).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const itemList = order.items || order.productsOrdered || [];
    const subtotal = itemList.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
    const discount = order.discountAmount !== undefined ? order.discountAmount : Math.round(subtotal * 0.10);
    const deliveryCharge = order.deliveryCharge !== undefined ? order.deliveryCharge : (subtotal > 1499 ? 0 : 99);
    const totalPaid = order.totalAmount || (subtotal - discount + deliveryCharge);
    
    // 18% GST Breakdown (9% CGST + 9% SGST)
    const totalGst = Math.round((subtotal - discount) * 0.18 / 1.18);
    const cgst = (totalGst / 2).toFixed(2);
    const sgst = (totalGst / 2).toFixed(2);

    const itemsHtml = itemList.map((item, index) => {
      const quantity = item.quantity || 1;
      const price = Number(item.price || 0);
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #EEE;">${index + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #EEE; font-weight: bold;">${item.name || 'Item'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #EEE;">${item.selectedSize || 'M'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #EEE;">${quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #EEE;">₹${price.toLocaleString()}</td>
          <td style="padding: 10px; border-bottom: 1px solid #EEE; font-weight: bold;">₹${(price * quantity).toLocaleString()}</td>
        </tr>`;
    }).join('');

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>YUMI DXB Tax Invoice - ${order.orderId}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #1F2A44; background-color: #FFF; }
            .invoice-card { max-width: 740px; margin: 0 auto; border: 1px solid #E8E2D9; border-radius: 20px; padding: 36px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            .brand-title { font-family: Georgia, serif; font-size: 28px; font-weight: 800; color: #1F2A44; letter-spacing: 1px; margin: 0; }
            .brand-sub { font-size: 12px; color: #C97B7B; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
            .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid #F7F3EE; }
            .gst-tag { font-size: 11px; color: #666; margin-top: 4px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size: 13px; background: #F7F3EE; padding: 18px; border-radius: 12px; }
            .info-box strong { color: #1F2A44; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
            th { background-color: #1F2A44; color: #FFF; padding: 12px 10px; text-align: left; font-size: 12px; text-transform: uppercase; }
            .breakdown-table { width: 320px; margin-left: auto; font-size: 13px; margin-top: 10px; }
            .breakdown-table td { padding: 6px 0; }
            .breakdown-table .total-row { border-top: 2px solid #1F2A44; font-size: 16px; font-weight: 800; color: #1F2A44; padding-top: 10px; }
            .discount-text { color: #2E7D32; font-weight: bold; }
            .footer-note { margin-top: 36px; padding-top: 20px; border-top: 1px dashed #DDD; text-align: center; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="invoice-header">
              <div>
                <div class="brand-title">YUMI DXB</div>
                <div class="brand-sub">Luxury Apparel & Loungewear</div>
                <div class="gst-tag">GSTIN: 07AAACY1234F1Z9 • PAN: AAACY1234F</div>
              </div>
              <div style="text-align: right;">
                <h3 style="margin:0; color:#1F2A44;">TAX INVOICE / RECEIPT</h3>
                <div style="font-size: 14px; font-weight: bold; color: #C97B7B; margin-top: 4px;">${order.orderId}</div>
                <div style="font-size: 12px; color: #666;">Date: ${orderDate}</div>
              </div>
            </div>

            <div class="info-grid">
              <div>
                <strong>Billed & Shipped To:</strong><br />
                ${order.customerName || currentUser?.name || 'Valued Customer'}<br />
                ${order.address || currentUser?.address || 'India'}<br />
                📞 ${order.customerPhone || currentUser?.phone || 'N/A'}
              </div>
              <div>
                <strong>Payment & Delivery Details:</strong><br />
                Payment Method: ${order.paymentMethod || 'Online Payment'}<br />
                Payment Status: ${order.paymentStatus || 'Paid'}<br />
                Tracking No: ${order.trackingInfo || 'TRK-DXB-9871'}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Description</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <table class="breakdown-table">
              <tr>
                <td>Subtotal (Base Price):</td>
                <td style="text-align: right;">₹${subtotal.toLocaleString()}</td>
              </tr>
              ${discount > 0 ? `
              <tr>
                <td class="discount-text">Festive Offer Discount:</td>
                <td style="text-align: right;" class="discount-text">-₹${discount.toLocaleString()}</td>
              </tr>` : ''}
              <tr>
                <td>Delivery Charges:</td>
                <td style="text-align: right;">${deliveryCharge === 0 ? '<span style="color:#2E7D32; font-weight:bold;">FREE</span>' : '₹' + deliveryCharge}</td>
              </tr>
              <tr>
                <td style="color:#666;">CGST (9%):</td>
                <td style="text-align: right; color:#666;">₹${cgst}</td>
              </tr>
              <tr>
                <td style="color:#666;">SGST (9%):</td>
                <td style="text-align: right; color:#666;">₹${sgst}</td>
              </tr>
              <tr>
                <td style="color:#666; font-weight:bold;">Total Tax (18% GST Incl.):</td>
                <td style="text-align: right; color:#666; font-weight:bold;">₹${totalGst.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>Total Paid Amount:</td>
                <td style="text-align: right; color:#1F2A44;">₹${totalPaid.toLocaleString()}</td>
              </tr>
            </table>

            <div class="footer-note">
              Thank you for choosing YUMI DXB Fashion. For support or returns, email hello@yumidxb.com.<br />
              This is a computer-generated tax receipt and requires no physical signature.
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=900,height=750');
    if (!printWindow) return;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  if (!currentUser) return null;

  return (
    <div style={{ backgroundColor: '#F7F3EE', minHeight: '88vh', padding: '40px 0' }}>
      <div className="container">
        
        {/* Customer Header Banner */}
        <div style={{
          backgroundColor: '#1F2A44',
          borderRadius: '24px',
          padding: '36px',
          color: '#FFF',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-blush">VALUED CUSTOMER PORTAL</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} color="#C97B7B" /> YUMI VIP Member
              </span>
            </div>

            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700, margin: '4px 0' }}>
              Welcome Back, {currentUser.name}!
            </h1>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#C97B7B" /> {currentUser.email}
              </span>
              {currentUser.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="#C97B7B" /> {currentUser.phone}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', zIndex: 2, flexWrap: 'wrap' }}>
            <button 
              onClick={onContinueShopping}
              className="btn-accent"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              <ShoppingBag size={16} /> Explore Collections
            </button>
            
            <button 
              onClick={onLogout}
              className="btn-secondary"
              style={{ padding: '12px 18px', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #E8E2D9', marginBottom: '28px' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '1rem',
              color: activeTab === 'orders' ? '#1F2A44' : '#777',
              borderBottom: activeTab === 'orders' ? '3px solid #1F2A44' : '3px solid transparent',
              marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <Package size={18} /> My Orders & Live Tracking ({userOrders.length})
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '1rem',
              color: activeTab === 'profile' ? '#1F2A44' : '#777',
              borderBottom: activeTab === 'profile' ? '3px solid #1F2A44' : '3px solid transparent',
              marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <User size={18} /> Delivery Address & Profile Settings
          </button>
        </div>

        {/* TAB 1: MY ORDERS & LIVE TRACKING */}
        {activeTab === 'orders' && (
          <div>
            {userOrders.length === 0 ? (
              <div style={{
                backgroundColor: '#FFF', borderRadius: '20px', padding: '60px 20px',
                textAlign: 'center', border: '1px solid #E8E2D9', boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(201,123,123,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto'
                }}>
                  <ShoppingBag size={32} color="#C97B7B" />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#1F2A44', fontWeight: 700, marginBottom: '8px' }}>
                  No Orders Placed Yet
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666', maxWidth: '420px', margin: '0 auto 24px auto' }}>
                  Explore our handcrafted robes, Kaftans, and pyjama co-ords to place your first luxury order!
                </p>
                <button onClick={onContinueShopping} className="btn-primary" style={{ padding: '12px 24px' }}>
                  Start Shopping <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {userOrders.map((order) => {
                  const status = order.orderStatus || 'Processing';
                  const isDelivered = status === 'Delivered';
                  const isShipped = status === 'Shipped' || isDelivered;

                  return (
                    <div 
                      key={order.orderId}
                      style={{
                        backgroundColor: '#FFF', borderRadius: '20px', border: '1px solid #E8E2D9',
                        overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s'
                      }}
                    >
                      {/* Order Header Card */}
                      <div style={{
                        padding: '20px 28px', backgroundColor: '#F7F3EE', borderBottom: '1px solid #E8E2D9',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.78rem', color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ORDER NUMBER</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F2A44' }}>{order.orderId}</div>
                          <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '2px' }}>
                            Placed on: {new Date(order.date || order.dateTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </div>

                        {/* Order Tracking Progress Pills */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.82rem',
                            backgroundColor: isDelivered ? '#E8F5E9' : status === 'Shipped' ? '#E3F2FD' : '#FFF3E0',
                            color: isDelivered ? '#2E7D32' : status === 'Shipped' ? '#1565C0' : '#E65100',
                            display: 'flex', alignItems: 'center', gap: '6px'
                          }}>
                            {isDelivered ? <CheckCircle2 size={14} /> : status === 'Shipped' ? <Truck size={14} /> : <Clock size={14} />}
                            {status}
                          </span>

                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1F2A44', backgroundColor: '#FFF', padding: '6px 14px', borderRadius: '20px', border: '1px solid #E8E2D9' }}>
                            Tracking ID: {order.trackingInfo || `TRK-IN-${Math.floor(100000 + Math.random() * 900000)}`}
                          </span>
                        </div>
                      </div>

                      {/* Items & Address Details */}
                      <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
                        
                        {/* Left: Products List */}
                        <div>
                          <h4 style={{ fontSize: '0.9rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', marginBottom: '14px' }}>
                            Items Ordered ({order.quantityTotal || (order.items || []).length})
                          </h4>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(order.items || order.productsOrdered || []).map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '12px', borderBottom: idx < (order.items || order.productsOrdered || []).length - 1 ? '1px dashed #F0ECE6' : 'none' }}>
                                {item.image || (item.images && item.images[0]) ? (
                                  <img 
                                    src={item.image || item.images[0]} 
                                    alt={item.name} 
                                    style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E8E2D9' }} 
                                  />
                                ) : (
                                  <div style={{ width: '48px', height: '60px', backgroundColor: '#F7F3EE', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShoppingBag size={20} color="#999" />
                                  </div>
                                )}
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 700, color: '#1F2A44', fontSize: '0.92rem' }}>{item.name}</div>
                                  <div style={{ fontSize: '0.78rem', color: '#666' }}>Size: <strong>{item.selectedSize}</strong> • Qty: {item.quantity}</div>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C97B7B', marginTop: '2px' }}>₹{item.price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: Delivery Address & Payment Summary */}
                        <div style={{ backgroundColor: '#F7F3EE', padding: '20px', borderRadius: '14px', border: '1px solid #E8E2D9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ fontSize: '0.9rem', color: '#1F2A44', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin size={16} color="#C97B7B" /> Delivery Address
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: '#444', lineHeight: 1.5, marginBottom: '14px' }}>
                              {order.address}
                            </p>

                            <div style={{ fontSize: '0.82rem', color: '#666', borderTop: '1px solid #E2D9CF', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div>Payment Method: <strong>{order.paymentMethod}</strong></div>
                              <div>Payment Status: <strong style={{ color: (order.paymentStatus || '').includes('Paid') ? '#2E7D32' : '#E65100' }}>{order.paymentStatus}</strong></div>
                            </div>

                            {/* Itemized Price Breakdown */}
                            <div style={{ borderTop: '1px dashed #D5CEC4', marginTop: '12px', paddingTop: '10px', fontSize: '0.8rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Subtotal:</span>
                                <span>₹{(order.items || order.productsOrdered || []).reduce((s, i) => s + (Number(i.price || 0) * (i.quantity || 1)), 0).toLocaleString()}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32', fontWeight: 600 }}>
                                <span>Festive Offer Discount:</span>
                                <span>-₹{Math.round(((order.items || order.productsOrdered || []).reduce((s, i) => s + (Number(i.price || 0) * (i.quantity || 1)), 0)) * 0.10).toLocaleString()}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Delivery Charge:</span>
                                <span style={{ color: '#2E7D32', fontWeight: 700 }}>FREE</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#777' }}>
                                <span>CGST (9%):</span>
                                <span>₹{(Math.round((order.totalAmount || 1000) * 0.18 / 1.18) / 2).toFixed(2)}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#777' }}>
                                <span>SGST (9%):</span>
                                <span>₹{(Math.round((order.totalAmount || 1000) * 0.18 / 1.18) / 2).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div style={{ borderTop: '2px solid #1F2A44', paddingTop: '12px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1F2A44' }}>Total Paid:</span>
                              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1F2A44' }}>₹{order.totalAmount}</span>
                            </div>

                            {/* Download Receipt Button Placed Directly Below Total Paid */}
                            <button
                              onClick={() => handleDownloadReceipt(order)}
                              className="btn-primary"
                              style={{
                                width: '100%', marginTop: '14px', padding: '12px', fontSize: '0.88rem',
                                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                              }}
                            >
                              <Download size={16} /> Download Tax Receipt (PDF)
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & ADDRESS EDIT */}
        {activeTab === 'profile' && (
          <div style={{
            backgroundColor: '#FFF', borderRadius: '24px', padding: '36px',
            border: '1px solid #E8E2D9', maxWidth: '640px', boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1.4rem', color: '#1F2A44', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit2 size={20} color="#C97B7B" /> Edit Profile & Default Delivery Address
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '24px' }}>
              Keep your contact details up to date for faster one-click checkout.
            </p>

            {msg && (
              <div style={{
                backgroundColor: msg.includes('successfully') ? '#EEF9F0' : '#FFEEEE',
                color: msg.includes('successfully') ? '#2E7D32' : '#CC0000',
                padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
              }}>
                <CheckCircle2 size={18} /> {msg}
              </div>
            )}

            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2A44', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #D5CEC4', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2A44', display: 'block', marginBottom: '4px' }}>
                  Email Address (Account ID)
                </label>
                <input 
                  type="email" 
                  value={currentUser.email}
                  disabled
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2D9CF', backgroundColor: '#F7F3EE', color: '#777', cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2A44', display: 'block', marginBottom: '4px' }}>
                  Phone / Mobile Number
                </label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #D5CEC4', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2A44', display: 'block', marginBottom: '4px' }}>
                  Default Delivery Address
                </label>
                <textarea 
                  rows={3}
                  placeholder="House / Flat No., Building, Street Name, Pincode"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #D5CEC4', outline: 'none', resize: 'none' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="btn-primary"
                style={{ padding: '14px', fontSize: '1rem', marginTop: '8px' }}
              >
                <ShieldCheck size={18} /> {isSaving ? 'Saving Changes...' : 'Save Profile & Address'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
