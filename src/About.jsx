import React from 'react';
import './About.css';
import { FaLock, FaUserSecret, FaShieldAlt } from 'react-icons/fa';

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Prodoxus</h1>
        <p>Your hidden gateway to anonymous, secure communication.</p>
      </section>

      <section className="about-features">
        <div className="feature-card">
          <FaUserSecret className="feature-icon" />
          <h3>100% Anonymous</h3>
          <p>No sign-ups, no phone numbers, no tracking. You're a ghost.</p>
        </div>

        <div className="feature-card">
          <FaLock className="feature-icon" />
          <h3>End-to-End Encryption</h3>
          <p>Only the receiver can decrypt. Your messages stay yours.</p>
        </div>

        <div className="feature-card">
          <FaShieldAlt className="feature-icon" />
          <h3>One-Time Access</h3>
          <p>Messages self-destruct after retrieval. Zero footprints.</p>
        </div>
      </section>

      <section className="about-cta">
        <h2>Why Prodoxus?</h2>
        <p>
          We built Prodoxus for activists, whistleblowers, lovers, and anyone who values digital privacy.
          In a world of surveillance, you deserve a place to speak freely.
        </p>
      </section>
    </div>
  );
}

export default About;
