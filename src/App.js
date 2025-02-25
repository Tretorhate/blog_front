import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/create-post" element={<PostForm />} />
            <Route path="/" element={<PostList user={user} />} />{" "}
            {/* Pass user */}
            <Route path="/profile" element={<Profile user={user} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
