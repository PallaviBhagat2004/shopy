# 🛒 KartIQ — MERN E-Commerce

A full-stack e-commerce application built with **MongoDB, Express, React, Node.js**.

👉 **For a deep step-by-step walkthrough of how every piece works, read [IMPLEMENTATION.md](./IMPLEMENTATION.md).**

---

## ✨ Features

### Customer
- 🔐 User registration & login (JWT auth)
- 🏠 Modern landing page with featured products & categories
- 🔍 Browse, search, filter, and sort products
- 📱 Detailed product pages with quantity selector
- 🛒 Persistent cart with full item details (name, image, price, qty)
- 💳 Checkout with shipping address + multiple payment methods
- 📦 Order history with live status tracking
- 👤 Editable profile

### Admin
- 📊 Admin dashboard (role-based access)
- ➕ Create / edit / delete products
- 📋 View all orders, update status (pending → paid → shipped → delivered)

---

## 🧱 Tech Stack

| Layer     | Tech                                                            |
| --------- | --------------------------------------------------------------- |
| Frontend  | React 18, Vite, React Router v6, Axios, Context API             |
| Backend   | Node.js, Express, Mongoose, JWT, bcrypt                         |
| Database  | MongoDB                                                         |
| Styling   | Vanilla CSS (custom design system, fully responsive)            |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local install OR [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Backend

```bash
cd backend
npm install
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kartiq
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:3000
```

Seed database with sample products + admin account:
```bash
npm run seed
```

Start server:
```bash
npm run dev     # http://localhost:5000
```

### 2. Frontend

In a **new terminal**:
```bash
cd frontend
npm install
npm run dev     # http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Demo Credentials

After running `npm run seed`:

```
Admin:    admin@kartiq.com / admin123
Customer: (register your own via /register)
```

---

## 📁 Project Structure

```
kartiq-ecommerce/
├── IMPLEMENTATION.md        ← Step-by-step explanation
├── README.md
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── models/              (User, Product, Cart, Order)
│   ├── middleware/          (auth, errorHandler)
│   ├── controllers/         (auth, product, cart, order)
│   ├── routes/
│   └── utils/               (generateToken, seedProducts)
└── frontend/
    └── src/
        ├── api/axios.js     ← JWT interceptor
        ├── context/         (AuthContext, CartContext)
        ├── components/      (Navbar, ProductCard, guards)
        └── pages/           (Home, ProductList, Cart, Checkout, Admin…)
```

---

## 🔗 API Reference

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Log in (returns JWT)
- `GET /api/auth/profile` — 🔒 Current user
- `PUT /api/auth/profile` — 🔒 Update profile

### Products
- `GET /api/products` — List (supports `keyword`, `category`, `sort`, `page`)
- `GET /api/products/featured` — Featured items
- `GET /api/products/categories` — All categories
- `GET /api/products/:id` — Single product
- `POST /api/products` — 👑 Admin: create
- `PUT /api/products/:id` — 👑 Admin: update
- `DELETE /api/products/:id` — 👑 Admin: delete

### Cart (all 🔒)
- `GET /api/cart`
- `POST /api/cart` `{ productId, quantity }`
- `PUT /api/cart/:productId` `{ quantity }`
- `DELETE /api/cart/:productId`
- `DELETE /api/cart`

### Orders (all 🔒)
- `POST /api/orders` — Place from current cart
- `GET /api/orders/myorders` — My orders
- `GET /api/orders/:id` — Order details
- `GET /api/orders/all` — 👑 Admin: all orders
- `PUT /api/orders/:id/status` — 👑 Admin: update status

---

## 🔮 Extend It

- 💳 Add Stripe / Razorpay payments
- ⭐ Reviews & ratings system
- ❤️ Wishlist
- 📸 Image uploads (Cloudinary / S3)
- 📧 Order confirmation emails (Nodemailer)
- 🔔 Real-time order updates (Socket.io)

---

**Built with ❤️ using the MERN stack.**
