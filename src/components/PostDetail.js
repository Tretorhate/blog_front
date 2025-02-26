import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost, deletePost } from "../api";

function PostDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [editErrors, setEditErrors] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPost(id);
        setPost(res.data.data);
        setEditFormData({
          title: res.data.data.title,
          content: res.data.data.content,
          tags: res.data.data.tags.join(", "),
        });
        setError("");
      } catch (err) {
        setError(err.response?.data.message || "Failed to fetch post");
      }
    };
    fetchPost();
  }, [id]);

  const canEditOrDelete = () => {
    if (!user || !post) return false;
    return user.id === post.author._id.toString() || user.role === "admin";
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const tagsArray = editFormData.tags
        ? editFormData.tags.split(",").map((tag) => tag.trim())
        : [];
      const updatedPost = { ...editFormData, tags: tagsArray };
      await updatePost(id, updatedPost);
      const res = await getPost(id);
      setPost(res.data.data);
      setIsEditing(false);
      setEditErrors([]);
    } catch (err) {
      setEditErrors(
        err.response?.data.errors || [
          err.response?.data.message || "Failed to update post",
        ]
      );
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        navigate("/");
      } catch (err) {
        setError(err.response?.data.message || "Failed to delete post");
      }
    }
  };

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="post-detail">
      {isEditing ? (
        <div className="edit-form">
          {" "}
          {/* Added wrapper */}
          <h2>Edit Post</h2>
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
            <button onClick={handleEditSubmit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Tags: {post.tags.join(", ")}</p>
          <p>By: {post.author.username}</p>
          <p>Created: {new Date(post.createdAt).toLocaleDateString()}</p>
          {post.updatedAt !== post.createdAt && (
            <p>Updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
          )}
          {canEditOrDelete() && (
            <div className="post-actions">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PostDetail;
