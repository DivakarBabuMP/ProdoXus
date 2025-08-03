import React, { useState } from 'react';
import './access.css';
import {
  FaLock,
  FaUserLock,
  FaKey,
  FaInfoCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const Access = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState(null);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const backendURL = 'http://localhost:5000'; // Update for deployment

  // Handle Login with Private Key
  const handleLogin = async () => {
    if (!privateKey.trim()) {
      setError('Please enter your private key.');
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privateKey }),
      });

      const data = await response.json();
      if (data.success) {
        setError('');
        navigate('/inbox', {
          state: { pub: data.publicKey, priv: privateKey },
        });
      } else {
        setError('Invalid private key. Please try again or generate one.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again.');
    }
  };

  // Generate and Save Key Pair
  const generateKeys = async () => {
    const publicKey = btoa(uuidv4()); // Encode UUID to base64
    const privateKey = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');

    try {
      const response = await fetch(`${backendURL}/api/generate-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey, privateKey }),
      });

      const data = await response.json();
      if (data.publicKey && data.privateKey) {
        setGeneratedKeys(data);
        setPrivateKey('');
        setError('');
        setShowNotification(true);
      } else {
        setError('Failed to generate keys. Please try again.');
      }
    } catch (err) {
      console.error('Key generation error:', err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="access-wrapper">
      {showNotification && (
  <>
    <div className="blur-overlay" />
    <div className="notification-popup">
      <p>
        <FaInfoCircle className="icon-info" />
        <strong> Note: </strong> Save your <strong>public</strong> and <strong>private</strong> keys securely.
        They are required for access and cannot be recovered later.
        <br />
        <strong>ᛒᛁ ᛞᛖᚢᛖᛚᛟᛈᛖᚱ ᚨᛚᛈᚺᚨ ᛞᛖᚢ</strong>
      </p>
      <div className="button-wrapper">
        <button className="close-btn" onClick={() => setShowNotification(false)}>
          Dismiss
        </button>
      </div>
    </div>
  </>
)}


      <div className={`access-container ${showNotification ? 'blurred' : ''}`}>
        <div className="access-card">
          <h2>
            <FaLock /> Enter Private Key
          </h2>

          <input
            className="private-input"
            type="text"
            placeholder="Paste your private key..."
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />

          <button className="login-btn" onClick={handleLogin}>
            <FaUserLock /> Login
          </button>

          {error && (
            <p className="error-message">
              <FaTimesCircle className="error-icon" /> {error}
            </p>
          )}

          <p className="generate-text" onClick={generateKeys}>
            <FaKey className="key-icon" /> Need a code?{' '}
            <span className="clickable">Generate keys</span>
          </p>

          {generatedKeys && (
            <div className="keys-display">
              <p><strong>Public Key:</strong></p>
              <div className="key-box">{generatedKeys.publicKey}</div>
              <p><strong>Private Key:</strong></p>
              <div className="key-box">{generatedKeys.privateKey}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Access;
