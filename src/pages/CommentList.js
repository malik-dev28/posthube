import React from 'react';
import { FaTrash, FaUser } from 'react-icons/fa';
import { commentsAPI } from '../services/api';
import './CommentList.css';

const CommentList = ({ comments, onCommentDelete }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await commentsAPI.deleteComment(commentId);
      onCommentDelete();
    } catch (err) {
      alert('Failed to delete comment. Please try again.');
      console.error('Error deleting comment:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (comments.length === 0) {
    return (
      <div className="no-comments">
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map(comment => (
        <div key={comment.id} className="comment card">
          <div className="comment-header">
            <div className="comment-author">
              <div className="avatar small">
                {comment.author?.name?.charAt(0) || comment.author?.username?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="author-name">
                  {comment.author?.name || comment.author?.username || 'Anonymous'}
                </div>
                <div className="comment-date">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            </div>
            
            {(currentUser.id === comment.author?.id || currentUser.role === 'ADMIN') && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="btn btn-danger btn-sm"
                title="Delete comment"
              >
                <FaTrash />
              </button>
            )}
          </div>
          
          <div className="comment-content">
            {comment.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;