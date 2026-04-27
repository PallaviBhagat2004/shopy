import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products/featured').then((r) => setFeatured(r.data)).catch(() => {});
    api.get('/products/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-badge">🛍️ Modern shopping</span>
            <h1>Everything you love, <span className="gradient-text">in one cart</span></h1>
            <p>Browse thousands of products across electronics, fashion, home, books and more — all at the best prices.</p>
            <div className="hero-cta">
              <Link to="/products" className="btn-primary">Shop now</Link>
              <Link to="/register" className="btn-ghost-light">Create account</Link>
            </div>
          </div>
          <div className="hero-art">
            <div className="floating-card c1">🎧</div>
            <div className="floating-card c2">👟</div>
            <div className="floating-card c3">📚</div>
            <div className="floating-card c4">💄</div>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((c) => (
            <Link key={c} to={`/products?category=${c}`} className="category-tile">
              <span className="category-emoji">{emoji(c)}</span>
              <span>{c}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">Featured Products</h2>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <section className="container section feature-row">
        <Feature icon="🚚" title="Free shipping" text="On orders above ₹500" />
        <Feature icon="🔒" title="Secure checkout" text="Encrypted payments" />
        <Feature icon="↩️" title="Easy returns" text="7-day return policy" />
        <Feature icon="⭐" title="Top rated" text="Curated picks every week" />
      </section>
    </div>
  );
}

const emoji = (c) => ({
  Electronics: '🎧', Fashion: '👕', Home: '🏡',
  Books: '📚', Beauty: '💄', Sports: '⚽', Toys: '🧸',
}[c] || '🛍️');

const Feature = ({ icon, title, text }) => (
  <div className="feature">
    <div className="feature-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{text}</p>
  </div>
);
