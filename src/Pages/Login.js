import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/styles/login.css';
import logo from '../Assets/Images/ML_Logo-w-tag-vector.svg';
import Swal from "sweetalert2";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
          const response = await fetch("https://mighty-lube.com/api/adminSessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email, // backend expects "username"
          password: password,
        }),
      });

      if (response.ok && response.status === 201) {
        const responseData = await response.json();

        if (responseData.sessionID) {
          localStorage.setItem("sessionID", responseData.sessionID);
        }

        console.log("Login successful:", responseData);
        navigate("/dashboard");
      } else {
        const errorText = await response.text();
        console.error("Login failed:", errorText);
        if (errorText.includes("Invalid credentials")) {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Invalid password. Please try again.",
          });
        } else if (errorText.includes("username")) {
          Swal.fire({
            icon: "error",
            title: "Invalid Username",
            text: "The username you entered does not exist.",
          });
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="logo-container">
                    <img src={logo} alt="Mighty Lube Logo" className="logo" />
                </div>
                <h1>Welcome Back</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="username" 
                        placeholder="Username" 
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
                    <button type="button" onClick={() => navigate('/register')}>Register</button>
                </form>
            </div>
        </div>
    );
}

export default Login;

