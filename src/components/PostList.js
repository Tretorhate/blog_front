import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../api";

function PostList({ user }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts();
        setPosts(res.data.data);
        setError("");
      } catch (err) {
        setError(err.response?.data.message || "Failed to fetch posts");
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="post-list">
      <h2>All Posts</h2>
      {error && <p className="error">{error}</p>}
      {posts.length === 0 && !error && <p>No posts available yet.</p>}
      {posts.map((post) => (
        <div key={post._id} className="post">
          <h3>
            <Link to={`/posts/${post._id}`} className="post-title">
              {post.title}
            </Link>
          </h3>
          <p>{post.content.substring(0, 100)}...</p>
          <p>Tags: {post.tags.join(", ")}</p>
          <p>By: {post.author.username}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
