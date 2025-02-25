import React, { useState, useEffect } from "react";
import { getPosts, updatePost, deletePost } from "../api";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts();
        setPosts(res.data.data);
      } catch (err) {
        setError(err.response?.data.message || "Failed to fetch posts");
      }
    };
    fetchPosts();
  }, []);

  const canEditOrDelete = (post) => {
    const userId = localStorage.getItem("userId"); // Assuming user ID is stored after login
    const userRole = localStorage.getItem("userRole"); // Assuming role is stored after login
    return userId === post.author._id.toString() || userRole === "admin";
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setEditFormData({
      title: post.title,
      content: post.content,
      tags: post.tags.join(", "),
    });
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
      const res = await getPosts(); // Refresh posts after update
      setPosts(res.data.data);
      setEditingPostId(null); // Exit edit mode
    } catch (err) {
      setError(err.response?.data.message || "Failed to update post");
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        const res = await getPosts(); // Refresh posts after deletion
        setPosts(res.data.data);
      } catch (err) {
        setError(err.response?.data.message || "Failed to delete post");
      }
    }
  };

  return (
    <div className="post-list">
      <h2>Your Posts</h2>
      {error && <p className="error">{error}</p>}
      {posts.map((post) => (
        <div key={post._id} className="post">
          {editingPostId === post._id ? (
            <div className="edit-form">
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
              />
              <textarea
                name="content"
                value={editFormData.content}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="tags"
                value={editFormData.tags}
                onChange={handleEditChange}
                placeholder="Tags (comma-separated)"
              />
              <button onClick={() => handleEditSubmit(post._id)}>Save</button>
              <button onClick={() => setEditingPostId(null)}>Cancel</button>
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
