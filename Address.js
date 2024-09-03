import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { db, auth } from './components/firebaseConfig';  // Import the firebase config
import { doc, setDoc, getDoc } from 'firebase/firestore';  // Import Firestore methods
import './Address.css';

const Address = () => {
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAddress = async (uid) => {
            const docRef = doc(db, 'addresses', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFullName(data.fullName);
                setPhoneNumber(data.phoneNumber);
                setStreet(data.street);
                setCity(data.city);
                setState(data.state);
                setZip(data.zip);
            }
        };

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchAddress(user.uid);
            }
        });

        return unsubscribe;
    }, []);

    const handleFullNameChange = (e) => setFullName(e.target.value);
    const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
    const handleStreetChange = (e) => setStreet(e.target.value);
    const handleCityChange = (e) => setCity(e.target.value);
    const handleStateChange = (e) => setState(e.target.value);
    const handleZipChange = (e) => setZip(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};
    
        if (!fullName) errors.fullName = "Full Name is required.";
        if (!phoneNumber) errors.phoneNumber = "Phone Number is required.";
        if (!street) errors.street = "Street is required.";
        if (!city) errors.city = "City is required.";
        if (!state) errors.state = "State is required.";
        if (!zip) errors.zip = "Zip code is required.";
    
        if (Object.keys(errors).length === 0) {
            try {
                const user = auth.currentUser;
                if (user) {
                    await setDoc(doc(db, 'addresses', user.uid), {
                        fullName,
                        phoneNumber,
                        street,
                        city,
                        state,
                        zip
                    });
                    console.log("Address submitted:", { fullName, phoneNumber, street, city, state, zip });
                    setFullName("");
                    setPhoneNumber("");
                    setStreet("");
                    setCity("");
                    setState("");
                    setZip("");
                    navigate('/payment', { state: { fullName, phoneNumber, street, city, state, zip } }); // Navigate to the payment page
                } else {
                    console.error("No user is signed in.");
                }
            } catch (error) {
                console.error("Error submitting address:", error);
            }
        } else {
            setErrors(errors);
        }
    };
    return (
        <div className="address-container">
            <header>
                <div className="logo">
                <a href="https://drive.google.com/file/d/1ihSUrLpUoirYwOLt90rA_M9z9TEWcUUu/view?usp=drive_link">
                <img className="logo" src="https://i.ibb.co/xsKvztY/logo.png" alt="logo" />
            </a>
                </div>
            </header>
            <div className="address-wrapper">
                <form className="address-form" onSubmit={handleSubmit}>
                    <div className="address-form-content">
                        <h2 className="address-title">Add a new Address</h2>
                        <div className="address-inputs">
                            <div className="address-input-group">
                                <p className="address-label">Full Name</p>
                                <input
                                    onChange={handleFullNameChange}
                                    value={fullName}
                                    className="address-input"
                                    type="text"
                                />
                                {errors.fullName && (
                                    <p className="address-error">
                                        <span className="address-error-icon">!</span>
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>
                            <div className="address-input-group">
                                <p className="address-label">Phone Number</p>
                                <input
                                    onChange={handlePhoneNumberChange}
                                    value={phoneNumber}
                                    className="address-input"
                                    type="tel"
                                />
                                {errors.phoneNumber && (
                                    <p className="address-error">
                                        <span className="address-error-icon">!</span>
                                        {errors.phoneNumber}
                                    </p>
                                )}
                            </div>
                            <div className="address-input-group">
                                <p className="address-label">Street</p>
                                <input
                                    onChange={handleStreetChange}
                                    value={street}
                                    className="address-input"
                                    type="text"
                                />
                                {errors.street && (
                                    <p className="address-error">
                                        <span className="address-error-icon">!</span>
                                        {errors.street}
                                    </p>
                                )}
                            </div>
                            <div className="address-input-group">
                                <p className="address-label">City</p>
                                <input
                                    onChange={handleCityChange}
                                    value={city}
                                    className="address-input"
                                    type="text"
                                />
                                {errors.city && (
                                    <p className="address-error">
                                        <span className="address-error-icon">!</span>
                                        {errors.city}
                                    </p>
                                )}
                            </div>
                            <div className="address-input-group">
                                <p className="address-label">State</p>
                                <input
                                    onChange={handleStateChange}
                                    value={state}
                                    className="address-input"
                                    type="text"
                                />
                                {errors.state && (
                                    <p className="address-error">
                                        <span className="address-error-icon">!</span>
                                        {errors.state}
                                    </p>
                                )}
                            </div>
                            <div className="address-input-group">
                                <p className="address-label">Zip Code</p>
                                <input
                                    onChange={handleZipChange}
                                    value={zip}
                                    className="address-input"
                                    type="text"
                                />
                                {errors.zip && (
                                    <p className="address-error">
                                        <span className="address-error-icon">!</span>
                                        {errors.zip}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="address-button">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="address-footer">
                <div className="address-footer-links">
                    <p className='address-footer-link'>
                        Conditions of Use
                    </p>
                    <p className='address-footer-link'>
                        Privacy Notice
                    </p>
                </div>
                <p className="address-footer-text"> @ 1996-2023, ReactBd.com, Inc. or its affiliates </p>
            </div>
        </div>
    );
};

export default Address;
    