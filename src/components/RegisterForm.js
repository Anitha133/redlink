import React, { useState } from "react";
import "./register.css";
import './login.js';
import { Link } from "react-router-dom";

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    role: "", // donor or acceptor
  });

  const [newErrors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear individual error when user types
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value.trim() !== "") {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    // Local frontend validation
    Object.keys(formData).forEach((key) => {
      if (formData[key] === "") {
        errors[key] = `${key} is required`;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);

    // If validation passes, call backend API
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://127.0.0.1:5000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          // If backend returns validation or DB errors
          alert(data.error || "Something went wrong");
        } else {
          alert(data.message || "Registered successfully!");
          console.log("Server response:", data);

          // Reset form after success
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            gender: "",
            role: "",
          });
          setErrors({});
        }
      } catch (err) {
        console.error("Error connecting to backend:", err);
        alert("Cannot reach server. Please make sure Flask is running.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {newErrors.username && <span className="error">{newErrors.username}</span>}
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {newErrors.email && <span className="error">{newErrors.email}</span>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {newErrors.password && <span className="error">{newErrors.password}</span>}
        </div>

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {newErrors.confirmPassword && (
            <span className="error">{newErrors.confirmPassword}</span>
          )}
        </div>

        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit number"
          />
          {newErrors.phone && <span className="error">{newErrors.phone}</span>}
        </div>

        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {newErrors.gender && <span className="error">{newErrors.gender}</span>}
        </div>

        <div className="role-group">
          <label>Role:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="donor"
                checked={formData.role === "donor"}
                onChange={handleChange}
              />
              Donor
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="acceptor"
                checked={formData.role === "acceptor"}
                onChange={handleChange}
              />
              Acceptor
            </label>
          </div>
          {newErrors.role && <span className="error">{newErrors.role}</span>}
        </div>

        <button type="submit">Register</button>
        <p>alreay have account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
export default RegisterForm;
