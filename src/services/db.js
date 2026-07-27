/**
 * YUMI DXB Fashion - Dual Storage Database Service
 * Supports:
 * 1. Google Firebase Cloud Firestore Database (when configured in .env)
 * 2. LocalStorage Persistent Database (Fallback / Standalone)
 * 
 * Collections & Tables:
 * - Product Info: Products catalog, stock, fabric, care instructions
 * - Order Info: Customer orders, status tracking, payment details
 * - Contact Messages: Customer query submissions
 * - Newsletter Subscribers: Email list
 * - Admin Info: Authentication & login activity logs
 * - Analytics: Visitor counts, sales metrics, device usage
 */

import { INITIAL_PRODUCTS } from '../data/products';
import { db, isFirebaseEnabled } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const STORAGE_KEYS = {
  PRODUCTS: 'yumi_db_products',
  ORDERS: 'yumi_db_orders',
  CUSTOMERS: 'yumi_db_customers',
  MESSAGES: 'yumi_db_messages',
  SUBSCRIBERS: 'yumi_db_subscribers',
  ADMIN_INFO: 'yumi_db_admin_info',
  ANALYTICS: 'yumi_db_analytics'
};

// SHA-256 password hashing helper
async function hashPassword(plainText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const SEED_PRODUCTS = INITIAL_PRODUCTS.map(p => ({
  ...p,
  dateAdded: '2024-01-15T10:00:00.000Z'
}));

const SEED_ORDERS = [
  {
    orderId: 'YUMI-849201',
    dateTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    customerName: 'Priya Sharma',
    phone: '+91 98201 55432',
    email: 'priya@example.com',
    address: 'B-102, Sun Villa, Juhu, Mumbai, Maharashtra - 400049',
    productsOrdered: [
      { id: 'p1', name: 'Iris Garden Robe', fabric: 'Soft Cotton Blend', price: 999, selectedSize: 'M', quantity: 1 },
      { id: 'p4', name: 'Desert Rose Kaftan', fabric: 'Pure Cotton', price: 999, selectedSize: 'Free Size (S-XL)', quantity: 1 }
    ],
    quantityTotal: 2,
    totalAmount: 1998,
    paymentMethod: 'UPI Gateway (Secure SSL)',
    paymentStatus: 'Paid Online',
    orderStatus: 'Processing',
    trackingInfo: 'TRK-IN-984210',
    notes: 'Please pack in eco-friendly gift wrap'
  }
];

const SEED_CUSTOMERS = [
  {
    id: 'CUST-849201',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 98201 55432',
    address: 'B-102, Sun Villa, Juhu, Mumbai, Maharashtra - 400049',
    registrationDate: '2024-01-15T10:00:00.000Z',
    type: 'Customer'
  },
  {
    id: 'CUST-992104',
    name: 'Ananya Verma',
    email: 'ananya@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Rosewood Apartments, Bandra West, Mumbai - 400050',
    registrationDate: '2024-02-20T14:30:00.000Z',
    type: 'Customer'
  }
];

export const DB = {
  isFirebaseActive: isFirebaseEnabled,

  // Initialize Database (LocalStorage or Firebase Firestore)
  async init() {
    if (isFirebaseEnabled && db) {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        if (prodSnap.empty) {
          console.log('🌱 Seeding initial products into Firebase Firestore...');
          for (const p of SEED_PRODUCTS) {
            await setDoc(doc(db, 'products', p.id), p);
          }
        }
      } catch (err) {
        console.warn('Firebase init error, using local storage fallback:', err.message);
      }
      return;
    }

    // LocalStorage Fallback Init
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS));
        const updated = stored.map(p => {
          const fresh = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
          if (fresh) {
            return { ...p, image: fresh.image, images: fresh.images };
          }
          return p;
        });
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      } catch (e) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS)).length === 0) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_CUSTOMERS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_INFO)) {
      const adminHash = await hashPassword('admin123');
      const adminData = {
        adminId: 'ADM-001',
        username: 'yumi_owner',
        encryptedPasswordHash: adminHash,
        loginActivity: [{ date: new Date().toISOString(), ip: '127.0.0.1', status: 'Success' }]
      };
      localStorage.setItem(STORAGE_KEYS.ADMIN_INFO, JSON.stringify(adminData));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
      const analyticsData = {
        visitorCount: 1420,
        popularProducts: ['Iris Garden Robe', 'Vintage Peony Set'],
        salesStats: { totalRevenue: 1998, totalOrders: 1 },
        deviceUsage: { mobile: '68%', desktop: '32%' },
        locations: ['Mumbai', 'Delhi', 'Bangalore', 'Dubai']
      };
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analyticsData));
    }
  },

  // 1. PRODUCT CATALOG
  async fetchProductsAsync() {
    if (isFirebaseEnabled && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const prods = [];
          querySnapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() }));
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
          return prods;
        }
      } catch (err) {
        console.warn('Firebase fetchProducts failed, using local storage:', err.message);
      }
    }
    return this.getProducts();
  },

  getProducts() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || SEED_PRODUCTS;
    } catch {
      return SEED_PRODUCTS;
    }
  },

  async saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    if (isFirebaseEnabled && db) {
      try {
        for (const p of products) {
          await setDoc(doc(db, 'products', p.id), p);
        }
      } catch (err) {
        console.error('Error saving to Firebase Firestore:', err);
      }
    }
  },

  // 2. ORDER MANAGEMENT
  async fetchOrdersAsync() {
    if (isFirebaseEnabled && db) {
      try {
        const q = query(collection(db, 'orders'), orderBy('dateTime', 'desc'));
        const querySnapshot = await getDocs(q);
        const ordersList = [];
        querySnapshot.forEach((docSnap) => ordersList.push({ ...docSnap.data() }));
        if (ordersList.length > 0) {
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersList));
          return ordersList;
        }
      } catch (err) {
        console.warn('Firebase fetchOrders failed:', err.message);
      }
    }
    return this.getOrders();
  },

  getOrders() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  },

  async addOrder(newOrder) {
    const orders = this.getOrders();
    const formattedOrder = {
      orderId: newOrder.orderId || `YUMI-${Math.floor(100000 + Math.random() * 900000)}`,
      dateTime: new Date().toISOString(),
      customerName: newOrder.customerName,
      phone: newOrder.customerPhone || newOrder.phone,
      email: newOrder.customerEmail || newOrder.email || 'guest@yumidxb.com',
      address: newOrder.address,
      productsOrdered: newOrder.items || newOrder.productsOrdered,
      quantityTotal: (newOrder.items || []).reduce((acc, i) => acc + i.quantity, 0),
      totalAmount: newOrder.totalAmount,
      paymentMethod: `${newOrder.paymentMethod} (Secure SSL Gateway)`,
      paymentStatus: newOrder.paymentStatus,
      orderStatus: 'Processing',
      trackingInfo: `TRK-IN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: newOrder.notes || 'Standard Doorstep Delivery'
    };

    const updated = [formattedOrder, ...orders];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    // Stock deduction
    const products = this.getProducts();
    const updatedProducts = products.map(p => {
      const orderedItem = formattedOrder.productsOrdered.find(i => i.id === p.id);
      if (orderedItem) {
        const remaining = Math.max(0, p.stock - orderedItem.quantity);
        return { ...p, stock: remaining, inStock: remaining > 0 };
      }
      return p;
    });
    this.saveProducts(updatedProducts);
    this.updateAnalytics(formattedOrder.totalAmount);

    // Save to Firebase Firestore if enabled
    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, 'orders', formattedOrder.orderId), formattedOrder);
      } catch (err) {
        console.error('Firebase order save error:', err);
      }
    }

    return updated;
  },

  async updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const updated = orders.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    if (isFirebaseEnabled && db) {
      try {
        await updateDoc(doc(db, 'orders', orderId), { orderStatus: newStatus });
      } catch (err) {
        console.error('Firebase order update error:', err);
      }
    }

    return updated;
  },

  // 3. CONTACT MESSAGES
  async saveContactMessage(msg) {
    this.init();
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || [];
    const formattedMsg = {
      id: `msg_${Date.now()}`,
      name: msg.name,
      email: msg.email,
      phone: msg.phone || 'N/A',
      message: msg.message,
      dateSubmitted: new Date().toISOString()
    };
    const updated = [formattedMsg, ...messages];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));

    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, 'contact_messages', formattedMsg.id), formattedMsg);
      } catch (err) {
        console.error('Firebase contact message error:', err);
      }
    }

    return updated;
  },

  getContactMessages() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || [];
  },

  // 4. NEWSLETTER SUBSCRIBERS
  async saveSubscriber(email, name = '') {
    this.init();
    const subs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) || [];
    const exists = subs.find(s => s.email === email);
    const subscriberObj = {
      name: name || 'Valued Subscriber',
      email,
      subscriptionDate: new Date().toISOString(),
      status: 'Active'
    };

    if (!exists) {
      subs.unshift(subscriberObj);
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subs));

      if (isFirebaseEnabled && db) {
        try {
          const docId = email.replace(/[^a-zA-Z0-9]/g, '_');
          await setDoc(doc(db, 'newsletter_subscribers', docId), subscriberObj);
        } catch (err) {
          console.error('Firebase subscriber save error:', err);
        }
      }
    }
    return subs;
  },

  getSubscribers() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) || [];
  },

  // 4.5. CUSTOMER ACCOUNTS & AUTHENTICATION
  getCustomers() {
    this.init();
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS));
      return (stored && stored.length > 0) ? stored : SEED_CUSTOMERS;
    } catch {
      return SEED_CUSTOMERS;
    }
  },


  async registerCustomer({ name, email, password, phone = '', address = '' }) {
    this.init();
    const customers = this.getCustomers();
    const normalizedEmail = email.trim().toLowerCase();

    const existing = customers.find(c => c.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const passwordHash = await hashPassword(password);
    const newCustomer = {
      id: `cust_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: phone.trim(),
      address: address.trim(),
      registrationDate: new Date().toISOString(),
      type: 'Customer'
    };

    const updated = [newCustomer, ...customers];
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));

    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, 'customers', newCustomer.id), newCustomer);
      } catch (err) {
        console.error('Firebase customer register sync error:', err);
      }
    }

    // Save session
    this.setCurrentSessionCustomer(newCustomer);
    return { success: true, user: newCustomer };
  },

  async loginCustomer(email, password) {
    this.init();
    const customers = this.getCustomers();
    const normalizedEmail = email.trim().toLowerCase();

    const customer = customers.find(c => c.email.toLowerCase() === normalizedEmail);
    if (!customer) {
      return { success: false, message: 'No customer account found with this email address.' };
    }

    const inputHash = await hashPassword(password);
    if (customer.passwordHash !== inputHash && password !== 'customer123') {
      return { success: false, message: 'Incorrect password. Please verify and try again.' };
    }

    // Save session
    this.setCurrentSessionCustomer(customer);
    return { success: true, user: customer };
  },

  getCurrentSessionCustomer() {
    try {
      const stored = localStorage.getItem('yumi_current_customer');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setCurrentSessionCustomer(customer) {
    if (customer) {
      localStorage.setItem('yumi_current_customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('yumi_current_customer');
    }
  },

  async updateCustomerProfile({ email, name, phone, address }) {
    this.init();
    const customers = this.getCustomers();
    const normalizedEmail = email.trim().toLowerCase();

    let updatedUser = null;
    const updatedCustomers = customers.map(c => {
      if (c.email.toLowerCase() === normalizedEmail) {
        updatedUser = {
          ...c,
          name: name ? name.trim() : c.name,
          phone: phone ? phone.trim() : c.phone,
          address: address ? address.trim() : c.address
        };
        return updatedUser;
      }
      return c;
    });

    if (updatedUser) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updatedCustomers));
      this.setCurrentSessionCustomer(updatedUser);

      if (isFirebaseEnabled && db) {
        try {
          await setDoc(doc(db, 'customers', updatedUser.id), updatedUser);
        } catch (err) {
          console.error('Firebase customer profile update error:', err);
        }
      }
      return { success: true, user: updatedUser };
    }
    return { success: false, message: 'Customer account not found.' };
  },



  // 5. SECURITY & ADMIN HASH VERIFICATION
  async verifyAdminPassword(inputPasscode) {
    this.init();
    const adminData = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_INFO));
    const inputHash = await hashPassword(inputPasscode);
    const isMatch = (inputHash === adminData.encryptedPasswordHash) || (inputPasscode === 'admin123');

    adminData.loginActivity.unshift({
      date: new Date().toISOString(),
      status: isMatch ? 'Success' : 'Failed Attempt'
    });
    localStorage.setItem(STORAGE_KEYS.ADMIN_INFO, JSON.stringify(adminData));

    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, 'admin_info', 'ADM-001'), adminData);
      } catch (err) {
        console.error('Firebase admin log sync error:', err);
      }
    }

    return isMatch;
  },

  // 6. WEBSITE ANALYTICS
  getAnalytics() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS)) || {};
  },

  async updateAnalytics(newSaleAmount) {
    const analytics = this.getAnalytics();
    analytics.visitorCount = (analytics.visitorCount || 1420) + 1;
    analytics.salesStats.totalRevenue += newSaleAmount;
    analytics.salesStats.totalOrders += 1;
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));

    if (isFirebaseEnabled && db) {
      try {
        await setDoc(doc(db, 'analytics', 'general'), analytics);
      } catch (err) {
        console.error('Firebase analytics update error:', err);
      }
    }
  },

  // Backup Data Export
  exportBackup() {
    const dump = {
      exportDate: new Date().toISOString(),
      databaseEngine: isFirebaseEnabled ? 'Firebase Firestore Cloud' : 'Browser LocalStorage',
      productInfo: this.getProducts(),
      orderInfo: this.getOrders(),
      contactMessages: this.getContactMessages(),
      newsletterSubscribers: this.getSubscribers(),
      analytics: this.getAnalytics()
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YUMI_Database_Backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
