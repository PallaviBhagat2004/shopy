import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-icon">🛒</span>
          <span className="brand-text">Kart<span className="brand-accent">IQ</span></span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
          {user && <NavLink to="/orders">Orders</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-link">
                🛍️
                {cart.totalItems > 0 && (
                  <span className="cart-badge">{cart.totalItems}</span>
                )}
              </Link>
              <Link to="/profile" className="user-chip hide-on-mobile">
                👤 {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="btn-ghost hide-on-mobile">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hide-on-mobile">Login</Link>
              <Link to="/register" className="btn-primary hide-on-mobile">Sign up</Link>
            </>
          )}

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/products" onClick={close}>Shop</NavLink>
          {user && <NavLink to="/orders" onClick={close}>Orders</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" onClick={close}>Admin</NavLink>}
          <hr />
          {user ? (
            <>
              <NavLink to="/profile" onClick={close}>👤 Profile ({user.name.split(' ')[0]})</NavLink>
              <button onClick={handleLogout} className="mobile-menu-btn">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Login</NavLink>
              <NavLink to="/register" onClick={close}>Sign up</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
