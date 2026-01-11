import React, { useState } from "react";
import "./loginpage.css";
import { Link } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  // handling input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear individual error when user types
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value.trim() !== "") {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Local frontend validation
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key].trim() === "") {
        newErrors[key] = `${key} is required`;
      }
    });

    setErrors(newErrors);

    // If validation fails, stop here
    if (Object.keys(newErrors).length !== 0) {
      return;
    }

    // If validation passes, call backend API
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If backend returns validation or DB errors
        alert(data.error || data.message || "Something went wrong");
      } else {
        alert(data.message || "Logged in successfully!");
        console.log("Server response:", data);

        // Reset form after success
        setFormData({
          email: "",
          password: "",
        });
        setErrors({});
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
      alert("Cannot reach server. Please make sure Flask is running.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="login-error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && <p className="login-error">{errors.password}</p>}

          <button className="login-button" type="submit">
            Login
          </button>
          <div>
            <p>
              Create New <Link to="/register">Account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
