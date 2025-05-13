import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from './context';
import '../css/login.css';

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        userName: '',
        email: '',
        password: '',
        phone: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmPassword, ...userDetails } = formData;
    
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3012/registration/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...userDetails, password }),
            });
    
            if (response.status === 201) {
                const {user,token} = await response.json();
                alert('User created successfully!');
                setUser({ ...userDetails, id: user.id });
                localStorage.setItem('user', JSON.stringify({ ...userDetails, id: user.id }));
                localStorage.setItem('userToken',JSON.stringify(token));
                navigate(`/users/${user.id}/info`);
            } else if (response.status === 409) {
                setError('Username already exists');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'An unknown error occurred');
            }
        } catch (err) {
            console.error('Error during signup:', err);
            setError('An error occurred while connecting to the server');
        }
    };
    

    return (
        <>
            <Link to="/users/guest/home">
                <button className="nav-button">🏠</button>
            </Link>

            <div className="loginForm">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Sign Up
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}

                <div className="toLogin">
                    Already have an account?
                    <Link to="/login"> Please login</Link>
                </div>
            </div>
        </>
    );
}

export default SignUp;
