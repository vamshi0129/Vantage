import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;
    case 'CLEAR_CART':
      return [];
    case 'ADD_TO_CART': {
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      }
    }
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload.id);
    case 'INCREASE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    case 'DECREASE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        const cartSnapshot = await getDoc(cartRef);
        if (cartSnapshot.exists()) {
          dispatch({ type: 'LOAD_CART', payload: cartSnapshot.data().items });
        } else {
          dispatch({ type: 'LOAD_CART', payload: [] });
        }
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
    });

    return () => unsubscribe();
  }, []);

  const saveCartToFirestore = async (newCart) => {
    const user = auth.currentUser;
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      await setDoc(cartRef, { items: newCart });
    }
  };

  const addToCart = item => {
    const newCart = cart.find(i => i.id === item.id)
      ? cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, { ...item, quantity: 1 }];

    dispatch({ type: 'ADD_TO_CART', payload: item });
    saveCartToFirestore(newCart);
  };

  const removeFromCart = item => {
    const newCart = cart.filter(i => i.id !== item.id);
    dispatch({ type: 'REMOVE_FROM_CART', payload: item });
    saveCartToFirestore(newCart);
  };

  const increaseQuantity = item => {
    const newCart = cart.map(i =>
      i.id === item.id
        ? { ...i, quantity: i.quantity + 1 }
        : i
    );
    dispatch({ type: 'INCREASE_QUANTITY', payload: item });
    saveCartToFirestore(newCart);
  };

  const decreaseQuantity = item => {
    const newCart = cart.map(i =>
      i.id === item.id && i.quantity > 1
        ? { ...i, quantity: i.quantity - 1 }
        : i
    );
    dispatch({ type: 'DECREASE_QUANTITY', payload: item });
    saveCartToFirestore(newCart);
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    saveCartToFirestore([]);  // Clear cart in Firestore as well
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
