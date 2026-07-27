import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Package, ShoppingBag, Plus, Trash2, Edit, Check, 
  TrendingUp, Users, Lock, LogOut, RefreshCw, AlertCircle, Sparkles, Download, Eye, EyeOff 
} from 'lucide-react';
import { DB } from '../services/db';

export default function AdminDashboard({ 
  products, 
  setProducts, 
  orders, 
  setOrders, 
  onExitAdmin 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Requires passcode login
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'customers'
  const [customers, setCustomers] = useState(() => DB.getCustomers());

  useEffect(() => {
    const registered = DB.getCustomers() || [];
    const orderCustomers = [];
    (orders || []).forEach(o => {
      const email = (o.customerEmail || o.email || '').toLowerCase();
      if (email && !registered.some(r => r.email.toLowerCase() === email) && !orderCustomers.some(oc => oc.email.toLowerCase() === email)) {
        orderCustomers.push({
          id: `ORD-CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          name: o.customerName || 'Customer',
          email: o.customerEmail || o.email,
          phone: o.customerPhone || o.phone || 'N/A',
          address: o.address || 'N/A',
          registrationDate: o.date || o.dateTime || new Date().toISOString(),
          type: 'Guest Order Customer'
        });
      }
    });
    setCustomers([...registered, ...orderCustomers]);
  }, [isAuthenticated, orders]);


  
  // New Product Modal Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    fabric: 'Soft Cotton Blend',
    category: 'Modest Wear',
    price: 999,
    originalPrice: 1499,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    description: '',
    careInstructions: 'Machine wash cold on gentle cycle.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const isValid = await DB.verifyAdminPassword(passcode);
    if (isValid) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid security passcode.');
    }
  };

  // Update Order Status (Async fix to prevent Promise assignment)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const updated = await DB.updateOrderStatus(orderId, newStatus);
    setOrders(updated || []);
  };


  // Add Product
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    const createdProduct = {
      ...newProduct,
      id: `p_${Date.now()}`,
      inStock: newProduct.stock > 0,
      rating: 5.0,
      reviewsCount: 1,
      images: [newProduct.image],
      badge: 'New'
    };
    const updatedProducts = [createdProduct, ...products];
    setProducts(updatedProducts);
    DB.saveProducts(updatedProducts);
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      fabric: 'Soft Cotton Blend',
      category: 'Modest Wear',
      price: 999,
      originalPrice: 1499,
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 20,
      description: '',
      careInstructions: 'Machine wash cold on gentle cycle.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
    });
  };

  // Delete Product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to remove this product from catalogue?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      DB.saveProducts(updatedProducts);
    }
  };

  // Quick Stock Edit
  const handleUpdateStock = (productId, newStock) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const val = Math.max(0, parseInt(newStock) || 0);
        return { ...p, stock: val, inStock: val > 0 };
      }
      return p;
    });
    setProducts(updatedProducts);
    DB.saveProducts(updatedProducts);
  };

  // Analytics Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;

  // STUNNING EXECUTIVE FASHION LOGIN PAGE IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '88vh', 
        display: 'flex', 
        alignItems: 'center', 
        justify: 'center', 
        backgroundColor: '#F7F3EE', 
        padding: '30px 20px',
        position: 'relative'
      }}>
        
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '28px', 
          boxShadow: 'var(--shadow-lg)', 
          maxWidth: '920px', 
          width: '100%', 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          overflow: 'hidden',
          border: '1px solid #E8E2D9'
        }} className="animate-fade-in">
          
          {/* Left Column: Fashion Editorial Image Banner */}
          <div style={{
            position: 'relative',
            minHeight: '380px',
            backgroundColor: '#1F2A44'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" 
              alt="YUMI Admin Fashion Editorial"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(31,42,68,0.92) 0%, rgba(31,42,68,0.4) 60%, transparent 100%)',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'flex-end',
              color: '#FFF'
            }}>
              <span className="badge-blush" style={{ width: 'fit-content', marginBottom: '8px' }}>YUMI DXB PORTAL</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>Shop Owner Dashboard</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>
                Manage catalog inventory, fulfill customer orders, and view sales metrics.
              </p>
            </div>
          </div>

          {/* Right Column: Passcode Login Form */}
          <div style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1F2A44', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 4px 14px rgba(31,42,68,0.2)' }}>
                <Lock size={22} color="#C97B7B" />
              </div>
              <h3 style={{ fontSize: '1.6rem', color: '#1F2A44', fontWeight: 800 }}>Admin Authentication</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Enter security passcode to unlock management portal.</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2A44' }}>Admin Passcode</label>
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    required
                    style={{ width: '100%', padding: '13px 40px 13px 14px', borderRadius: '10px', border: '1px solid #D5CEC4', outline: 'none', fontSize: '0.95rem' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  <AlertCircle size={16} /> {loginError}
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '1rem', marginTop: '6px' }}>
                <ShieldCheck size={18} /> Unlock Dashboard
              </button>
              
              <button type="button" onClick={onExitAdmin} className="btn-secondary" style={{ padding: '12px' }}>
                Return to Storefront
              </button>
            </form>
          </div>

        </div>

      </div>
    );
  }

  // LUXURY STYLED DASHBOARD ONCE AUTHENTICATED
  return (
    <div style={{ backgroundColor: '#F7F3EE', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        
        {/* Admin Top Navigation & Controls Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-blush">SHOP OWNER PORTAL</span>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>YUMI DXB Fashion</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', color: '#1F2A44', fontWeight: 800, marginTop: '4px' }}>
              Admin Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => DB.exportBackup()} className="btn-secondary" style={{ padding: '10px 16px', fontSize: '0.88rem', backgroundColor: '#FFF' }}>
              <Download size={16} /> Export DB Backup (.json)
            </button>
            <button onClick={() => setShowAddProductModal(true)} className="btn-accent" style={{ padding: '10px 18px', fontSize: '0.88rem' }}>
              <Plus size={16} /> Add New Product
            </button>
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                onExitAdmin();
              }} 
              className="btn-secondary" 
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <LogOut size={16} /> Log Out & Lock
            </button>
          </div>
        </div>

        {/* Quick Executive Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '20px', border: '1px solid #E8E2D9', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(201, 123, 123, 0.1)' }} />
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL REVENUE</div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1F2A44', marginTop: '6px' }}>₹{totalRevenue.toLocaleString()}</div>
            <div style={{ fontSize: '0.78rem', color: '#2E7D32', marginTop: '4px', fontWeight: 600 }}>From {totalOrdersCount} customer orders</div>
          </div>

          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '20px', border: '1px solid #E8E2D9', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL ORDERS</div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1F2A44', marginTop: '6px' }}>{totalOrdersCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#C97B7B', marginTop: '4px', fontWeight: 600 }}>Customer checkout records</div>
          </div>

          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '20px', border: '1px solid #E8E2D9', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CATALOGUE PRODUCTS</div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1F2A44', marginTop: '6px' }}>{totalProductsCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#1F2A44', marginTop: '4px', fontWeight: 600 }}>Active fashion items</div>
          </div>

          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '20px', border: '1px solid #E8E2D9', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>REGISTERED CUSTOMERS</div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1F2A44', marginTop: '6px' }}>{customers.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#2E7D32', marginTop: '4px', fontWeight: 600 }}>Customer accounts</div>
          </div>

        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #E8E2D9', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '1rem',
              color: activeTab === 'orders' ? '#1F2A44' : '#777',
              borderBottom: activeTab === 'orders' ? '3px solid #1F2A44' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            Order Management ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            style={{
              padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '1rem',
              color: activeTab === 'inventory' ? '#1F2A44' : '#777',
              borderBottom: activeTab === 'inventory' ? '3px solid #1F2A44' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            Products & Stock Inventory ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            style={{

              padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '1rem',
              color: activeTab === 'customers' ? '#1F2A44' : '#777',
              borderBottom: activeTab === 'customers' ? '3px solid #1F2A44' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            Registered Customers ({customers.length})
          </button>
        </div>


        {/* TAB 1: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#FFF', borderRadius: '20px', border: '1px solid #E8E2D9', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            {orders.length === 0 ? (
              <div style={{ padding: '50px 20px', textAlign: 'center', color: '#666' }}>
                No customer orders received yet. Place an order on storefront to see it appear live here!
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F7F3EE', color: '#1F2A44', borderBottom: '1px solid #E8E2D9' }}>
                      <th style={{ padding: '18px' }}>Order ID & Date</th>
                      <th style={{ padding: '18px' }}>Customer Info</th>
                      <th style={{ padding: '18px' }}>Products Ordered</th>
                      <th style={{ padding: '18px' }}>Amount & Payment</th>
                      <th style={{ padding: '18px' }}>Order Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.orderId} style={{ borderBottom: '1px solid #F0ECE6' }}>
                        <td style={{ padding: '18px' }}>
                          <strong style={{ color: '#1F2A44', fontSize: '0.95rem' }}>{order.orderId}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#777', marginTop: '2px' }}>{order.date || order.dateTime}</div>
                        </td>

                        <td style={{ padding: '18px' }}>
                          <div style={{ fontWeight: 700, color: '#1F2A44' }}>{order.customerName}</div>
                          <div style={{ fontSize: '0.8rem', color: '#555' }}>📞 {order.customerPhone || order.phone}</div>
                          <div style={{ fontSize: '0.78rem', color: '#777', maxWidth: '240px' }}>📍 {order.address}</div>
                        </td>

                        <td style={{ padding: '18px' }}>
                          {(order.items || order.productsOrdered || []).map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.82rem', color: '#333' }}>
                              • <strong>{item.name}</strong> ({item.selectedSize}) x {item.quantity}
                            </div>
                          ))}
                        </td>

                        <td style={{ padding: '18px' }}>
                          <div style={{ fontWeight: 800, color: '#1F2A44' }}>₹{order.totalAmount}</div>
                          <div style={{ fontSize: '0.78rem', color: (order.paymentStatus || '').includes('Paid') ? '#2E7D32' : '#C97B7B', fontWeight: 600 }}>
                            {order.paymentMethod} ({order.paymentStatus})
                          </div>
                        </td>

                        <td style={{ padding: '18px' }}>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: '1px solid #D5CEC4',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              backgroundColor: order.orderStatus === 'Delivered' ? '#E8F5E9' : order.orderStatus === 'Shipped' ? '#E3F2FD' : '#FFF3E0',
                              color: order.orderStatus === 'Delivered' ? '#2E7D32' : order.orderStatus === 'Shipped' ? '#1565C0' : '#E65100',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div style={{ backgroundColor: '#FFF', borderRadius: '20px', border: '1px solid #E8E2D9', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F7F3EE', color: '#1F2A44', borderBottom: '1px solid #E8E2D9' }}>
                    <th style={{ padding: '18px' }}>Product & Fashion Image</th>
                    <th style={{ padding: '18px' }}>Fabric & Category</th>
                    <th style={{ padding: '18px' }}>Price (₹)</th>
                    <th style={{ padding: '18px' }}>Stock Quantity</th>
                    <th style={{ padding: '18px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #F0ECE6' }}>
                      <td style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img 
                          src={product.images[0]} 
                          alt="" 
                          style={{ width: '54px', height: '68px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E8E2D9', backgroundColor: '#F7F3EE' }} 
                        />
                        <div>
                          <strong style={{ color: '#1F2A44', fontSize: '0.98rem' }}>{product.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#777' }}>Sizes: {(product.sizes || []).join(', ')}</div>
                        </div>
                      </td>

                      <td style={{ padding: '18px' }}>
                        <span className="badge-blush" style={{ fontSize: '0.75rem' }}>{product.fabric}</span>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>{product.category}</div>
                      </td>

                      <td style={{ padding: '18px', fontWeight: 800, color: '#1F2A44' }}>
                        ₹{product.price}
                      </td>

                      <td style={{ padding: '18px' }}>
                        <input 
                          type="number" 
                          value={product.stock}
                          onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                          style={{ width: '75px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D5CEC4', fontWeight: 700 }}
                        />
                      </td>

                      <td style={{ padding: '18px' }}>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                          title="Remove product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED CUSTOMERS */}
        {activeTab === 'customers' && (
          <div style={{ backgroundColor: '#FFF', borderRadius: '20px', border: '1px solid #E8E2D9', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            {customers.length === 0 ? (
              <div style={{ padding: '50px 20px', textAlign: 'center', color: '#666' }}>
                No customer accounts registered yet. When customers sign up, their profile details will appear here.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F7F3EE', color: '#1F2A44', borderBottom: '1px solid #E8E2D9' }}>
                      <th style={{ padding: '18px' }}>Customer ID & Date</th>
                      <th style={{ padding: '18px' }}>Full Name</th>
                      <th style={{ padding: '18px' }}>Email Address</th>
                      <th style={{ padding: '18px' }}>Phone Number</th>
                      <th style={{ padding: '18px' }}>Default Delivery Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id || c.email} style={{ borderBottom: '1px solid #F0ECE6' }}>
                        <td style={{ padding: '18px' }}>
                          <strong style={{ color: '#1F2A44', fontSize: '0.85rem' }}>{c.id || 'CUST-ACC'}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '2px' }}>
                            {c.registrationDate ? new Date(c.registrationDate).toLocaleDateString() : 'Active Member'}
                          </div>
                        </td>
                        <td style={{ padding: '18px', fontWeight: 700, color: '#1F2A44' }}>
                          {c.name}
                        </td>
                        <td style={{ padding: '18px', color: '#1565C0', fontWeight: 600 }}>
                          {c.email}
                        </td>
                        <td style={{ padding: '18px', color: '#555' }}>
                          {c.phone || 'N/A'}
                        </td>
                        <td style={{ padding: '18px', color: '#666', maxWidth: '280px' }}>
                          {c.address || 'Not specified'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}


        {/* Add Product Modal */}
        {showAddProductModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(31, 42, 68, 0.7)',
            backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}>
            <div style={{ backgroundColor: '#FFF', borderRadius: '24px', padding: '36px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #E8E2D9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#1F2A44', fontWeight: 800 }}>Add New Fashion Product</h3>
                <button onClick={() => setShowAddProductModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>

              <form onSubmit={handleAddProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Product Name</label>
                  <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #CCC', marginTop: '4px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Fabric Material</label>
                    <input type="text" required value={newProduct.fabric} onChange={(e) => setNewProduct({...newProduct, fabric: e.target.value})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #CCC', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Price (₹)</label>
                    <input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #CCC', marginTop: '4px' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Stock Qty</label>
                    <input type="number" required value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #CCC', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Image URL</label>
                    <input type="text" required value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #CCC', marginTop: '4px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Description</label>
                  <textarea rows={3} required value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #CCC', marginTop: '4px', resize: 'none' }} />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '14px', marginTop: '8px' }}>
                  Publish Product to Store
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
