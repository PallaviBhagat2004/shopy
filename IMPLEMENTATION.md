# KartIQ — Implementation Guide

A step-by-step walkthrough of the **KartIQ** MERN e-commerce application, explaining what each piece does and how data flows through the system.

---

## 🎯 What You're Building

**KartIQ** is a MERN e-commerce platform where users can:
- Browse and search products
- Add items to a persistent cart with quantities, images, price, stock
- Check out and place orders
- View order history and profile
- Admins can add/edit/delete products and manage orders

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTP/JSON    ┌──────────────────┐    Mongoose    ┌─────────────┐
│  React Frontend │ ───────────────▶│  Express Backend │ ──────────────▶│   MongoDB   │
│   (Vite, 3000)  │◀─── JSON ───────│  REST API (5000) │◀───────────────│             │
└─────────────────┘                 └──────────────────┘                └─────────────┘
```

- **Frontend** (React + Vite): UI, routing, state management via Context API
- **Backend** (Node + Express): REST API with JWT auth and role-based authorization
- **Database** (MongoDB + Mongoose): Users, Products, Carts, Orders

---

## 📁 Project Structure

```
kartiq-ecommerce/
├── IMPLEMENTATION.md           ← You are here
├── README.md
├── backend/
│   ├── server.js               ← Express entry point
│   ├── config/db.js            ← MongoDB connection
│   ├── models/                 ← Mongoose schemas
│   │   ├── User.js             ← Auth + roles
│   │   ├── Product.js          ← Catalog items
│   │   ├── Cart.js             ← Per-user cart
│   │   └── Order.js            ← Orders + line items
│   ├── middleware/
│   │   ├── auth.js             ← JWT verification + admin check
│   │   └── errorHandler.js
│   ├── controllers/            ← Business logic per resource
│   ├── routes/                 ← Express routers
│   └── utils/
│       ├── generateToken.js    ← JWT helper
│       └── seedProducts.js     ← Sample product data
└── frontend/
    ├── src/
    │   ├── context/            ← AuthContext + CartContext
    │   ├── api/axios.js        ← Axios instance with JWT interceptor
    │   ├── components/         ← Navbar, ProductCard, route guards
    │   └── pages/              ← Home, Login, Cart, Checkout, Admin…
