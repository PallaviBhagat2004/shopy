import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data));
  }, [id]);

  if (!order) return <div className="container section"><p>Loading...</p></div>;

  return (
    <div className="container section">
      <div className="success-card">
        <div className="success-emoji">✅</div>
        <h2>Order placed successfully!</h2>
        <p className="muted">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
        <p>We've sent a confirmation to your account. Expected delivery: 3-5 business days.</p>
        <div className="success-total">
          <strong>Total paid: ₹{order.totalPrice.toLocaleString()}</strong>
        </div>
        <div className="success-actions">
          <Link to="/orders" className="btn-primary">View my orders</Link>
          <Link to="/products" className="btn-ghost">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
