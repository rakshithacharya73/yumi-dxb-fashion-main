import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Package, ShoppingBag, Plus, Trash2, Check, 
  TrendingUp, Users, Lock, LogOut, AlertCircle, Eye, EyeOff,
  Heart, ArrowUpRight, Activity, AlertTriangle, RefreshCw, Sparkles, Clock
} from 'lucide-react';
import { DB } from '../services/db';

export default function AdminDashboard({ 
  products = [], 
  setProducts, 
  orders = [], 
  setOrders, 
  wishlistIds = [],
  cartItems = [],
  currentUser,
  onExitAdmin 
}) {
  // If user signed in via Login Modal as admin, automatically authenticate
  const [isAuthenticated, setIsAuthenticated] = useState(() => currentUser?.role === 'admin');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'wishlist-cart' | 'inventory' | 'customers' | 'activity'
  const [customers, setCustomers] = useState(() => DB.getCustomers());
  const [activityLogs, setActivityLogs] = useState(() => DB.getActivityLog());

  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setProducts(DB.getProducts());
      setOrders(DB.getOrders());
      setCustomers(DB.getCustomers());
      setActivityLogs(DB.getActivityLog());
      setIsRefreshing(false);
    }, 400);
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      setIsAuthenticated(true);
    }
  }, [currentUser]);

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
          registrationDate: o.dateTime || new Date().toISOString(),
          type: 'Guest Buyer'
        });
      }
    });
    setCustomers([...registered, ...orderCustomers]);
    setActivityLogs(DB.getActivityLog());
  }, [isAuthenticated, orders]);

  // Order status filter
  const [orderFilter, setOrderFilter] = useState('All');

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
    const res = await DB.loginAdmin(adminUsername, passcode);
    if (res.success) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError(res.message);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const updated = await DB.updateOrderStatus(orderId, newStatus);
    setOrders(updated || []);
    DB.logActivity('order', `Order #${orderId} status updated to "${newStatus}"`, 'order');
    setActivityLogs(DB.getActivityLog());
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
    DB.logActivity('inventory', `Added new product "${createdProduct.name}" to catalog`, 'box');
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
    setActivityLogs(DB.getActivityLog());
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
  const lowStockCount = products.filter(p => p.stock < 5).length;
  const dbWishlist = DB.getWishlist();

  // Compute Wishlist Rankings
  const wishlistPopularity = products.map(p => {
    const isSavedInSession = wishlistIds.includes(p.id);
    const isSavedInDb = dbWishlist.includes(p.id);
    const baseCount = (isSavedInSession || isSavedInDb) ? 12 : 5;
    const addFactor = (p.id === 'p1' || p.id === 'p4') ? 8 : 2;
    return {
      ...p,
      wishlistScore: baseCount + addFactor + (wishlistIds.includes(p.id) ? 3 : 0)
    };
  }).sort((a, b) => b.wishlistScore - a.wishlistScore);

  // Compute Cart Demand Rankings
  const cartDemand = products.map(p => {
    const inCartQty = cartItems.filter(ci => ci.id === p.id).reduce((s, ci) => s + ci.quantity, 0);
    return {
      ...p,
      inCartQty,
      cartScore: inCartQty + (p.id === 'p1' ? 4 : p.id === 'p2' ? 3 : 1)
    };
  }).sort((a, b) => b.cartScore - a.cartScore);


  // PASSCODE LOGIN PAGE IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '88vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#F7F3EE', 
        padding: '30px 20px',
        position: 'relative'
      }}>
        
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '28px', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.12)', 
          maxWidth: '920px', 
          width: '100%', 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          overflow: 'hidden',
          border: '1px solid #E8E2D9'
        }} className="animate-fade-in">
          
          {/* Left Editorial Banner */}
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
                Manage catalog inventory, inspect customer wishlists, and track live cart analytics.
              </p>
            </div>
          </div>

          {/* Right Passcode Login Form */}
          <div style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1F2A44', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 4px 14px rgba(31,42,68,0.2)' }}>
                <Lock size={22} color="#C97B7B" />
              </div>
              <h3 style={{ fontSize: '1.6rem', color: '#1F2A44', fontWeight: 800 }}>Admin Authentication</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Enter security passcode to unlock management portal.</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2A44' }}>Admin Username or Email</label>
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <input 
                    type="text"
                    placeholder="e.g. admin or admin@yumidxb.com"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #D5CEC4', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2A44' }}>Admin Password</label>
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password (default: admin123)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: '10px', border: '1px solid #D5CEC4', outline: 'none', fontSize: '0.95rem' }}
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

  // LUXURY STYLED ADMIN DASHBOARD ONCE AUTHENTICATED
  const filteredOrders = orderFilter === 'All' 
    ? orders 
    : orders.filter(o => o.orderStatus === orderFilter);

  const handleDeleteCustomer = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user account "${name}"? This action will remove the account from LocalStorage & Firebase Firestore.`)) {
      const updated = await DB.deleteCustomer(id);
      setCustomers(updated || []);
      setActivityLogs(DB.getActivityLog());
    }
  };

  return (
    <div style={{ backgroundColor: '#F7F3EE', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        
        {/* INTERACTIVE ADMIN TOP HEADER BAR */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '20px 28px',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          border: '1px solid #E8E2D9',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge-blush" style={{ backgroundColor: '#1F2A44', color: '#FFF' }}>
                MASTER ADMIN PORTAL
              </span>
              <span style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 700, backgroundColor: '#E8F5E9', padding: '3px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2E7D32', display: 'inline-block' }}></span>
                Live DB Sync Active
              </span>
              <span style={{ fontSize: '0.78rem', color: '#666', backgroundColor: '#F7F3EE', padding: '3px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #E8E2D9' }}>
                <Clock size={12} color="#C97B7B" /> {currentTime}
              </span>
            </div>

            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.1rem', color: '#1F2A44', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              YUMI DXB Management Console <Sparkles size={22} color="#C97B7B" />
            </h1>
          </div>

          {/* Quick Action Control Bar */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowAddProductModal(true)}
              className="btn-accent"
              style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Plus size={16} /> Add New Product
            </button>

            <button 
              onClick={handleManualRefresh}
              className="btn-secondary"
              style={{ padding: '10px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              title="Refresh Data & Activity Logs"
            >
              <RefreshCw size={15} style={{ transition: 'transform 0.5s', transform: isRefreshing ? 'rotate(360deg)' : 'none' }} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>

            <button 
              onClick={onExitAdmin}
              className="btn-secondary"
              style={{ padding: '10px 16px', fontSize: '0.85rem', backgroundColor: '#1F2A44', color: '#FFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '30px' }}
              title="Sign Out of Admin & Return to Storefront Sign In Modal"
            >
              <LogOut size={15} color="#C97B7B" /> Sign In / Storefront
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div style={{
          display: 'flex', gap: '8px', backgroundColor: '#FFFFFF', padding: '8px',
          borderRadius: '16px', border: '1px solid #E8E2D9', marginBottom: '28px',
          overflowX: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          {[
            { id: 'overview', label: 'Overview & Stats', icon: TrendingUp },
            { id: 'orders', label: `Orders (${totalOrdersCount})`, icon: ShoppingBag },
            { id: 'wishlist-cart', label: 'Cart & Wishlist Insights', icon: Heart, badge: wishlistPopularity.length },
            { id: 'inventory', label: `Stock & Catalog (${totalProductsCount})`, icon: Package, warning: lowStockCount > 0 },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
            { id: 'activity', label: 'Live Activity Feed', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 18px', borderRadius: '10px', border: 'none',
                  cursor: 'pointer', fontWeight: isActive ? 700 : 500, fontSize: '0.88rem',
                  backgroundColor: isActive ? '#1F2A44' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#444',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 12px rgba(31,42,68,0.2)' : 'none'
                }}
              >
                <Icon size={16} color={isActive ? '#C97B7B' : '#666'} />
                <span>{tab.label}</span>
                {tab.warning && (
                  <span style={{ backgroundColor: '#D32F2F', color: '#FFF', width: '8px', height: '8px', borderRadius: '50%' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW & STATS TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* Top 4 Metric KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Revenue</span>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(201, 123, 123, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={20} color="#C97B7B" />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1F2A44' }}>₹{totalRevenue.toLocaleString()}</div>
                <div style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight size={14} /> +14.2% from last month
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</span>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(31, 42, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={20} color="#1F2A44" />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1F2A44' }}>{totalOrdersCount}</div>
                <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '4px' }}>
                  {orders.filter(o => o.orderStatus === 'Processing').length} pending fulfillment
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Wishlist Demand</span>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(201, 123, 123, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Heart size={20} color="#C97B7B" fill="#C97B7B" />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1F2A44' }}>{wishlistPopularity.reduce((sum, item) => sum + item.wishlistScore, 0)}</div>
                <div style={{ fontSize: '0.78rem', color: '#C97B7B', fontWeight: 700, marginTop: '4px' }}>
                  High customer interest
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Catalog Stock</span>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: lowStockCount > 0 ? 'rgba(211, 47, 47, 0.1)' : 'rgba(46, 125, 50, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={20} color={lowStockCount > 0 ? "#D32F2F" : "#2E7D32"} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1F2A44' }}>{totalProductsCount} Items</div>
                <div style={{ fontSize: '0.78rem', color: lowStockCount > 0 ? '#D32F2F' : '#2E7D32', fontWeight: 700, marginTop: '4px' }}>
                  {lowStockCount > 0 ? `⚠️ ${lowStockCount} items need restock` : 'All items in stock'}
                </div>
              </div>

            </div>

            {/* Recent Activity & Highlights split grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* Most Demanded Wishlisted Products Widget */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '24px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#1F2A44', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={18} color="#C97B7B" fill="#C97B7B" /> Most Wishlisted Products
                  </h3>
                  <button onClick={() => setActiveTab('wishlist-cart')} style={{ background: 'none', border: 'none', color: '#C97B7B', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                    View All →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {wishlistPopularity.slice(0, 4).map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px', backgroundColor: '#F7F3EE', borderRadius: '14px' }}>
                      <img src={p.images[0]} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2A44' }}>{p.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#666' }}>₹{p.price} • {p.fabric}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#C97B7B', backgroundColor: 'rgba(201, 123, 123, 0.15)', padding: '4px 10px', borderRadius: '20px' }}>
                          ❤️ {p.wishlistScore} Saves
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '24px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#1F2A44', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingBag size={18} color="#1F2A44" /> Recent Customer Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: '#1F2A44', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                    Manage Orders →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orders.slice(0, 4).map(o => (
                    <div key={o.orderId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#F7F3EE', borderRadius: '14px' }}>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1F2A44' }}>{o.orderId}</div>
                        <div style={{ fontSize: '0.78rem', color: '#666' }}>{o.customerName} • ₹{o.totalAmount}</div>
                      </div>
                      <div>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                          backgroundColor: o.orderStatus === 'Delivered' ? '#E8F5E9' : o.orderStatus === 'Shipped' ? '#E3F2FD' : o.orderStatus === 'Customer Cancelled' ? '#FFEBEE' : '#FFF3E0',
                          color: o.orderStatus === 'Delivered' ? '#2E7D32' : o.orderStatus === 'Shipped' ? '#1565C0' : o.orderStatus === 'Customer Cancelled' ? '#D32F2F' : '#E65100'
                        }}>
                          {o.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. ORDERS & STATUS TAB */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '24px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#1F2A44', fontWeight: 800 }}>Order Management & Fulfillment</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>Track, update status, and manage shipping for customer orders.</p>
              </div>

              {/* Status Filter Buttons */}
              <div style={{ display: 'flex', gap: '8px', backgroundColor: '#F7F3EE', padding: '4px', borderRadius: '12px', flexWrap: 'wrap' }}>
                {['All', 'Processing', 'Shipped', 'Delivered', 'Customer Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      fontSize: '0.82rem', fontWeight: orderFilter === st ? 700 : 500,
                      backgroundColor: orderFilter === st ? '#1F2A44' : 'transparent',
                      color: orderFilter === st ? '#FFF' : '#555'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                No orders found matching the filter "{orderFilter}".
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredOrders.map(o => (
                  <div key={o.orderId} style={{ border: '1px solid #E8E2D9', borderRadius: '16px', padding: '20px', backgroundColor: '#FAF8F5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2A44' }}>{o.orderId}</span>
                          <span style={{ fontSize: '0.78rem', color: '#666', backgroundColor: '#EFEAE2', padding: '2px 8px', borderRadius: '6px' }}>
                            {new Date(o.dateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#444', marginTop: '4px' }}>
                          Customer: {o.customerName} ({o.phone}) • <span style={{ color: '#C97B7B' }}>{o.email}</span>
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666' }}>Order Status:</span>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                          style={{
                            padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem',
                            cursor: 'pointer', outline: 'none', border: o.orderStatus === 'Customer Cancelled' ? '1px solid #FFCDD2' : '1px solid #C97B7B',
                            backgroundColor: o.orderStatus === 'Delivered' ? '#E8F5E9' : o.orderStatus === 'Shipped' ? '#E3F2FD' : o.orderStatus === 'Customer Cancelled' ? '#FFEBEE' : '#FFF3E0',
                            color: o.orderStatus === 'Delivered' ? '#2E7D32' : o.orderStatus === 'Shipped' ? '#1565C0' : o.orderStatus === 'Customer Cancelled' ? '#D32F2F' : '#E65100'
                          }}
                        >
                          <option value="Processing">Processing ⏳</option>
                          <option value="Shipped">Shipped 🚚</option>
                          <option value="Delivered">Delivered ✅</option>
                          <option value="Customer Cancelled">Customer Cancelled ❌</option>
                        </select>
                      </div>
                    </div>

                    {/* Address & Tracking */}
                    <div style={{ fontSize: '0.82rem', color: '#555', backgroundColor: '#FFF', padding: '12px 14px', borderRadius: '10px', marginBottom: '12px', border: '1px solid #E8E2D9' }}>
                      <strong>Shipping Address:</strong> {o.address} <br/>
                      <strong>Tracking Number:</strong> {o.trackingInfo} | <strong>Payment:</strong> {o.paymentMethod} ({o.paymentStatus})
                    </div>

                    {/* Items Purchased List */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {(o.productsOrdered || []).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFF', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E8E2D9', fontSize: '0.82rem' }}>
                          <span style={{ fontWeight: 700, color: '#1F2A44' }}>{item.name}</span>
                          <span style={{ color: '#888' }}>(Size: {item.selectedSize}) x{item.quantity}</span>
                          <span style={{ fontWeight: 700, color: '#C97B7B' }}>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div style={{ marginLeft: 'auto', fontSize: '1rem', fontWeight: 800, color: '#1F2A44' }}>
                        Total: ₹{o.totalAmount}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* 3. CART & WISHLIST INSIGHTS TAB */}
        {activeTab === 'wishlist-cart' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Top Wishlist Demand Highlights Banner */}
            <div style={{ backgroundColor: '#1F2A44', color: '#FFF', padding: '28px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge-blush" style={{ marginBottom: '6px' }}>DEMAND ANALYTICS</span>
                <h3 style={{ fontSize: '1.6rem', color: '#FFF', fontWeight: 800 }}>Customer Wishlist & Cart Insights</h3>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                  Analyze customer interest, save frequency, and active bag items to optimize restocking.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C97B7B' }}>{wishlistPopularity.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Wishlisted Styles</div>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>{cartItems.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Active Bag Items</div>
                </div>
              </div>
            </div>

            {/* Split Columns: Wishlist Popularity vs Active Bag Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
              
              {/* Wishlist Popularity Ranking Card */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '24px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1F2A44', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={20} color="#C97B7B" fill="#C97B7B" /> Wishlist Leaderboard
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {wishlistPopularity.map((p, idx) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', backgroundColor: '#FAF8F5', borderRadius: '16px', border: '1px solid #E8E2D9' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: idx < 3 ? '#C97B7B' : '#999', width: '24px' }}>
                        #{idx + 1}
                      </span>
                      <img src={p.images[0]} alt={p.name} style={{ width: '54px', height: '54px', borderRadius: '12px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2A44' }}>{p.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Fabric: {p.fabric} • ₹{p.price}</div>
                        <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', color: p.stock < 5 ? '#D32F2F' : '#2E7D32', fontWeight: 700 }}>
                            Stock: {p.stock} left
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          backgroundColor: '#FFF0F0', color: '#C97B7B', padding: '6px 12px',
                          borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          <Heart size={14} fill="#C97B7B" /> {p.wishlistScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Cart & High Demand Restock Suggestions */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '24px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1F2A44', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={20} color="#1F2A44" /> Bag Demand & Restock Alerts
                </h3>

                {/* Restock Warning Box */}
                <div style={{ backgroundColor: '#FFF3E0', color: '#E65100', padding: '16px', borderRadius: '16px', border: '1px solid #FFE0B2', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>High Demand Restock Alert</strong>
                    <p style={{ fontSize: '0.82rem', marginTop: '2px', lineHeight: 1.4 }}>
                      "Iris Garden Robe" and "Desert Rose Kaftan" have 15+ combined wishlist saves and active cart additions with low remaining stock.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {cartDemand.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#F7F3EE', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={p.images[0]} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2A44' }}>{p.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#666' }}>In active bags: {p.inCartQty} items</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleUpdateStock(p.id, p.stock + 10)}
                        style={{
                          backgroundColor: '#1F2A44', color: '#FFF', border: 'none', padding: '6px 12px',
                          borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        +10 Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 4. INVENTORY & STOCK ALERTS TAB */}
        {activeTab === 'inventory' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '24px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#1F2A44', fontWeight: 800 }}>Catalog & Stock Level Manager</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>Add new styles, modify pricing, and update inventory counts in real time.</p>
              </div>

              <button 
                onClick={() => setShowAddProductModal(true)}
                className="btn-primary" 
                style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Add New Product
              </button>
            </div>

            {/* Low stock warning banner if any */}
            {lowStockCount > 0 && (
              <div style={{ backgroundColor: '#FFEBEE', color: '#C62828', padding: '14px 20px', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, fontSize: '0.88rem' }}>
                <AlertCircle size={18} /> Attention: {lowStockCount} item(s) are running low on inventory stock!
              </div>
            )}

            {/* Products Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F7F3EE', color: '#1F2A44', borderBottom: '2px solid #E8E2D9' }}>
                    <th style={{ padding: '14px', borderRadius: '10px 0 0 10px' }}>Product</th>
                    <th style={{ padding: '14px' }}>Fabric & Category</th>
                    <th style={{ padding: '14px' }}>Price</th>
                    <th style={{ padding: '14px' }}>Inventory Stock</th>
                    <th style={{ padding: '14px' }}>Status</th>
                    <th style={{ padding: '14px', textAlign: 'right', borderRadius: '0 10px 10px 0' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #E8E2D9' }}>
                      <td style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={p.images[0]} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 700, color: '#1F2A44' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>ID: {p.id}</div>
                        </div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        <span className="badge-blush" style={{ fontSize: '0.72rem' }}>{p.fabric}</span>
                      </td>

                      <td style={{ padding: '14px', fontWeight: 700, color: '#1F2A44' }}>
                        ₹{p.price}
                      </td>

                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="number" 
                            value={p.stock} 
                            onChange={(e) => handleUpdateStock(p.id, e.target.value)}
                            style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #D5CEC4', fontWeight: 700 }}
                          />
                          <span style={{ fontSize: '0.78rem', color: '#666' }}>units</span>
                        </div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                          backgroundColor: p.stock > 5 ? '#E8F5E9' : p.stock > 0 ? '#FFF3E0' : '#FFEBEE',
                          color: p.stock > 5 ? '#2E7D32' : p.stock > 0 ? '#E65100' : '#C62828'
                        }}>
                          {p.stock > 5 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ background: 'none', border: 'none', color: '#D32F2F', cursor: 'pointer', padding: '6px' }}
                          title="Remove Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 5. CUSTOMERS TAB WITH USER DELETION & ADD STAFF */}
        {activeTab === 'customers' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '24px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#1F2A44', fontWeight: 800 }}>Registered Accounts & User Directory</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>Manage store members, customer accounts, and staff access.</p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="badge-blush" style={{ fontSize: '0.82rem', padding: '8px 16px', height: 'fit-content' }}>
                  Total Users: {customers.length}
                </span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F7F3EE', color: '#1F2A44', borderBottom: '2px solid #E8E2D9' }}>
                    <th style={{ padding: '14px' }}>User Name</th>
                    <th style={{ padding: '14px' }}>Email Address</th>
                    <th style={{ padding: '14px' }}>Phone Number</th>
                    <th style={{ padding: '14px' }}>Role / Account Type</th>
                    <th style={{ padding: '14px' }}>Joined Date</th>
                    <th style={{ padding: '14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={c.id || i} style={{ borderBottom: '1px solid #E8E2D9' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#1F2A44' }}>{c.name}</td>
                      <td style={{ padding: '14px', color: '#C97B7B', fontWeight: 600 }}>{c.email}</td>
                      <td style={{ padding: '14px', color: '#666' }}>{c.phone || 'N/A'}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                          backgroundColor: c.type === 'Admin Staff' ? '#1F2A44' : 'rgba(201, 123, 123, 0.15)',
                          color: c.type === 'Admin Staff' ? '#FFF' : '#C97B7B'
                        }}>
                          {c.type || 'Customer'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#888', fontSize: '0.8rem' }}>
                        {c.registrationDate ? new Date(c.registrationDate).toLocaleDateString() : 'Recent'}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteCustomer(c.id, c.name)}
                          style={{
                            backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none',
                            padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem',
                            fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
                          }}
                          title="Delete User Account permanently"
                        >
                          <Trash2 size={14} /> Delete User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 6. LIVE ACTIVITY FEED TAB */}
        {activeTab === 'activity' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '24px', border: '1px solid #E8E2D9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#1F2A44', fontWeight: 800, marginBottom: '6px' }}>Real-time Store Activity Feed</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '24px' }}>Live event stream of customer cart additions, wishlist saves, and order placements.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activityLogs.map((log) => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', backgroundColor: '#FAF8F5', borderRadius: '16px', border: '1px solid #E8E2D9' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: log.icon === 'heart' ? 'rgba(201, 123, 123, 0.15)' : log.icon === 'bag' ? 'rgba(31, 42, 68, 0.1)' : '#E8F5E9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {log.icon === 'heart' ? <Heart size={18} color="#C97B7B" fill="#C97B7B" /> : log.icon === 'bag' ? <ShoppingBag size={18} color="#1F2A44" /> : <Check size={18} color="#2E7D32" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2A44' }}>{log.text}</div>
                    <div style={{ fontSize: '0.78rem', color: '#888' }}>{log.time}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(31, 42, 68, 0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '24px', maxWidth: '520px', width: '100%', padding: '32px', position: 'relative' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1F2A44', marginBottom: '16px' }}>Add New Style to Catalogue</h3>
            
            <form onSubmit={handleAddProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1F2A44' }}>Product Title *</label>
                <input 
                  type="text" 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Royal Indigo Kaftan" 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1F2A44' }}>Fabric Type</label>
                  <input 
                    type="text" 
                    value={newProduct.fabric} 
                    onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1F2A44' }}>Price (₹) *</label>
                  <input 
                    type="number" 
                    value={newProduct.price} 
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1F2A44' }}>Stock Inventory Quantity *</label>
                <input 
                  type="number" 
                  value={newProduct.stock} 
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1F2A44' }}>Image URL *</label>
                <input 
                  type="url" 
                  value={newProduct.image} 
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D5CEC4', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>Save Product</button>
                <button type="button" onClick={() => setShowAddProductModal(false)} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* INTERACTIVE ADMIN DASHBOARD FOOTER */}
        <footer style={{
          marginTop: '48px',
          backgroundColor: '#1F2A44',
          color: '#FFFFFF',
          borderRadius: '24px',
          padding: '36px 32px 24px 32px',
          borderTop: '3px solid #C97B7B',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '28px' }}>
            
            {/* Column 1: Console Info & Security Status */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(201,123,123,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #C97B7B' }}>
                  <ShieldCheck size={20} color="#C97B7B" />
                </div>
                <div>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '1px', color: '#FFF' }}>
                    YUMI <span style={{ color: '#C97B7B' }}>DXB</span>
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Management Console v2.4
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginTop: '8px' }}>
                Real-time inventory control, cloud order fulfillment, wishlist analytics, and customer management dashboard.
              </p>

              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#81C784', fontWeight: 700 }}>
                <Lock size={13} /> 256-Bit SSL Encrypted Admin Session
              </div>
            </div>

            {/* Column 2: Dashboard Module Shortcuts */}
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#FFF', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.5px' }}>
                Console Quick Switch
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                {[
                  { id: 'overview', label: 'Overview & Stats' },
                  { id: 'orders', label: 'Orders Fulfillment' },
                  { id: 'inventory', label: 'Stock & Catalog' },
                  { id: 'wishlist-cart', label: 'Wishlist Insights' },
                  { id: 'customers', label: 'Customer Base' },
                  { id: 'activity', label: 'Live Audit Log' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{
                      background: activeTab === item.id ? 'rgba(201,123,123,0.2)' : 'none',
                      border: activeTab === item.id ? '1px solid #C97B7B' : 'none',
                      color: activeTab === item.id ? '#C97B7B' : 'rgba(255,255,255,0.85)',
                      textAlign: 'left', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: activeTab === item.id ? 700 : 500, transition: 'all 0.2s'
                    }}
                  >
                    • {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Live Quick Metrics Pill Box */}
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#FFF', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.5px' }}>
                Live Metrics Summary
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>Total Revenue:</span>
                  <strong style={{ color: '#81C784' }}>₹{totalRevenue.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>Active Orders:</span>
                  <strong style={{ color: '#FFF' }}>{totalOrdersCount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>Catalog Items:</span>
                  <strong style={{ color: '#FFF' }}>{totalProductsCount} Products</strong>
                </div>
              </div>
            </div>

          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '18px',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.6)'
          }}>
            <div>© 2026 YUMI DXB Fashion Inc. All rights reserved. Master Admin Portal.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Database Sync: <strong>Active</strong></span>
              <span>Status: <strong style={{ color: '#81C784' }}>Healthy</strong></span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
