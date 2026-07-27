# 👗 YUMI DXB Fashion — Luxury E-Commerce Platform

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Default Login Credentials](#-default-login-credentials)
- [Project Structure](#-project-structure)
- [Local Setup Instructions](#-local-setup-instructions)
- [Environment Variables](#-environment-variables)
- [Deployment Guide (Vercel)](#-deployment-guide-vercel)
- [Available Scripts](#-available-scripts)

---

## ✨ Features

### 🛍️ Storefront & Customer Experience
- **Interactive Catalog**: Filter by category (*Modest Wear, Nightwear, Robes, Kaftans, Lounge Sets*), search by keyword, and view detailed product specs.
- **Product Details & Quick View**: Modal view with high-res gallery images, fabric composition, available sizes (`S`, `M`, `L`, `XL`, `Free Size`), care instructions, and stock indicators.
- **Dynamic Shopping Cart**: Slide-out drawer to add/remove items, select size variants, and view order summary with tax & shipping calculations.
- **Express Checkout**: Streamlined multi-step checkout supporting UPI, Card, and Cash on Delivery (COD) payment options with real-time address validation.
- **Customer Portal**: Customer registration & login, profile management, and order history tracking.

### 🔐 Admin Management Dashboard
- **Passcode Protected**: Secure admin authentication via `?admin=true` URL parameter or footer link.
- **Inventory Management**: Add new products with custom images, update prices/stock levels, and edit or delete existing items.
- **Order Management**: Real-time order fulfillment pipeline (change status to *Processing*, *Shipped*, *Delivered*, or *Cancelled*, and attach tracking IDs).
- **Analytics & Insights**: Monitor total sales revenue, order counts, top-selling items, visitor traffic metrics, and customer distribution.

### 💾 Dual Database Engine
- **Hybrid Storage System**: Automatically connects to **Firebase Firestore** when API keys are provided.
- **Zero-Config Local Storage Fallback**: Gracefully falls back to browser `LocalStorage` mode when running offline or without cloud API keys — zero crash risk!

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8
- **Icons**: Lucide React (`lucide-react`)
- **Database / Cloud**: Firebase 12 (Firestore & Auth optional) + Web Storage API (LocalStorage fallback)
- **Styling**: Modern CSS3 Custom Properties (Design tokens, Glassmorphism, Responsive Flexbox & Grid)
- **Linter**: Oxlint

---

## 🌍 Language & Software Requirements

- **Language**: English for the user interface and documentation; the project is built using JavaScript/JSX with React.
- **Software Requirements**: Visual Studio Code (recommended), Node.js 18 or higher, npm or yarn, Git, and a modern web browser such as Chrome or Edge.

---

## 🔑 Default Login Credentials

### 🛡️ Admin Dashboard
- **Passcode**: `admin123`
- **Username**: `yumi_owner`
- **Access Link**: Append `?admin=true` to your site URL or click "Admin Login" in the footer.

### 👤 Demo Customer Account
- **Email**: `priya@example.com` *(or `ananya@example.com`)*
- **Password**: `customer123`

---

## 📁 Project Structure

```text
yumi-dxb-fashion/
├── public/                 # Static assets (favicons, logos)
├── src/
│   ├── assets/             # Branding & visual assets
│   ├── components/         # React Components
│   │   ├── AdminDashboard.jsx       # Complete Admin Management Portal
│   │   ├── CartDrawer.jsx           # Slide-out Shopping Cart
│   │   ├── CheckoutModal.jsx        # Multi-payment Checkout Gateway
│   │   ├── CustomerDashboard.jsx    # Customer Profile & Order History
│   │   ├── CustomerLoginModal.jsx   # Login & Account Registration
│   │   ├── Header.jsx               # Navigation & Search Bar
│   │   ├── ProductCatalog.jsx       # Product Grid & Category Filters
│   │   ├── ProductDetailModal.jsx   # Detailed Product Specs View
│   │   └── ...
│   ├── config/
│   │   └── firebase.js     # Hybrid Firebase & Local Storage Initializer
│   ├── data/
│   │   └── products.js     # Default Seed Catalog & Brand Details
│   ├── services/
│   │   └── db.js           # Database Abstraction Layer (LocalStorage + Firestore)
│   ├── styles/
│   │   └── theme.css       # Global Design Tokens & Luxury Theme Styles
│   ├── App.jsx             # Main Application Root & State Handler
│   ├── main.jsx            # React Entry Point
│   └── index.css           # Global CSS rules
├── .env.example            # Environment variables template
├── package.json            # Dependencies & Scripts
├── vite.config.js          # Vite Build Configuration
└── README.md               # Documentation
```

---

## 🚀 Local Setup Instructions

Follow these steps to run the project locally on your machine:

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/yumi-dxb-fashion.git
cd yumi-dxb-fashion
```

### 2. Install Dependencies
```bash
npm install
```

### 3. (Optional) Set Up Environment Variables
Create a `.env` file in the project root directory if you want to connect to Firebase:
```bash
cp .env.example .env
```
*(If omitted, the app automatically runs in LocalStorage Database Mode).*

### 4. Start the Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🌐 Environment Variables

If connecting to Firebase Firestore, configure the following variables in your `.env` file or hosting provider:

```env
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

---

## ☁️ Deployment Guide (Vercel)

This project is optimized for 1-click deployment on **Vercel**.

### Deploy via Vercel Dashboard (Recommended)

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Sign in to **[Vercel](https://vercel.com/)**.
3. Click **Add New...** → **Project**.
4. Import your repository. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. *(Optional)* Add your `VITE_FIREBASE_*` environment variables.
6. Click **Deploy**.

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server at `http://localhost:5173` |
| `npm run build` | Compiles production-ready bundle into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs oxlint to verify code quality |

---

## 📄 License

This project is open-source and available under the MIT License.

