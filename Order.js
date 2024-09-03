import React from 'react';
import './Order.css';   
import Navbar from './Navbar';


const Order = () => {
    return (
        <div className="order-container">
                        <Navbar />

            <h2>Your Order is Confirmed!</h2>
            <p>Thank you for your purchase.</p>
        </div>
    );
};

export default Order;