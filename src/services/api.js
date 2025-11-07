import axios from 'axios';

// Use the backend API root (no extra `/posts` suffix here) so endpoints below
// append the resource paths like `/posts` or `/auth` consistently.
const API_BASE_URL = 'http://10.172.168.89:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Posts API
export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

// Comments API
export const commentsAPI = {
  // Comments are nested under posts on the backend: /api/posts/:postId/comments
  getCommentsByPost: (postId) => api.get(`/posts/${postId}/comments`),
  addComment: (postId, commentData) => api.post(`/posts/${postId}/comments`, commentData),
  // Deleting a comment may be served from /api/comments/:id or /api/posts/comments/:id depending on backend.
  // Keep the same shape as before; with API_BASE_URL set to /api this resolves to /api/comments/:id
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export default api;