import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';  
import Navbar from './Navbar';
import { doc, getDoc, updateDoc,setDoc,arrayUnion } from 'firebase/firestore';  
import './Payment.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, uploadBytes } from 'firebase/storage';  
import { storage } from './firebaseConfig';  
import * as XLSX from 'xlsx';  
import { useCart } from './CartContext';  // Correct import path

const Payment = () => {
    const { clearCart } = useCart();  // Access clearCart from context
    const location = useLocation();
    const { fullName, phoneNumber, street, city, state, zip } = location.state;
    const [address, setAddress] = useState({});
    const [items, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
    const navigate = useNavigate();  

    useEffect(() => {
        const fetchAddress = async (uid) => {
            const docRef = doc(db, 'addresses', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setAddress(docSnap.data());
            }
        };
        const fetchCart = async(uid) => {
            const docRef = doc(db, 'carts', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCart(docSnap.data().items || []);
            }
        };

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchAddress(user.uid);
                fetchCart(user.uid); 
            }
        });

        return unsubscribe;
    }, []);

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    
        const orderDetails = {
            paymentMethod,
            address: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
            orderDate: new Date().toISOString(),
            items: items.map(item => `${item.product_name}, ${item.quantity}, ${item.price}`).join(' | '),
            totalPrice: `₹${totalPrice}`
        };
       
    
        const orderDetailsArray = [
            ['Payment Method', paymentMethod],
            ['Name',`${address.fullName}`],
            ['Address', `${address.street}, ${address.city}, ${address.state} ${address.zip}`],
            ['Order Date', new Date().toISOString()],
            ['Items', orderDetails.items],
            ['Total Price', `₹${totalPrice}`]
        ];
    
        const orderWorksheet = XLSX.utils.aoa_to_sheet(orderDetailsArray);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, orderWorksheet, 'Order Summary');
    
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
    
        const dateFolder = `${year}-${month}-${day}`;  // Format: YYYY-MM-DD
        const timestamp = new Date().toISOString().split('T')[1].replace(/:/g, '-').split('.')[0];  // Extract time part, replace ':' with '-', and remove milliseconds
        const storageRef = ref(storage, `orders/${dateFolder}/${timestamp}_order.xlsx`);
        await uploadBytes(storageRef, blob);
    
        console.log('Order uploaded to Firebase Storage');
    
        const user = auth.currentUser;
        if (user) {
            const orderRef = doc(db, 'orderHistory', user.uid);
            await updateDoc(orderRef, {
                orders: arrayUnion(orderDetails)
            }).catch(async (error) => {
                if (error.code === 'not-found') {
                    await setDoc(orderRef, { orders: [orderDetails] });
                } else {
                    console.error('Error saving order: ', error);
                }
            });
            const cartRef = doc(db, 'carts', user.uid);
            await updateDoc(cartRef, { items: [] });  // Clear the cart items in Firestore
            clearCart();  // Clear cart in context
        }

        navigate('/order');
    };
    
    return (
        <div className="payment-page">
            <Navbar />
            <div className='page'>
                <div className="shipping-address">
                    <h3>Shipping Address</h3>
                    <p>{fullName}</p>
                    <p>{phoneNumber}</p>
                    <p>{street}</p>
                    <p>{city}, {state} {zip}</p>
                </div>
                <h2>Payment Options</h2>
                <form onSubmit={handleSubmit}>
                    <div className="payment-method">
                        <label>
                            <input
                                type="radio"
                                value="cashOnDelivery"
                                checked={paymentMethod === 'cashOnDelivery'}
                                onChange={handlePaymentChange}
                            />
                            Cash on Delivery
                        </label>
                    </div>
                    <button type="submit">Proceed to Pay</button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
