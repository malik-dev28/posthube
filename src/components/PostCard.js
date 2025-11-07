import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaComment, FaHeart } from 'react-icons/fa';
import './PostCard.css';

const PostCard = ({ post, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAuthor = currentUser.id === post.author?.id;

  return (
    <article className="post-card card fade-in">
      <div className="post-header">
        <div className="post-meta">
          <div className="author-info">
            <div className="avatar">
              {post.author?.name?.charAt(0) || post.author?.username?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="author-name">
                {post.author?.name || post.author?.username || 'Unknown Author'}
              </div>
              <div className="post-date">
                <FaCalendar /> {formatDate(post.createdAt || post.date)}
              </div>
            </div>
          </div>
          
          {isAuthor && (
            <div className="post-actions">
              <Link to={`/edit/${post.id}`} className="btn btn-secondary btn-sm">
                Edit
              </Link>
              <button 
                onClick={() => onDelete(post.id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        <Link to={`/post/${post.id}`} className="post-title-link">
          <h2 className="post-title">{post.title}</h2>
        </Link>
      </div>

      <div className="post-content">
        <p>{truncateContent(post.content)}</p>
      </div>

      <div className="post-footer">
        <div className="post-stats">
          <span className="stat">
            <FaComment /> {post.commentCount || 0}
          </span>
          <span className="stat">
            <FaHeart /> {post.likeCount || 0}
          </span>
        </div>
        <Link to={`/post/${post.id}`} className="read-more">
          Read more →
        </Link>
      </div>
    </article>
  );
};

export default PostCard;