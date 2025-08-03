import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { FaKey } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="main-header">
      <Link to="/" className="logo-text">
        <img src="/moth-logo.png" alt="Logo" className="header-logo" />
        <span className="brand-name">ProdoXus</span>
      </Link>

      <nav className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/security">Security</Link>
        <Link to="/access" className="access-btn"><FaKey /> Access</Link>
      </nav>
    </header>
  );
};

export default Header;
