# 👗 YUMI DXB Fashion — Luxury E-Commerce Platform

A state-of-the-art luxury loungewear, kaftan, and pyjama e-commerce web application featuring AI-powered styling assistance, voice search, modular payment gateway simulation, RFC-compliant email notifications, customer account management, and real-time administrative store control.
---

## ✨ Core Features

### 🤖 AI Shopping Chatbot & Voice Assistant ("YUMI AI Assistant & Voice")
- **Voice Assistant (Speech-to-Text)**: Speak directly into your microphone using the Web Speech API (`window.SpeechRecognition` / `webkitSpeechRecognition`). Handles browser permissions gracefully.
- **Text-to-Speech Responses**: Reads AI recommendations aloud using `window.speechSynthesis` with built-in voice selection and a dedicated Mute/Unmute control button.
- **Smart Outfit Recommendations**: Delivers interactive product recommendation cards inside the chat window with one-click **Add to Bag** capabilities.
- **Conversational Knowledge Base**: Provides instant answers regarding sizing, fabric care (*Modal Satin, Silk Velvet, Pure Cotton*), delivery timeframes, order tracking, and active coupon codes.
- **Smart Modal Auto-Close**: AI chat widget automatically minimizes when opening the Shopping Bag drawer or Checkout modal to ensure zero visual overlap.

### 🛍️ Storefront & Customer Experience
- **Interactive Catalog**: Search by product title, filter by material category (*Modest Wear, Nightwear, Robes, Kaftans, Lounge Sets*), and sort by price or rating.
- **Product Card "View Details"**: Every product card presents a prominent **"View Details"** action with an eye icon, opening the product modal for image preview, size selection (`S`, `M`, `L`, `XL`, `Free Size`), and instant purchase.
- **Dynamic Shopping Cart**: Slide-out cart drawer for size adjustments, quantity management, express shipping calculations, and real-time total updates.
- **Express Checkout**: Multi-step checkout form with real-time address validation and payment selection (UPI, Credit/Debit Card, NetBanking, and Cash on Delivery).

### 💳 Modular Payment Gateway Simulator (`src/services/paymentGateway.js`)
- **Simulated Payment Flows**: Realistically models online payment processing delays and transaction outcomes.
- **Test Gateway Switcher**: During checkout, test payment scenarios using interactive control modes:
  - `🟢 Success Mode`: Generates bank authorization reference numbers and unique transaction IDs (`TXN-PAY-XXXXXXXX`).
  - `🔴 Bank Failure Mode`: Simulates card/UPI authorization decline with error messaging.
  - `🟡 User Cancellation Mode`: Simulates payment window cancellation by the customer.
- **Pluggable Architecture**: Built with a decoupled provider interface (`PaymentGateway.setProvider()`) enabling seamless swap-in of live Razorpay, Stripe, PayU, or PayPal SDKs with zero component code changes.

### 📧 Modular Email Service (`src/services/emailService.js`)
- **RFC 5322 Email Validation**: Strong regex validation for customer email formatting in checkout and contact inquiry forms.
- **Automated Email Notifications**: Asynchronously dispatches order receipts, cancellation notices, and support inquiry acknowledgments.
- **Pluggable Provider Interface**: Configured with `EmailService.setProvider()` to easily swap in EmailJS, SendGrid, Resend, or AWS SES.

### 📄 GST Tax Receipt & Invoice Generator
- **Itemized Financial Breakdown**: Calculates Subtotal, Festive Discounts, Delivery Charges, CGST (9%), SGST (9%), Total GST (18%), and Net Amount Paid.
- **Downloadable PDF Tax Invoice**: Download official tax receipts directly from the Customer Portal or order confirmation screen.

### 👤 Customer Account Lounge
- **Sign Up & Sign In Flow**: Instant modal access from storefront header with direct 1-click toggling between account registration and login.
- **Order Tracking & Management**: View full order history with live status tags (*Processing*, *Shipped*, *Delivered*, *Customer Cancelled*).
- **Customer Order Cancellation**: Allows customers to cancel active processing orders directly with single-click confirmation.
- **Profile & Delivery Address**: Update default shipping address and mobile phone details stored in LocalStorage/Firestore.
- **Interactive Customer Footer**: Dark navy footer featuring quick navigation shortcuts, live order summary metrics, and SSL session badges.

