import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([
        {
            id: 101,
            name: "Puzzle Honey Sauced Chicken X French Fries",
            price: 9000,
            qty: 1,
            extras: 1000
        }
    ]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1, extras: item.extras ? item.extras[0].price : 0 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                if (newQty < 1) return item;
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const getSubtotal = () => cart.reduce((sum, item) => sum + ((item.price + (item.extras || 0)) * item.qty), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, getSubtotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
