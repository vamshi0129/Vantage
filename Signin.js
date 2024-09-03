import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Signin.css';

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errPassword, setErrPassword] = useState("");
    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
        setErrEmail("");
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
        setErrPassword("");
    }

    const handleLogin = async (e) => {
        e.preventDefault();
    
        let isValid = true;
    
        if (!email) {
            setErrEmail("Email is required.");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrEmail("Invalid email format.");
            isValid = false;
        }
    
        if (!password) {
            setErrPassword("Password is required.");
            isValid = false;
        } else if (password.length < 6) {
            setErrPassword("Password must be at least 6 characters.");
            isValid = false;
        }
    
        if (isValid) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('User signed in:', userCredential.user);
                setEmail("");
                setPassword("");
                navigate('/home');
            } catch (error) {
                console.error('Error signing in user:', error);
                setErrEmail('Email id is not registered');
            }
        }
    }
    
    return (
        <div className="signin-container">
            <header className="logo-header">
            <a href="https://drive.google.com/file/d/1ihSUrLpUoirYwOLt90rA_M9z9TEWcUUu/view?usp=drive_link">
                <img className="vantage-logo" src="https://i.ibb.co/xsKvztY/logo.png" alt="logo" />
            </a>
            </header>
            <div className="signin-wrapper">
                <form className="signin-form">
                    <div className="signin-form-content">
                        <h2 className="signin-title">Sign in</h2>
                        <div className="signin-inputs">
                            <div className="signin-input-group">
                                <p className="signin-label">Email or mobile phone number</p>
                                <input
                                    onChange={handleEmail}
                                    value={email}
                                    className="signin-input"
                                    type="email"
                                />
                                {errEmail && (
                                    <p className="signin-error">
                                        <span className="signin-error-icon">!</span>
                                        {errEmail}
                                    </p>
                                )}
                            </div>
                            <div className="signin-input-group">
                                <p className="signin-label">Password</p>
                                <input
                                    onChange={handlePassword}
                                    value={password}
                                    className="signin-input"
                                    type="password"
                                />
                                {errPassword && (
                                    <p className="signin-error">
                                        <span className="signin-error-icon">!</span>
                                        {errPassword}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button onClick={handleLogin} className="signin-button">Sign-In</button>
                        <p className="signin-terms">
                            By continuing, you agree to Vantage's 
                            <span className="signin-link"> Conditions of Use </span>
                            and 
                            <span className="signin-link"> Privacy Notice</span>.
                        </p>
                        <div className="signin-help">
                            <ArrowRightIcon />
                            <span className="signin-link-help">Need help?</span>
                        </div>
                        <div className="signin-divider">
                            <span className="signin-divider-line"></span>
                            <span className="signin-divider-text">New to Vantage?</span>
                            <span className="signin-divider-line"></span>
                        </div>
                        <Link to="/Registration" className="signin-create-account-link">
                            <button className="signin-create-account-button">Create your Vantage account</button>
                        </Link>
                    </div>
                </form>
            </div>
            <footer className="signin-footer">
                <div className="signin-footer-links">
                    <span className="signin-footer-link">Conditions of Use</span>
                    <span className="signin-footer-link">Privacy Notice</span>
                    <span className="signin-footer-link">Help</span>
                </div>
                <p className="signin-footer-text">© 1996-2024, Vantage.com, Inc. or its affiliates</p>
            </footer>
        </div>
    );
}

export default Signin;
