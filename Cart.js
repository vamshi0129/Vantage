import React, { useEffect } from 'react';
import { useCart } from './components/CartContext';
import Navbar from './components/Navbar';
import './cart.css';
import { auth } from './components/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/signin'); // Redirect to sign-in page if not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    navigate('/address', { state: { items: cart } }); // Pass cart to address page
  };

  return (
    <div>
      <Navbar />
      <div className="cart-container">
        <h1>Your Cart</h1>
        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty</p>
        ) : (
          <div>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.img_url} alt={item.product_name} />
                <div>
                  <h2>{item.product_name}</h2>
                  
                  <div className="quantity-controls">
                    <p>Price: ₹{item.price}</p>
                    <button onClick={() => increaseQuantity(item)}>+</button>
                    <p>Quantity: {item.quantity}</p>
                    <button onClick={() => decreaseQuantity(item)}>-</button>
                  </div>
                  <button onClick={() => removeFromCart(item)} className='remove'>Remove</button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <p>Total Amount: <span>₹{getTotalAmount()}</span></p>
              <button onClick={handleProceedToCheckout} className="proceed-to-checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
