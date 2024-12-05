import React, { useState } from 'react';
import './NotificationComponent.css';

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  icon?: string; // Optional icon URL
  status: boolean; // Read/unread or action status
  onUpdate: (id: string, status: boolean) => void; // Callback to handle status update
}

const NotificationComponent: React.FC<NotificationProps> = ({
  id,
  title,
  message,
  icon,
  status,
  onUpdate,
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = () => {
    const newStatus = !currentStatus;
    setCurrentStatus(newStatus);
    onUpdate(id, newStatus); // Update via parent or API
  };

  return (
    <div className="notification-bubble">
      <div className="notification-image">
        <img src={icon || '/placeholder-icon.png'} alt="Notification Icon" className="notification-icon" />
      </div>
      <div className="notification-info">
        <h3 className="notification-title">{title}</h3>
        <p className="notification-message">{message}</p>
      </div>
      <div className="notification-actions">
        <button
          className={`status-button ${currentStatus ? 'checked' : 'unchecked'}`}
          onClick={handleStatusChange}
        >
          {currentStatus ? '✔' : '+'}
        </button>
      </div>
    </div>
  );
};

export default NotificationComponent;