import React, { useState } from "react";
import { updateProfile } from "../api";

function Profile({ user }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(formData);
      setMessage("Profile updated successfully");
      setErrors([]);
    } catch (err) {
      setErrors(
        err.response?.data.errors || [
          err.response?.data.message || "Failed to update profile",
        ]
      );
      setMessage("");
    }
  };

  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="profile">
      <h2>Your Profile</h2>
      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((error, index) => (
            <li key={index} className="error">
              {error}
            </li>
          ))}
        </ul>
      )}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={handleChange}
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
