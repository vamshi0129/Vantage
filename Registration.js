import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './Registration.css';

const Registration = () => {
    const [clientName, setClientName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [address, setAddress] = useState(""); 
    
    const [errClientName, setErrClientName] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errPassword, setErrPassword] = useState("");
    const [errCPassword, setErrCPassword] = useState("");
    const [errAddress, setErrAddress] = useState(""); 

    const navigate = useNavigate();

    const handleName = (e) => {
        setClientName(e.target.value);
        setErrClientName("");
    }
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setErrEmail("");
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setErrPassword("");
    }
    const handleCPassword = (e) => {
        setCPassword(e.target.value);
        setErrCPassword("");
    }
    const handleAddress = (e) => {
        setAddress(e.target.value);
        setErrAddress("");
    }

    const emailValidation = (email) => {
        return String(email).toLowerCase().match(/^\w+([-]?\w+)@\w+([-]?\w+)(\.\w{2,3})+$/);
    }

    const handleRegistration = async (e) => {
        e.preventDefault();

        let isValid = true;

        if (!clientName) {
            setErrClientName("Enter your name");
            isValid = false;
        }
        if (!email) {
            setErrEmail("Enter your email");
            isValid = false;
        } else if (!emailValidation(email)) {
            setErrEmail("Enter a valid email");
            isValid = false;
        }
        if (!password) {
            setErrPassword("Enter your password");
            isValid = false;
        } else if (password.length < 6) {
            setErrPassword("Passwords must be at least 6 characters.");
            isValid = false;
        }
        if (!cPassword) {
            setErrCPassword("Confirm your password");
            isValid = false;
        } else if (cPassword !== password) {
            setErrCPassword("Password Not Matched");
            isValid = false;
        }
        if (!address) {
            setErrAddress("Enter your address");
            isValid = false;
        }

        if (isValid) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('User registered:', userCredential.user);
                setClientName("");
                setEmail("");
                setPassword("");
                setCPassword("");
                setAddress(""); // Reset address field
                navigate('/signin');
            } catch (error) {
                console.error('Error registering user:', error);
                setErrEmail('Email id already exists');
            }
        }
    }

    return (
        <div>
            <header>
                <div className="logo">
                <a href="https://drive.google.com/file/d/1ihSUrLpUoirYwOLt90rA_M9z9TEWcUUu/view?usp=drive_link">
                <img className="vantage-logo" src="https://i.ibb.co/xsKvztY/logo.png" alt="logo" />
            </a>
                </div>
            </header>
            <div className="registration-container">
                <div className='registration-wrapper'>
                    <form className='registration-form'>
                        <div className='registration-form-content'>
                            <h2 className='registration-title'>Create Account</h2>
                            <div className='registration-inputs'>
                                <div className='registration-input-group'>
                                    <p className='registration-label'>Your name</p>
                                    <input
                                        onChange={handleName}
                                        value={clientName}
                                        type="text"
                                        className="registration-input" />
                                    {errClientName && (
                                        <p className="registration-error">
                                            <span className='registration-error-icon'>!</span>
                                            {errClientName}
                                        </p>
                                    )}
                                </div>
                                <div className='registration-input-group'>
                                    <p className='registration-label'>Email or mobile phone number</p>
                                    <input
                                        onChange={handleEmail}
                                        value={email}
                                        type="email"
                                        className="registration-input" />
                                    {errEmail && (
                                        <p className="registration-error">
                                            <span className='registration-error-icon'>!</span>
                                            {errEmail}
                                        </p>
                                    )}
                                </div>
                                <div className='registration-input-group'>
                                    <p className='registration-label'>Address</p>
                                    <input
                                        onChange={handleAddress}
                                        value={address}
                                        type="text"
                                        className="registration-input" />
                                    {errAddress && (
                                        <p className="registration-error">
                                            <span className='registration-error-icon'>!</span>
                                            {errAddress}
                                        </p>
                                    )}
                                </div>
                                <div className='registration-input-group'>
                                    <p className='registration-label'>Password</p>
                                    <input
                                        value={password}
                                        onChange={handlePassword}
                                        type="password"
                                        className="registration-input" />
                                    {errPassword && (
                                        <p className="registration-error">
                                            <span className='registration-error-icon'>!</span>
                                            {errPassword}
                                        </p>
                                    )}
                                </div>
                                <div className='registration-input-group'>
                                    <p className='registration-label'>Re-enter Password</p>
                                    <input
                                        onChange={handleCPassword}
                                        value={cPassword}
                                        type="password"
                                        className="registration-input" />
                                    {errCPassword && (
                                        <p className="registration-error">
                                            <span className='registration-error-icon'>!</span>
                                            {errCPassword}
                                        </p>
                                    )}
                                    <p className='registration-password-note'>Passwords must be at least 6 characters.</p>
                                </div>
                                <button onClick={handleRegistration} className="registration-button">
                                    Continue
                                </button>
                            </div>
                            <p className="registration-terms"> By Continuing, you agree to
                                Amazon's<span className="registration-link"> Conditions of use</span> and{" "}
                                <span className="registration-link"> Privacy Notice.</span></p>
                            <div>
                                <p className='registration-signin'>
                                    Already have an account?
                                    <Link to="/signin">
                                        <span className='registration-link'>
                                            Sign in
                                            <span><ArrowRightIcon /></span>
                                        </span>
                                    </Link>
                                </p>
                                <p className='registration-business'>
                                    Buying for work?
                                    <span className='registration-link'>
                                        Create a free business account
                                    </span>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="registration-footer">
                    <div className="registration-footer-links">
                        <p className='registration-footer-link'>
                            Conditions of Use
                        </p>
                        <p className='registration-footer-link'>
                            Privacy Notice
                        </p>
                        <p className='registration-footer-link'>
                            Privacy Notice
                        </p>
                    </div>
                    <p className="registration-footer-text"> @ 1996-2023, ReactBd.com, Inc. or its affiliates </p>
                </div>
            </div>
        </div>
    )
}

export default Registration;