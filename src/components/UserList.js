/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "../api";

function UserList({ user }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data.data);
        setError("");
      } catch (err) {
        setError(err.response?.data.message || "Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((u) => u._id !== userId)); // Remove from state
        setError("");
      } catch (err) {
        setError(err.response?.data.message || "Failed to delete user");
      }
    }
  };

  // Redirect non-admins
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="user-list">
      <h2>All Users</h2>
      {error && <p className="error">{error}</p>}
      {users.length === 0 && !error && <p>No users found.</p>}
      {users.map((u) => (
        <div key={u._id} className="user-item">
          <h3>{u.username}</h3>
          <p>Email: {u.email}</p>
          <p>Role: {u.role}</p>
          <p>Bio: {u.bio || "No bio provided"}</p>
          <p>Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
          <div className="user-actions">
            <button onClick={() => handleDelete(u._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserList;
