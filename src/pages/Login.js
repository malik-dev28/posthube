import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import auth from '../services/auth';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      let response;
      
      if (isLogin) {
        response = await auth.login({
          username: formData.username,
          password: formData.password
        });
      } else {
        response = await auth.register(formData);
      }

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      navigate('/');
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        (isLogin ? 'Login failed. Please check your credentials.' : 'Registration failed. Please try again.');
      alert(errorMessage);
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      name: ''
    });
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card card">
            <div className="auth-header">
              <h1>{isLogin ? 'Welcome Back' : 'Join PostHub'}</h1>
              <p>{isLogin ? 'Sign in to your account' : 'Create your account to start writing'}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your email"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner small"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? <FaSignInAlt /> : <FaUserPlus />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button" 
                  onClick={switchMode}
                  className="auth-switch"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
              
              <Link to="/" className="back-home">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;