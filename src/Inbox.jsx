import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaEnvelope,
  FaPaperPlane,
  FaPlus,
  FaPaperclip,
  FaReply,
  FaTrash,
  FaEdit
} from 'react-icons/fa';
import NotificationBox from './NotificationBox';
import './Inbox.css';

const backendURL = 'http://localhost:5000';

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

const Inbox = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userPublicKey = location.state?.pub || '';
  const userPrivateKey = location.state?.priv || '';

  const [showCompose, setShowCompose] = useState(false);
  const [recipientKey, setRecipientKey] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');

  const composeRef = useRef(null);

  const goHome = () => navigate('/');

  const toggleCompose = () => {
    setShowCompose(prev => !prev);
    setActiveTab(prev => (showCompose ? 'inbox' : 'compose'));
  };

  const showNotification = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const fetchInbox = async () => {
    try {
      const res = await fetch(`${backendURL}/api/inbox`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privateKey: userPrivateKey }),
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages || []);
    } catch (err) {
      console.error('Inbox fetch error:', err);
    }
  };

  const fetchSent = async () => {
    try {
      const res = await fetch(`${backendURL}/api/sent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: userPublicKey }),
      });
      const data = await res.json();
      if (data.success) setSentMessages(data.messages || []);
    } catch (err) {
      console.error('Sent fetch error:', err);
    }
  };

  useEffect(() => {
    fetchInbox();
    const interval = setInterval(fetchInbox, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'sent') {
      fetchSent();
    }
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCompose && composeRef.current && !composeRef.current.contains(event.target)) {
        setShowCompose(false);
        setActiveTab('inbox');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCompose]);

  const sendMessage = async () => {
    if (!recipientKey.trim() || !message.trim()) {
      showNotification('Recipient and message are required');
      return;
    }

    const formData = new FormData();
    formData.append('fromPublicKey', userPublicKey);
    formData.append('toPublicKey', recipientKey.trim());
    formData.append('message', message.trim());
    if (file) formData.append('file', file);

    try {
      const res = await fetch(`${backendURL}/api/send`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Message sent successfully');
        setMessage('');
        setRecipientKey('');
        setFile(null);
        fetchInbox();
        setShowCompose(false);
        setActiveTab('inbox');
      } else {
        showNotification('Failed to send message');
      }
    } catch (err) {
      console.error('Send error:', err);
      showNotification('Server error while sending message');
    }
  };

  const deleteMessage = async (index) => {
    try {
      const res = await fetch(`${backendURL}/api/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privateKey: userPrivateKey, messageIndex: index }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = [...messages];
        updated.splice(index, 1);
        setMessages(updated);
        setSelectedMessage(null);
        showNotification('Message deleted successfully');
      } else {
        showNotification('Failed to delete the message');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotification('Error while deleting message');
    }
  };

  const displayedMessages = activeTab === 'sent' ? sentMessages : messages;

  return (
    <div className="inbox-wrapper">
      <NotificationBox message={notificationMsg} onClose={() => setNotificationMsg('')} />

      <header className="inbox-header">
        <div className="logo" onClick={goHome} style={{ cursor: 'pointer' }}>
          <img src="/moth-logo.png" alt="ProdoXus Logo" className="logo-img" />
          ProdoXus
        </div>
        <h1>{activeTab === 'sent' ? 'Anonymous SentBox' : 'Anonymous Inbox'}</h1>
        <div className="code-box">
          Access Code: <span className="blur">{userPrivateKey.slice(0, 4)}-****</span>
        </div>
      </header>

      <div className="inbox-main">
        <div className="sidebar">
          <div
            className={`icon-box ${activeTab === 'inbox' ? 'active' : ''}`}
            title="Inbox"
            onClick={() => {
              setActiveTab('inbox');
              setShowCompose(false);
            }}
          >
            <FaEnvelope />
          </div>
          <div
            className={`icon-box ${activeTab === 'compose' ? 'active' : ''}`}
            title="Compose"
            onClick={toggleCompose}
          >
            <FaEdit />
          </div>
          <div
            className={`icon-box ${activeTab === 'sent' ? 'active' : ''}`}
            title="Sent"
            onClick={() => {
              setActiveTab('sent');
              setShowCompose(false);
            }}
          >
            <FaPaperPlane />
          </div>
        </div>

        <div className="inbox-content">
          {displayedMessages.length === 0 ? (
            <div className="inbox-empty">
              <img src="/moth-logo.png" alt="Silent Butterfly" className="inbox-image" />
              <p className="inbox-message">No messages yet. The shadows are silent...</p>
            </div>
          ) : (
            <div className="inbox-container">
              {displayedMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className="message-row"
                  onClick={() => setSelectedMessage(msg)}
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="star" onClick={(e) => e.stopPropagation()}>☆</span>
                  <div className="sender">{(activeTab === 'sent' ? msg.to : msg.from).slice(0, 20)}...</div>
                  <div className="subject-preview">
                    <span className="subject">{truncate(msg.message, 40)}</span>
                    <span className="preview"> – {truncate(msg.message, 60)}</span>
                  </div>
                  {msg.fileName && (
                    <a
                      href={`${backendURL}/download/${userPrivateKey}/${msg.id}`}
                      className="attachment"
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaPaperclip />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCompose && (
        <div className="compose-overlay">
          <div className="compose-box" ref={composeRef}>
            <h3>Compose Message</h3>
            <input type="text" value={userPublicKey} readOnly placeholder="Your Public Key" />
            <input
              type="text"
              placeholder="Recipient's Public Key"
              value={recipientKey}
              onChange={(e) => setRecipientKey(e.target.value)}
            />
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button className="send-btn" onClick={sendMessage}>Send Message</button>
          </div>
        </div>
      )}

      {selectedMessage && (
        <div className="message-modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="message-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Message {activeTab === 'sent' ? 'to' : 'from'}</h3>
            <p className="modal-from">{activeTab === 'sent' ? selectedMessage.to : selectedMessage.from}</p>

            <h4>Message:</h4>
            <p className="modal-message">{selectedMessage.message}</p>

            {selectedMessage.fileName && (
              <a
                href={`${backendURL}/download/${userPrivateKey}/${displayedMessages.indexOf(selectedMessage)}`}
                className="modal-download"
                download
              >
                <FaPaperclip style={{ marginRight: '6px' }} />
                Download File
              </a>
            )}

            <div className="modal-actions">
              <button
                className="modal-reply-btn"
                onClick={() => {
                  setRecipientKey(selectedMessage.from);
                  setShowCompose(true);
                  setActiveTab('compose');
                  setSelectedMessage(null);
                }}
              >
                <FaReply style={{ marginRight: '6px' }} />
                Reply
              </button>

              <button
                className="modal-delete-btn"
                onClick={() => deleteMessage(messages.indexOf(selectedMessage))}
              >
                <FaTrash style={{ marginRight: '6px' }} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;


