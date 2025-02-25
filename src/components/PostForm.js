import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api";

function PostForm() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [];
      await createPost({ ...formData, tags: tagsArray });
      navigate("/");
    } catch (err) {
      setErrors(
        err.response?.data.errors || [
          err.response?.data.message || "Failed to create post",
        ]
      );
    }
  };

  return (
    <div className="post-form">
      <h2>Create Post</h2>
      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((error, index) => (
            <li key={index} className="error">
              {error}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default PostForm;
