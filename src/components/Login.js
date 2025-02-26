import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]); // Change to array for multiple errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setErrors(
        err.response?.data.errors || [
          err.response?.data.message || "Login failed",
        ]
      );
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
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
          type="email"
          name="email"
          placeholder="Email address"
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
