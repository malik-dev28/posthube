import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import './EditPost.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: ''
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPostById(id);
      setPost(response.data);
      setFormData({
        title: response.data.title,
        content: response.data.content,
        excerpt: response.data.excerpt || ''
      });
    } catch (err) {
      alert('Failed to load post. Please try again.');
      console.error('Error fetching post:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);
      await postsAPI.updatePost(id, formData);
      navigate(`/post/${id}`);
    } catch (err) {
      alert('Failed to update post. Please try again.');
      console.error('Error updating post:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await postsAPI.deletePost(id);
      navigate('/');
    } catch (err) {
      alert('Failed to delete post. Please try again.');
      console.error('Error deleting post:', err);
    }
  };

  const handleCancel = () => {
    navigate(`/post/${id}`);
  };

  if (loading) {
    return (
      <div className="edit-post-page">
        <div className="container">
          <LoadingSpinner text="Loading post..." />
        </div>
      </div>
    );
  }

  return (
    <div className="edit-post-page">
      <div className="container">
        <div className="page-header">
          <h1>Edit Post</h1>
          <p>Make changes to your post</p>
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
              rows="15"
              required
            />
          </div>

          <div className="form-actions">
            <div className="left-actions">
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger"
              >
                <FaTrash /> Delete Post
              </button>
            </div>
            
            <div className="right-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={saving}
              >
                <FaTimes /> Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="loading-spinner small"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;