require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with 40-hour battery life, active noise cancellation, and studio-quality sound.',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    category: 'Electronics',
    brand: 'SoundWave',
    stock: 25,
    rating: 4.6,
    numReviews: 128,
    featured: true,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track steps, heart rate, sleep, and 20+ sports modes. GPS and water-resistant up to 50m.',
    price: 5499,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    category: 'Electronics',
    brand: 'FitPro',
    stock: 40,
    rating: 4.4,
    numReviews: 89,
    featured: true,
  },
  {
    name: 'Classic Leather Jacket',
    description: 'Genuine lambskin leather jacket with quilted lining. Timeless style, all-season comfort.',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    category: 'Fashion',
    brand: 'UrbanWear',
    stock: 15,
    rating: 4.7,
    numReviews: 54,
    featured: true,
  },
  {
    name: 'Running Shoes - Cloud Runner',
    description: 'Ultra-light running shoes with responsive cushioning and breathable mesh upper.',
    price: 3299,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    category: 'Sports',
    brand: 'StrideX',
    stock: 60,
    rating: 4.5,
    numReviews: 212,
    featured: false,
  },
  {
    name: 'Aromatic Scented Candle Set',
    description: 'Set of 4 soy wax candles — lavender, vanilla, sandalwood, and ocean breeze. 40 hours of burn time each.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1602874801006-ea5e16e7f40b?w=600',
    category: 'Home',
    brand: 'Aura',
    stock: 80,
    rating: 4.8,
    numReviews: 301,
    featured: true,
  },
  {
    name: 'The Art of Programming',
    description: 'A comprehensive guide to modern software engineering, design patterns, and clean code practices.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
    category: 'Books',
    brand: 'TechPress',
    stock: 100,
    rating: 4.9,
    numReviews: 445,
    featured: false,
  },
  {
    name: 'Organic Face Serum',
    description: 'Vitamin C + Hyaluronic acid serum. Brightens, hydrates, and reduces fine lines. 30ml.',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
    category: 'Beauty',
    brand: 'GlowLab',
    stock: 50,
    rating: 4.6,
    numReviews: 178,
    featured: true,
  },
  {
    name: 'Wooden Building Blocks - 100 pcs',
    description: 'Premium hardwood building blocks for kids 3+. Non-toxic finish, vibrant colors, endless creativity.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1558877385-8c1b8b4d1f29?w=600',
    category: 'Toys',
    brand: 'PlayCraft',
    stock: 35,
    rating: 4.7,
    numReviews: 92,
    featured: false,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit, hot-swappable mechanical keyboard with blue switches. Built for gamers and typists.',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
    category: 'Electronics',
    brand: 'KeyForge',
    stock: 30,
    rating: 4.5,
    numReviews: 156,
    featured: true,
  },
  {
    name: 'Yoga Mat Pro',
    description: 'Eco-friendly 6mm TPE yoga mat with alignment lines. Non-slip, lightweight, includes carry strap.',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
    category: 'Sports',
    brand: 'ZenFit',
    stock: 70,
    rating: 4.6,
    numReviews: 201,
    featured: false,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs (350ml each). Microwave and dishwasher safe.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    category: 'Home',
    brand: 'ClayCo',
    stock: 55,
    rating: 4.4,
    numReviews: 76,
    featured: false,
  },
  {
    name: 'Vintage Denim Jeans',
    description: 'Slim-fit stretch denim with classic 5-pocket design. Durable, comfortable, everyday essential.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    category: 'Fashion',
    brand: 'DenimCo',
    stock: 90,
    rating: 4.3,
    numReviews: 134,
    featured: false,
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    const adminExists = await User.findOne({ email: 'admin@kartiq.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@kartiq.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin created: admin@kartiq.com / admin123');
    } else {
      console.log('Admin already exists');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
