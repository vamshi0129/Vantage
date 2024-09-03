import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = () => {
  return (
    <header>
      <div className="navbar">
        <div className="nav-logo border">
        <a href="https://drive.google.com/file/d/1ihSUrLpUoirYwOLt90rA_M9z9TEWcUUu/view?usp=drive_link">
                <img className="logo" src="https://i.ibb.co/xsKvztY/logo.png" alt="logo" />
            </a>
        </div>
        <div className="nav-address border">
          <div className='Icon'><LocationOnIcon/></div>
            <div className="add-icon">
              <i className="fa-solid fa-location-dot"></i>
              <p className="add-sec">India</p>
            </div>
        </div>
        <div className="nav-search">
          <select className="search-select">
            <option>All</option>
          </select>
          <input placeholder="Search" className="search-input" />
          <div className="search-icon">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
        <div className="nav-home border">
          <Link to="/home">Home</Link> {/* Ensure correct route */}
        </div>
        <div className="accounts border">
          <p>Hello, </p>
          <div>
            <select className="account-dropdown">
              <option>Account & Lists</option>
            </select>
          </div>
        </div>
        <div className="returns border">
        <Link to="/orderhistory" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
            Orders
          </Link>
        </div>
        <div className="cart border">
          <Link to="/cart">
            <i className="fa-solid fa-cart-shopping"></i>
            Cart
          </Link>
          <ShoppingCartIcon/>
        </div>
      </div>
      <div className="panel">
        <div className="panel-all border">
          <p><i className="fa-solid fa-bars"></i> All</p>
        </div>
        <div className="panel-ops">
          <a className="border" href="#">Today's Deals</a>
          <a className="border" href="#">Customer Service</a>
          <a className="border" href="#">Registry</a>
          <a className="border" href="#">Gift Cards</a>
          <a className="border" href="#">Sell</a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
