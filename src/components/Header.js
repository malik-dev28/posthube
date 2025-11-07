import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPen, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/');
    window.location.reload();
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">📝</span>
            PostHub
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            
            {isLoggedIn ? (
              <div className="user-menu">
                <Link to="/create" className="btn btn-primary btn-sm">
                  <FaPen /> Write
                </Link>
                <div className="user-dropdown">
                  <button className="user-avatar">
                    <div className="avatar">
                      {getInitials(currentUser.name || currentUser.username)}
                    </div>
                  </button>
                  <div className="dropdown-menu">
                    <div className="user-info">
                      <div className="avatar">
                        {getInitials(currentUser.name || currentUser.username)}
                      </div>
                      <div>
                        <div className="user-name">{currentUser.name || currentUser.username}</div>
                        <div className="user-email">{currentUser.email}</div>
                      </div>
                    </div>
                    <hr />
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                <FaUser /> Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;