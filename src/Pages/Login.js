import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/styles/login.css';
import logo from '../Assets/Images/WhiteML_Logo-w-tag-vector.svg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="logo-container">
                    <img src={logo} alt="Mighty Lube Logo" className="logo" />
                </div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default Login;

