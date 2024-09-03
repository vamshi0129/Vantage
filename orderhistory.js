// src/components/OrderHistory.js
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';  
import { doc, getDoc } from 'firebase/firestore';  
import Navbar from './Navbar';
import './orderhistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async (uid) => {
            const docRef = doc(db, 'orderHistory', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setOrders(docSnap.data().orders || []);  // Assuming orders are stored as an array in the document
            }
        };

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchOrders(user.uid);
            }
        });

        return unsubscribe;
    }, []);

    return (
        <div>
            <Navbar />
            <div className="order-history">
                <h2>Your Orders</h2>
                {orders.length > 0 ? (
                    <ul>
                        {orders.map((order, index) => (
                            <div className='order-box'>
                            <li key={index}>
                                <p><strong>Order Date:</strong> {order.orderDate}</p>
                                <p><strong>Items:</strong> {order.items}</p>
                                <p><strong>Total Price:</strong> {order.totalPrice}</p>
                                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                <p><strong>Address:</strong> {order.address}</p>
                            </li>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
