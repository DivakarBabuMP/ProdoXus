import React from 'react';
import './Home.css';
import {
  FaUserSecret, FaShieldAlt, FaLock, FaDoorOpen,
  FaGithub, FaKey, FaPaperPlane
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <main className="hero-section">
        <img src="/moth-logo.png" alt="logo" className="hero-image" />
        <h1 className="hero-title">Enter the Hidden Realm</h1>
        <p className="hero-subtext">Secure. Anonymous. Yours.</p>
        <div className="hero-buttons">
          <button className="hero-button" onClick={() => navigate('/Access')}>
            <FaKey className="button-icon" /> Access with Code
          </button>
          <button className="hero-button secondary" onClick={() => navigate('/Access')}>
            <FaPaperPlane className="button-icon" /> Send a Message
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section className="features">
        <h2>Built for Privacy</h2>
        <p className="features-subtext">Experience true digital freedom</p>
        <div className="cards">
          <div className="card">
            <FaUserSecret className="card-icon" />
            <h3>Anonymous Messaging</h3>
            <p>No phone numbers or emails required. Stay hidden.</p>
          </div>
          <div className="card">
            <FaShieldAlt className="card-icon" />
            <h3>No KYC / No Tracking</h3>
            <p>Zero data collection. Your digital identity stays yours.</p>
          </div>
          <div className="card">
            <FaLock className="card-icon" />
            <h3>End-to-End Encryption</h3>
            <p>Only you and your recipient can see the message. Period.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Disappear?</h2>
        <p>Join thousands who’ve chosen privacy over surveillance.</p>
        <button className="cta-button" onClick={() => navigate('/Access')}>
          <FaDoorOpen className="door-icon" />
          Enter Now
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-left">Prodoxus</div>
          <div className="footer-right">
            <a onClick={() => navigate('/Security')} style={{ cursor: 'pointer' }}>Privacy</a>
            <a onClick={() => navigate('/About')} style={{ cursor: 'pointer' }}>About</a>
            <a href="https://github.com/LockerAlpha" target="_blank" rel="noopener noreferrer">
              <FaGithub /> GitHub
            </a>
            <a href="mailto:divakarbabu369@gmail.com">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2024 Prodoxus. Privacy by design.
        </div>
      </footer>
    </div>
  );
}

export default Home;
