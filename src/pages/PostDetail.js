import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { postsAPI, commentsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CommentList from './CommentList';
import { FaCalendar, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const [postResponse, commentsResponse] = await Promise.all([
        postsAPI.getPostById(id),
        commentsAPI.getCommentsByPost(id)
      ]);
      setPost(postResponse.data);
      setComments(commentsResponse.data);
    } catch (err) {
      setError('Post not found or failed to load.');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await commentsAPI.addComment(id, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      alert('Failed to add comment. Please try again.');
      console.error('Error adding comment:', err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
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

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAuthor = currentUser.id === post?.author?.id;

  if (loading) {
    return (
      <div className="post-detail-page">
        <div className="container">
          <LoadingSpinner text="Loading post..." />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Post Not Found</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              <FaArrowLeft /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <div className="container">
        <button onClick={() => navigate('/')} className="back-button">
          <FaArrowLeft /> Back to Posts
        </button>

        <article className="post-detail card">
          <header className="post-header">
            <div className="post-meta">
              <div className="author-info">
                <div className="avatar large">
                  {post.author?.name?.charAt(0) || post.author?.username?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="author-name">
                    {post.author?.name || post.author?.username || 'Unknown Author'}
                  </div>
                  <div className="post-date">
                    <FaCalendar /> {new Date(post.createdAt || post.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {isAuthor && (
                <div className="post-actions">
                  <button 
                    onClick={() => navigate(`/edit/${post.id}`)}
                    className="btn btn-secondary"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={handleDeletePost}
                    className="btn btn-danger"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>

            <h1 className="post-title">{post.title}</h1>
          </header>

          <div className="post-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>

        {/* Comments Section */}
        <section className="comments-section card">
          <h3>Comments ({comments.length})</h3>
          
          {localStorage.getItem('token') ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="form-textarea"
                rows="3"
                required
              />
              <button type="submit" className="btn btn-primary">
                Add Comment
              </button>
            </form>
          ) : (
            <div className="login-prompt">
              <p>Please log in to leave a comment.</p>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Sign In
              </button>
            </div>
          )}

          <CommentList 
            comments={comments} 
            onCommentDelete={fetchPostAndComments}
          />
        </section>
      </div>
    </div>
  );
};

export default PostDetail;