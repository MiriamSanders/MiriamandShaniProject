import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/login.css';
import { useContext } from 'react';
import { UserContext } from './context';

function SignUp() {
    const [userSignUp, setUserSignUp] = useState({ name: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { name, password, confirmPassword } = userSignUp;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3012/users?username=${name}`);
            const data = await response.json();

            if (data.length > 0) {
                setError('Username already exists');
            } else {
                alert('User created successfully!');
                setUser({ username: name, website: password });
                navigate('/editInfoNewUser', { state: { bool: "add" } });
            }
        } catch (err) {
            setError('An error occurred while connecting');
        }
    };

    return (
        <>
            <Link to="/users/guest/home">
                <button className="nav-button">🏠</button>
            </Link>

            <div className="loginForm">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={userSignUp.name}
                            onChange={(e) => setUserSignUp(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Type username..."
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={userSignUp.password}
                            onChange={(e) => setUserSignUp(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Type password..."
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={userSignUp.confirmPassword}
                            onChange={(e) => setUserSignUp(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm password..."
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Sign Up
                    </button>
                </form>
                {error && <div className="error-message">{error}</div>}
                <div className="toLogin">Already have an account?
                    <Link to="/login"> Please login</Link>
                </div>
            </div>
        </>
    );
}

export default SignUp;