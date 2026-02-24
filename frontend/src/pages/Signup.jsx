import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup({ setRole }) {
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        setRole('General User');
        navigate('/');
    };

    return (
        <div className="page-content auth-page">
            <h2>Join the Academic Platform</h2>
            <form onSubmit={handleSignup} className="form-container">
                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Institutional Email (.edu/.ac.uk)" required />
                <input type="password" placeholder="Password" required />
                <p className="auth-note">Verification requires manual review of your academic credentials.</p>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
