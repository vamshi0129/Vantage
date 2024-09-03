import React, { useEffect } from 'react';
import './categories.css';

const CartMessage = ({ message, showMessage, setShowMessage }) => {
  useEffect(() => {
    if (showMessage) {
      const timeout = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showMessage, setShowMessage]);

  return (
    <>
      {showMessage && (
        <div className="cart-message">
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default CartMessage;