import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const shippingPrice = cart.totalPrice > 500 ? 0 : 50;
  const taxPrice = Number((cart.totalPrice * 0.1).toFixed(2));
  const total = cart.totalPrice + shippingPrice + taxPrice;

  const update = (k) => (e) => setAddress({ ...address, [k]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: address,
        paymentMethod,
      });
      await fetchCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items.length) {
    return (
      <div className="container section">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <h2>Checkout</h2>
      <div className="checkout-layout">
        <form onSubmit={placeOrder} className="checkout-form">
          <div className="card">
            <h3>Shipping address</h3>
            <div className="grid-2">
              <div>
                <label>Full name</label>
                <input value={address.fullName} onChange={update('fullName')} required />
              </div>
              <div>
                <label>Phone</label>
                <input value={address.phone} onChange={update('phone')} required />
              </div>
            </div>
            <label>Street address</label>
            <input value={address.street} onChange={update('street')} required />
            <div className="grid-2">
              <div>
                <label>City</label>
                <input value={address.city} onChange={update('city')} required />
              </div>
              <div>
                <label>State</label>
                <input value={address.state} onChange={update('state')} required />
              </div>
            </div>
            <div className="grid-2">
              <div>
                <label>Postal code</label>
                <input value={address.postalCode} onChange={update('postalCode')} required />
              </div>
              <div>
                <label>Country</label>
                <input value={address.country} onChange={update('country')} required />
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Payment method</h3>
            <div className="payment-options">
              {['COD', 'Card', 'UPI', 'PayPal'].map((m) => (
                <label key={m} className={`payment-option ${paymentMethod === m ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={m}
                    checked={paymentMethod === m}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>{m === 'COD' ? 'Cash on Delivery' : m}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <div className="alert error">{error}</div>}
          <button type="submit" className="btn-primary btn-block" disabled={placing}>
            {placing ? 'Placing order...' : `Place order · ₹${total.toFixed(2)}`}
          </button>
        </form>

        <aside className="cart-summary">
          <h3>Order summary</h3>
          {cart.items.map((item) => (
            <div key={item.product} className="summary-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <small className="muted">Qty: {item.quantity}</small>
              </div>
              <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
            </div>
          ))}
          <hr />
          <div className="summary-row"><span>Subtotal</span><strong>₹{cart.totalPrice.toLocaleString()}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</strong></div>
          <div className="summary-row"><span>Tax</span><strong>₹{taxPrice}</strong></div>
          <div className="summary-row total"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
