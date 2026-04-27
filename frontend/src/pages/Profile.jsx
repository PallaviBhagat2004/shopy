import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    password: '',
  });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: form.name, email: form.email, phone: form.phone };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      setMsg('Profile updated!');
      setForm({ ...form, password: '' });
      setErr('');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) {
      setErr(e.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="container section">
      <h2>My Profile</h2>
      <div className="profile-card">
        {msg && <div className="alert success">{msg}</div>}
        {err && <div className="alert error">{err}</div>}
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label>New password (leave blank to keep current)</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit" className="btn-primary">Save changes</button>
        </form>
      </div>
    </div>
  );
}
