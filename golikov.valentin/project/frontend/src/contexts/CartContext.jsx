import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext();

const LS_CART_KEY = 'gadget_hub_cart';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize from localStorage
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem(LS_CART_KEY, JSON.stringify(items));
  }, [items]);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const selectedTotal = useMemo(
    () =>
      items
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selected: true }];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleSelect = (productId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const selectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: true })));
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = {
    items,
    totalCount,
    selectedTotal,
    addItem,
    removeItem,
    updateQuantity,
    toggleSelect,
    selectAll,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
