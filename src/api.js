import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const createPost = (data) => API.post("/posts", data);
export const getPosts = () => API.get("/posts");
export const getPost = (id) => API.get(`/posts/${id}`);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const getProfile = () => API.get("/users/profile");
export const updateProfile = (data) => API.put("/users/profile", data);
export const getAllUsers = () => API.get("/users"); // New
export const deleteUser = (id) => API.delete(`/users/${id}`); // New

export default API;
