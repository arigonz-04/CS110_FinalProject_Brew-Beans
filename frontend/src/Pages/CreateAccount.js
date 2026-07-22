import React, { useState } from 'react';
import "../CSS/CreateAccount.css";

function CreateAccount({setCurrentPage}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill out all fields!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Register response:", data);
        if (data.errors) {
          alert("Registration failed: " + data.errors[0].msg);
        } else {
          alert(data.message || "Account created successfully!");
          if (setCurrentPage) {
            setCurrentPage('Login');
          }
        }
    })
    .catch(error => {
        console.error("Error registering:", error);
        alert("Failed to connect to server");
    });
  };

  return (
    <div className="register-page-container">
      <h1 className="welcome-header">Join Beans & Brew!</h1>

        <div className="register-card">
            <h2>Create An Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="register-field-row">
                    <label>Name:</label>
                    <input type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Enter your full name"/>
                </div>

                <div className="register-field-row">
                    <label>Email:</label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    />
                </div>

                <div className="register-field-row">
                    <label>Password:</label>
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    />
                </div>
                <button type="submit" className="register-btn">Sign Up!</button>
            </form>
        </div>
    </div>
  );
}

export default CreateAccount;