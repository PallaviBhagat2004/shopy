import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders').then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container section"><p>Loading...</p></div>;

  if (!orders.length) {
    return (
      <div className="container section empty-state">
        <div className="empty-emoji">📦</div>
        <h2>No orders yet</h2>
        <Link to="/products" className="btn-primary">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.map((o) => (
          <div key={o._id} className="order-card">
            <div className="order-header">
              <div>
                <strong>Order #{o._id.slice(-8).toUpperCase()}</strong>
                <p className="muted">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`status status-${o.status}`}>{o.status}</span>
            </div>
            <div className="order-items">
              {o.items.map((it) => (
                <div key={it.product} className="order-item">
                  <img src={it.image} alt={it.name} />
                  <div>
                    <p>{it.name}</p>
                    <small className="muted">Qty: {it.quantity} · ₹{it.price.toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <span>{o.paymentMethod}</span>
              <strong>Total: ₹{o.totalPrice.toLocaleString()}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