```

---

## 🔐 STEP 1 — User Model & Authentication

**File:** `backend/models/User.js`

### What happens
1. `User` schema stores `name`, `email`, `password`, and `role` (`customer` or `admin`).
2. A **pre-save hook** automatically hashes the password with bcrypt BEFORE saving to DB — so plain passwords never touch the database.
3. A `matchPassword()` instance method compares a plaintext password to the stored hash during login.

### Why
- **bcrypt** uses a salt + cost factor so identical passwords produce different hashes (protects against rainbow tables).
- Role field enables **authorization** — same endpoint, different permissions.

---

## 🎫 STEP 2 — JWT Generation & Middleware

**Files:** `backend/utils/generateToken.js`, `backend/middleware/auth.js`

### What happens
1. On login/register success, the server signs a **JWT** containing the user's `id` with `JWT_SECRET` (valid 30 days).
2. Client stores token in `localStorage` and sends it as `Authorization: Bearer <token>` on every request.
3. `protect` middleware reads the header, verifies the token, looks up the user, and attaches it to `req.user`.
4. `admin` middleware runs AFTER `protect` and rejects any request where `req.user.role !== 'admin'`.

### Route guards
```
Public      → /api/products (GET)
Protected   → /api/cart, /api/orders, /api/auth/profile
Admin-only  → POST/PUT/DELETE /api/products, GET /api/orders/all
```

---

## 📦 STEP 3 — Product Model & CRUD

**Files:** `backend/models/Product.js`, `controllers/productController.js`

### What happens
- Schema: `name`, `description`, `price`, `image`, `category`, `brand`, `stock`, `rating`, `numReviews`.
- Public endpoints: **list** (with search + category + price filters + pagination), **get by ID**.
- Admin endpoints: **create, update, delete**.
- Filter logic uses MongoDB queries:
  ```js
  Product.find({
    name: { $regex: keyword, $options: 'i' },
    category,
    price: { $gte: minPrice, $lte: maxPrice }
  }).limit(pageSize).skip(pageSize * (page - 1))
  ```

---

## 🛒 STEP 4 — Cart (Add-to-Cart with Full Details)

**Files:** `backend/models/Cart.js`, `controllers/cartController.js`

### What happens
Each user has **one** Cart document. Each `items` entry stores a **snapshot** of the product (name, price, image) PLUS the `product` reference — so if a product is deleted or its price changes, the cart line keeps its original details.

```js
{
  user: ObjectId,
  items: [{
    product: ObjectId,   // reference
    name: String,        // snapshot
    image: String,       // snapshot
    price: Number,       // snapshot at time of add
    quantity: Number
  }],
  totalPrice: Number     // recomputed on every save
}
```

### Endpoints
| Method | Endpoint           | Action                       |
| ------ | ------------------ | ---------------------------- |
| GET    | `/api/cart`        | Fetch current user's cart    |
| POST   | `/api/cart`        | Add item (or +1 if exists)   |
| PUT    | `/api/cart/:pid`   | Update quantity              |
| DELETE | `/api/cart/:pid`   | Remove one line item         |
| DELETE | `/api/cart`        | Clear entire cart            |

A `pre-save` hook recalculates `totalPrice` every time the cart is modified.

---

## 📋 STEP 5 — Orders & Checkout

**Files:** `backend/models/Order.js`, `controllers/orderController.js`

### What happens on checkout
1. User sends shipping address + payment method to `POST /api/orders`.
2. Controller reads the user's cart → copies items + total into a new `Order` document.
3. **Decrements stock** on each ordered product (atomic `$inc`).
4. **Clears the cart.**
5. Returns the order to the frontend, which navigates to "Order Success" / "My Orders".

### Order lifecycle
```
pending → paid → shipped → delivered
```
Admin can update status via `PUT /api/orders/:id/status`.

---

## ⚛️ STEP 6 — Frontend: Context API for Global State

**Files:** `frontend/src/context/AuthContext.jsx`, `CartContext.jsx`

### Why Context (and not Redux)?
For this app's scope, React Context + `useReducer` is plenty — two pieces of global state:
- **Auth**: current user, login/logout/register, JWT persistence.
- **Cart**: cart items, add/update/remove/clear, total.

Both contexts sync with the backend AND localStorage so refreshing the page doesn't log you out or empty your cart.

---

## 🎨 STEP 7 — Frontend Pages & Routing

React Router v6 with three route-guard tiers:

| Component          | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `<Route>`          | Public (Home, Login, Product pages)       |
| `<PrivateRoute>`   | Logged-in users only (Cart, Orders)       |
| `<AdminRoute>`     | Admins only (Dashboard, Product editor)   |

### Pages
- **Home** — Hero banner, featured products, categories
- **ProductList** — Grid with search, filter, sort, pagination
- **ProductDetail** — Full info, quantity selector, Add to Cart button
- **Cart** — Line items, qty editor, remove, subtotal
- **Checkout** — Shipping form + payment method + place order
- **Orders** — User's past orders with status
- **Profile** — Edit account info
- **AdminDashboard** — Tabs for Products / Orders

---

## 🛡️ STEP 8 — Security Checklist

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT with strong secret in `.env` (never commit)
- ✅ Role-based authorization on every admin endpoint
- ✅ CORS configured for the frontend origin
- ✅ Mongoose sanitization prevents NoSQL injection
- ✅ Input validation on all write endpoints
- ⚠️ In production: add rate limiting (`express-rate-limit`), HTTPS, helmet, CSRF for cookie-based auth

---

## 🚀 STEP 9 — Running the App

### Prerequisites
- Node.js 18+
- MongoDB running locally (or Atlas URL)

### Run backend
```bash
cd backend
npm install
# Edit .env: set MONGO_URI, JWT_SECRET
npm run seed      # loads sample products + admin user
npm run dev       # http://localhost:5000
```

### Run frontend
```bash
cd frontend
npm install
npm run dev       # http://localhost:3000
```

### Seeded admin credentials
```
email: admin@kartiq.com
password: admin123
```

---

## 🔄 Data Flow Example: "Add to Cart"

1. User clicks **Add to Cart** on ProductDetail page.
2. `CartContext.addItem(product, qty)` → calls `POST /api/cart` with JWT.
3. Axios interceptor attaches `Authorization: Bearer ...`.
4. `protect` middleware → decodes token → `req.user` set.
5. `cartController.addToCart`:
   - Finds or creates cart for `req.user._id`.
   - Checks if product already in cart → increments qty OR pushes new item.
   - Saves → pre-save hook recalculates `totalPrice`.
6. Returns updated cart JSON.
7. Frontend context updates → Navbar badge increments → toast "Added to cart".

---

## 🎯 Extending the App — Ideas

- **Payments**: integrate Stripe (`/api/orders/:id/pay`).
- **Reviews**: users rate + review purchased products.
- **Wishlist**: separate collection or flag on cart.
- **Image uploads**: Cloudinary/S3 for admin product uploads.
- **Email**: Nodemailer for order confirmations.
- **Real-time**: Socket.io for order status updates.

---

**That's it!** Read through each numbered step, then open the matching file in the codebase — the inline comments tie back to this doc.
