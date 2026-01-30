import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const addToCart = (product, variant = null) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id && item.variant === variant);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id && item.variant === variant
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, variant, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id, variant) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.variant === variant)));
  };

  const updateQuantity = (id, variant, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, variant);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id && item.variant === variant
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (productId, variant = null) => {
    return cart.some(item => item.id === productId && item.variant === variant);
  };

  const getCartItem = (productId, variant = null) => {
    return cart.find(item => item.id === productId && item.variant === variant);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};