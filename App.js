import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import Signin from './components/Signin';
import Registration from './components/Registration';
import Home from './Home';
import Electronics from './electronics';
import Clothes from './clothing';
import Toy from './toys';
import Footwear from './footwear';
import Pet from './pet';
import Beauty from './beauty';
import Furniture from './furniture';
import Health from './health';
import Cart from './Cart'; 
import Address from './Address';
import { CartProvider } from './components/CartContext';
import Payment from './components/Payment';
import Order from './components/Order'; 
import OrderHistory from './components/orderhistory';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/" element={<Navigate to="/signin" />} /> {/* Redirect root to Signin */}
          <Route path="/home" element={<Home />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/clothing" element={<Clothes />} />
          <Route path="/toys" element={<Toy />} />
          <Route path="/footwear" element={<Footwear />} />
          <Route path="/pet" element={<Pet />} />
          <Route path="/beauty" element={<Beauty />} />
          <Route path="/furniture" element={<Furniture />} />
          <Route path="/health" element={<Health />} />
          <Route path="/address" element={<Address />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order" element={<Order />} /> {/* Add route for Order component */}
          <Route path="/orderhistory" element={<OrderHistory />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
