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

  // Protected Register component to redirect logged-in users
  const ProtectedRegister = ({ user }) => {
    if (user && user.role !== "admin") {
      return <Navigate to="/" replace />; // Redirect logged-in users to homepage
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