### 🛡️ Admin Management Dashboard
- **Interactive Control Bar**: Top admin header with live ticking clock, database sync status indicator, `+ Add New Product` shortcut, `Refresh Data` rotation button, and `Storefront` switch button.
- **Order Fulfillment Pipeline**: Update order status (*Processing*, *Shipped*, *Delivered*, *Customer Cancelled*) and sync updates instantly across the application.
- **Inventory Management**: Create new loungewear items, update product stock levels, adjust pricing, and edit existing catalog records.
- **Interactive Console Footer**: Administrative footer with console quick-switch modules, real-time store metrics (*Total Revenue*, *Active Orders*, *Catalog Count*), and 256-Bit SSL protection notice.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8
- **AI & Speech**: Web Speech API (Speech Recognition & Speech Synthesis)
- **Icons**: Lucide React (`lucide-react`)
- **Database / Storage**: Hybrid Storage (Firebase Firestore + LocalStorage fallback engine)
- **Email Service**: Modular RFC-validated Email Service (`src/services/emailService.js`)
- **Payment Engine**: Modular Payment Gateway Sandbox (`src/services/paymentGateway.js`)
- **Styling**: Modern CSS3 (Vanilla CSS with Custom Tokens, Glassmorphism, Responsive Grid & Flexbox)
- **Deployment**: Vercel SPA (`vercel.json`)
- **Linter**: Oxlint

---

## 🔑 Default Login Credentials

### 🛡️ Store Admin Dashboard
- **Access**: Click **Sign Up / Sign In** in header → switch to **🔒 Admin** tab.
- **Username / Email**: `admin` *(or `admin@yumidxb.com`)*
- **Password**: `admin123`

### 👤 Demo Customer Account
- **Access**: Click **Sign Up / Sign In** in header → enter credentials.
- **Email**: `priya@example.com` *(or `ananya@example.com`)*
- **Password**: `customer123`

---

## 📁 Project Structure

```text
yumi-dxb-fashion/
├── public/                     # Favicons, brand logo, and public images
├── src/
│   ├── components/             # React UI Components
│   │   ├── AdminDashboard.jsx          # Admin Portal with header, footer & stock control
│   │   ├── CartDrawer.jsx              # Slide-out Shopping Bag
│   │   ├── CheckoutModal.jsx           # Multi-payment checkout with simulator & email trigger
│   │   ├── ContactSection.jsx          # Contact form & newsletter with email validation
│   │   ├── CustomerDashboard.jsx       # Customer orders, cancellation & profile lounge
│   │   ├── CustomerLoginModal.jsx      # Unified Sign Up & Sign In modal
│   │   ├── FashionAiAssistant.jsx      # AI Chatbot & Speech API Voice Assistant
│   │   ├── Header.jsx                  # Storefront sticky navigation header
│   │   ├── Hero.jsx                    # Banner hero section
│   │   ├── OrderConfirmationModal.jsx  # Order success & downloadable PDF invoice
│   │   ├── ProductCatalog.jsx          # Product grid with "View Details" cards
│   │   ├── ProductDetailModal.jsx      # Product image gallery, size selector & cart trigger
│   │   └── ...
│   ├── config/
│   │   └── firebase.js         # Firebase Firestore & LocalStorage database engine
│   ├── data/
│   │   └── products.js         # Seed catalog products & brand metadata
│   ├── services/
│   │   ├── db.js               # Database abstraction layer
│   │   ├── emailService.js     # Modular RFC email validation & provider interface
│   │   └── paymentGateway.js   # Modular payment gateway simulator (Success, Fail, Cancel)
│   ├── styles/
│   │   └── theme.css           # Global luxury color tokens & SVG icon alignment rules
│   ├── App.jsx                 # Application root & tab state routing
│   ├── main.jsx                # React DOM entry point
│   └── index.css               # Global base CSS
├── vercel.json                 # Vercel SPA rewrite configuration
├── package.json                # Project dependencies & build scripts
├── vite.config.js              # Vite configuration
└── README.md                   # Comprehensive documentation
```

---

## 🚀 Local Setup Instructions

Follow these steps to run the application locally on your computer:

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm or yarn

### 1. Clone or Download the Repository
```bash
git clone https://github.com/YOUR_USERNAME/yumi-dxb-fashion.git
cd yumi-dxb-fashion
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Local Development Server
```bash
npm run dev
```
Open your web browser and navigate to **`http://localhost:5173`**.

---

## 🌐 Environment Variables (Optional)

To connect the application to Firebase Firestore, create a `.env` file in the project root directory:

```env
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```
*(If omitted, the platform runs in high-performance browser `LocalStorage` mode automatically).*

---

## ☁️ Deployment Guide (Vercel)

This project includes a pre-configured `vercel.json` file for single-click deployment on **Vercel**.

1. Push your code to your GitHub, GitLab, or Bitbucket repository.
2. Sign in to **[Vercel](https://vercel.com/)**.
3. Click **Add New...** → **Project** and import your repository.
4. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Launches local development server at `http://localhost:5173` |
| `npm run build` | Compiles production build bundle into `dist/` |
| `npm run preview` | Previews the production build bundle locally |
| `npm run lint` | Runs code quality audit |

---

## 📄 License

This project is licensed under the MIT License.
