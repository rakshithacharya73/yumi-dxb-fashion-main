import React from 'react';
import { CheckCircle2, PackageCheck, ArrowRight, ShieldCheck, Home, Eye, Download } from 'lucide-react';
import { BRAND_DETAILS } from '../data/products';

export default function OrderConfirmationModal({ order, onClose, onViewInAdmin }) {
  if (!order) return null;

  const handleDownloadReceipt = () => {
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
                ${order.customerName || 'Valued Customer'}<br />
                ${order.address || 'India'}<br />
                📞 ${order.customerPhone || 'N/A'}
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

          {/* Itemized Price Breakdown */}
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #D5CEC4', fontSize: '0.85rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>₹{(order.items || []).reduce((s, i) => s + (Number(i.price || 0) * (i.quantity || 1)), 0).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32', fontWeight: 600 }}>
              <span>Festive Offer Discount:</span>
              <span>-₹{Math.round(((order.items || []).reduce((s, i) => s + (Number(i.price || 0) * (i.quantity || 1)), 0)) * 0.10).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Charges:</span>
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

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '14px', borderTop: '2px solid #1F2A44', fontSize: '1.2rem', fontWeight: 800, color: '#1F2A44' }}>
            <span>Total Paid Amount:</span>
            <span style={{ color: '#1F2A44' }}>₹{order.totalAmount}</span>
          </div>

          {/* Download Receipt Button Directly Below Total Paid */}
          <button
            onClick={handleDownloadReceipt}
            className="btn-primary"
            style={{
              width: '100%', marginTop: '16px', padding: '14px', fontSize: '0.92rem',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <Download size={18} /> Download Tax Receipt (PDF)
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={onClose} 
            className="btn-secondary" 
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
