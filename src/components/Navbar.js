import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Atlas Blog
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/create-post">Create Post</Link>
            <Link to="/profile">Profile</Link>
            {user.role === "admin" && (
              <>
                <Link to="/register">Register New User</Link>
                <Link to="/admin/users">Manage Users</Link>
              </>
            )}
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
