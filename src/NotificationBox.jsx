import React from 'react';
import './NotificationBox.css';

const NotificationBox = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="notification-toast">
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default NotificationBox;
