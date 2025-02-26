import React, { useState, useEffect } from "react";
import { getPosts, updatePost, deletePost } from "../api";

function PostList({ user }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [editErrors, setEditErrors] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts();
        setPosts(res.data.data);
        setError(""); // Clear error on success
      } catch (err) {
        console.error("Fetch error:", err); // Log full error for debugging
        setError(
          err.response?.data.message ||
            err.message ||
            "Failed to fetch posts - check console for details"
        );
      }
    };
    fetchPosts();
  }, []);

  const canEditOrDelete = (post) => {
    if (!user) return false;
    return user.id === post.author._id.toString() || user.role === "admin";
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setEditFormData({
      title: post.title,
      content: post.content,
      tags: post.tags.join(", "),
    });
    setEditErrors([]);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (postId) => {
    try {
      const tagsArray = editFormData.tags
        ? editFormData.tags.split(",").map((tag) => tag.trim())
        : [];
      const updatedPost = { ...editFormData, tags: tagsArray };
      await updatePost(postId, updatedPost);
      const res = await getPosts();
      setPosts(res.data.data);
      setEditingPostId(null);
      setEditErrors([]);
    } catch (err) {
      setEditErrors(
        err.response?.data.errors || [
          err.response?.data.message || "Failed to update post",
        ]
      );
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        const res = await getPosts();
        setPosts(res.data.data);
      } catch (err) {
        setError(err.response?.data.message || "Failed to delete post");
      }
    }
  };

  return (
    <div className="post-list">
      <h2>All Posts</h2>
      {error && <p className="error">{error}</p>}
      {posts.length === 0 && !error && <p>No posts available yet.</p>}
      {posts.map((post) => (
        <div key={post._id} className="post">
          {editingPostId === post._id ? (
            <div className="edit-form">
              {editErrors.length > 0 && (
                <ul className="error-list">
                  {editErrors.map((error, index) => (
                    <li key={index} className="error">
                      {error}
                    </li>
                  ))}
                </ul>
              )}
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
                placeholder="Post title"
              />
              <textarea
                name="content"
                value={editFormData.content}
                onChange={handleEditChange}
                placeholder="Post content"
              />
              <input
                type="text"
                name="tags"
                value={editFormData.tags}
                onChange={handleEditChange}
                placeholder="Tags (comma-separated)"
              />
              <div className="post-actions">
                <button onClick={() => handleEditSubmit(post._id)}>Save</button>
                <button onClick={() => setEditingPostId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Tags: {post.tags.join(", ")}</p>
              <p>By: {post.author.username}</p>
              {canEditOrDelete(post) && (
                <div className="post-actions">
                  <button onClick={() => handleEditClick(post)}>Edit</button>
                  <button onClick={() => handleDelete(post._id)}>Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostList;
