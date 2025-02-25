import React, { useState } from "react";
import { updateProfile } from "../api";

function Profile({ user }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(formData);
      setMessage("Profile updated successfully");
      setError("");
    } catch (err) {
      setError(err.response?.data.message || "Failed to update profile");
      setMessage("");
    }
  };

  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="profile">
      <h2>Your Profile</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
