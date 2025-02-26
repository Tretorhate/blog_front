import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import UserList from "./components/UserList"; // New import
import Profile from "./components/Profile";
import { getProfile } from "./api";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.data);
      } catch (err) {
        console.error("Not logged in", err);
      }
    };
    if (localStorage.getItem("token")) {
      fetchUser();
    }
  }, []);

  const ProtectedRegister = ({ user }) => {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return <Register setUser={setUser} />;
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route
              path="/register"
              element={<ProtectedRegister user={user} />}
            />
            <Route path="/create-post" element={<PostForm />} />
            <Route path="/" element={<PostList user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/posts/:id" element={<PostDetail user={user} />} />
            <Route
              path="/admin/users"
              element={<UserList user={user} />}
            />{" "}
            {/* New route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
