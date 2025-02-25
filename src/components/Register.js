import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setErrors(
        err.response?.data.errors || [
          err.response?.data.message || "Registration failed",
        ]
      );
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((error, index) => (
            <li key={index} className="error">
              {error}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
