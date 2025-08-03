import React from 'react';
import './Security.css';
import { FaLock, FaUserSecret, FaKey, FaCodeBranch } from 'react-icons/fa';

const Security = () => {
  return (
    <div className="security-page">
      <div className="security-container">
        <h1 className="security-title"><FaLock /> Security & Privacy</h1>
        <p className="intro-text">
          <strong>Prodoxus</strong> is built for privacy-first communication. We never ask for personal info — no emails, no phone numbers, no IDs. Just secure codes.
        </p>

        <div className="security-section">
          <h2><FaLock /> End-to-End Encryption</h2>
          <p>
            All messages are encrypted on your device before being sent. Our servers can’t see or store your message content — only the recipient with the right key can decrypt it.
          </p>
        </div>

        <div className="security-section">
          <h2><FaUserSecret /> No Tracking or Logs</h2>
          <p>
            We don't track users. No IP logging. No cookies. No analytics. We believe in complete anonymity.
          </p>
        </div>

        <div className="security-section">
          <h2><FaKey /> Code-Based Access</h2>
          <p>
            Your private inbox is protected by a one-of-a-kind access key. Without this key, no one — not even you — can access the messages.
          </p>
        </div>

        <div className="security-section">
          <h2><FaCodeBranch /> 100% Open Source</h2>
          <p>
            Our source code is public. Review it, fork it, or self-host it. Transparency is part of our security philosophy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Security;
