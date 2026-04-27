import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  return (
    <div className="container section">
      <h2>Admin Dashboard</h2>
      <div className="admin-tabs">
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
          Products
        </button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
          Orders
        </button>
      </div>
      {tab === 'products' ? <ProductAdmin /> : <OrderAdmin />}
    </div>
  );
}

function emptyForm() {
  return {
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Electronics',
    brand: '',
    stock: '',
    featured: false,
  };
}

function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get('/products?pageSize=100').then((r) => setProducts(r.data.products));

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
    } else {
      await api.post('/products', payload);
    }
    setForm(emptyForm());
    setEditingId(null);
    load();
  };

  const edit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name, description: p.description, price: p.price, image: p.image,
      category: p.category, brand: p.brand, stock: p.stock, featured: p.featured,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <>
      <div className="card">
        <h3>{editingId ? 'Edit product' : 'Add new product'}</h3>
        <form onSubmit={submit}>
          <div className="grid-2">
            <div>
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label>Brand</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
          </div>
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" required />
          <div className="grid-3">
            <div>
              <label>Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label>Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
            <div>
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['Electronics', 'Fashion', 'Home', 'Books', 'Beauty', 'Sports', 'Toys'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <label>Image URL</label>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
          <label className="checkbox">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured
          </label>
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add product'}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm()); }} className="btn-ghost">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>All products ({products.length})</h3>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image} alt={p.name} className="thumb" /></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td className="actions-cell">
                    <button onClick={() => edit(p)} className="btn-ghost btn-small">Edit</button>
                    <button onClick={() => del(p._id)} className="btn-danger btn-small">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function OrderAdmin() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get('/orders/all').then((r) => setOrders(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div className="card">
      <h3>All orders ({orders.length})</h3>
      <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>User</th><th>Total</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-8).toUpperCase()}</td>
                <td>{o.user?.name}<br /><small className="muted">{o.user?.email}</small></td>
                <td>₹{o.totalPrice.toLocaleString()}</td>
                <td><span className={`status status-${o.status}`}>{o.status}</span></td>
                <td>
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                    {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
