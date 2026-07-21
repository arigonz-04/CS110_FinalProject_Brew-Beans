import React, { useState } from 'react';
import "../CSS/Login.css";

function Login({setCurrentPage}) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Handle typing in inputs
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value
    });
  };

    const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
        alert("Please fill out required fields");
        return;
    }

    fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Login response:", data);
        if (data.message) {
            alert(data.message);
        } else {
            alert("Login successful");
        }
    })
    .catch(error => {
        console.error("Login error:", error);
        alert("Failed to connect to server");
    });
  };

  const handleThirdPartySignIn = () => {
    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth";
  };

  const handleCreateAccount = () => {
    alert("Moving to user registration page");
    setCurrentPage('CreateAccount');
  }

  return (
    <div className="login-page-container">
        <h1 className="welcome-header"> Welcome To Beans & Brew!</h1>

        <div className="login-card">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="login-field-row">
                    <label>User:</label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"/>
                </div>

                <div className="login-field-row">
                    <label>Password:</label>
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"/>
                </div>

                <button type="submit" className="login-btn">Login</button>
            </form>

            <div className="google-section">
                <button type="button" onClick={handleThirdPartySignIn} className="google-btn">Google Sign-In</button>
            </div>

            <div className="signup">
                <p>No account? Sign up now!</p>
                <button type="button" onClick={handleCreateAccount} className="signup-link-btn">Sign Up</button>
            </div>
        </div>
    </div>
  );
}

export default Login;