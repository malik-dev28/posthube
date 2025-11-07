import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      alert('Failed to delete post. Please try again.');
      console.error('Error deleting post:', err);
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="container">
          <LoadingSpinner text="Loading posts..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={fetchPosts} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="page-header">
          <h1>Latest Posts</h1>
          <p>Discover the latest stories and insights from our community</p>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No posts yet</h2>
            <p>Be the first to share your story!</p>
            {localStorage.getItem('token') && (
              <a href="/create" className="btn btn-primary">
                Write Your First Post
              </a>
            )}
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;