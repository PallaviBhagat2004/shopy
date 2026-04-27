import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (e) {
      console.error('Cart fetch failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { productId, quantity });
    setCart(data);
    return data;
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    setCart(data);
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
  };

  const clearCart = async () => {
    const { data } = await api.delete('/cart');
    setCart(data);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
