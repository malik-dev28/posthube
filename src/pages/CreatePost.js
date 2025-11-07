import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content.');
      return;
    }

    try {
      setLoading(true);
      await postsAPI.createPost(formData);
      navigate('/');
    } catch (err) {
      alert('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (!window.confirm('Are you sure you want to discard this post?')) {
        return;
      }
    }
    navigate('/');
  };

  return (
    <div className="create-post-page">
      <div className="container">
        <div className="page-header">
          <h1>Write New Post</h1>
          <p>Share your thoughts and ideas with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="post-form card">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter a compelling title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt" className="form-label">Excerpt (Optional)</label>
            <input
              type="text"
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="form-input"
              placeholder="Brief description of your post..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-textarea large"
              placeholder="Write your post content here... (Markdown supported)"
              rows="15"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner small"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <FaPaperPlane /> Publish Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;