import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setProduct(r.data));
  }, [id]);

  const handleAdd = async () => {
    if (!user) return navigate('/login');
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      setMsg('Added to cart ✓');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) return navigate('/login');
    await addToCart(product._id, quantity);
    navigate('/checkout');
  };

  if (!product) return <div className="container section"><p>Loading...</p></div>;

  return (
    <div className="container section">
      <div className="detail-layout">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info">
          <p className="product-category">{product.category} · {product.brand}</p>
          <h1>{product.name}</h1>
          <div className="detail-meta">
            <span>⭐ {product.rating.toFixed(1)}</span>
            <span>· {product.numReviews} reviews</span>
            <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
              · {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <p className="detail-price">₹{product.price.toLocaleString()}</p>
          <p className="detail-description">{product.description}</p>

          {product.stock > 0 && (
            <div className="detail-actions">
              <div className="qty-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
              <button onClick={handleAdd} className="btn-ghost" disabled={adding}>
                {adding ? 'Adding...' : '🛒 Add to Cart'}
              </button>
              <button onClick={handleBuyNow} className="btn-primary">
                ⚡ Buy Now
              </button>
            </div>
          )}
          {msg && <p className="toast">{msg}</p>}

          <div className="detail-features">
            <div>🚚 Free delivery on orders above ₹500</div>
            <div>↩️ 7-day easy returns</div>
            <div>🔒 Secure checkout</div>
          </div>
        </div>
      </div>
    </div>
  );
}
