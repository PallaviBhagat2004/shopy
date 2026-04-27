import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart.items.length) {
    return (
      <div className="container section empty-state">
        <div className="empty-emoji">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started</p>
        <Link to="/products" className="btn-primary">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h2>Your cart ({cart.totalItems} items)</h2>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.product} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="muted">₹{item.price.toLocaleString()} each</p>
              </div>
              <div className="qty-selector small">
                <button
                  onClick={() =>
                    updateQuantity(item.product, Math.max(1, item.quantity - 1))
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="cart-item-total">
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>
              <button
                onClick={() => removeFromCart(item.product)}
                className="btn-icon-danger"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={clearCart} className="btn-ghost clear-cart-btn">
            Clear cart
          </button>
        </div>

        <aside className="cart-summary">
          <h3>Order summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{cart.totalPrice.toLocaleString()}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <strong>{cart.totalPrice > 500 ? 'Free' : '₹50'}</strong>
          </div>
          <div className="summary-row">
            <span>Tax (10%)</span>
            <strong>₹{(cart.totalPrice * 0.1).toFixed(2)}</strong>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <strong>
              ₹
              {(
                cart.totalPrice +
                (cart.totalPrice > 500 ? 0 : 50) +
                cart.totalPrice * 0.1
              ).toFixed(2)}
            </strong>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary btn-block"
          >
            Proceed to checkout →
          </button>
        </aside>
      </div>
    </div>
  );
}
