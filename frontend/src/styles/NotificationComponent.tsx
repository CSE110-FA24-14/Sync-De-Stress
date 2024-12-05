import React, { useState } from 'react';
import './NotificationComponent.css';
import { respondFriendRequest } from '../services/authService';

interface NotificationProps {
  id: string;
  title: string;
  type: number;
  updateType: (id: string, newType: number) => void;
}

const NOTIFICATION_MATCH_REQUEST = 0;
const NOTIFICATION_MATCHED = 1;
const NOTIFICATION_MATCH_DENIED = 2;

const NotificationComponent: React.FC<NotificationProps> = ({
  id,
  title,
  type,
  updateType
}) => {
  // const [currentStatus, setCurrentStatus] = useState(status);

  const handleReject = () => {
    respondFriendRequest(id, false);
    updateType(id, NOTIFICATION_MATCH_DENIED);
  };

  const handleAccept = () => {
    respondFriendRequest(id, true);
    updateType(id, NOTIFICATION_MATCHED);
  };

  return (
    <div className="notification-bubble">
      <div className="notification-image">
        <img src={'../icons/profile_svg.svg'} alt="Notification Icon" className="notification-icon" />
      </div>
      <div className="notification-info">
        <h3 className="notification-title">{title}</h3>
      </div>
      <div className="notification-actions">
        {type == NOTIFICATION_MATCH_REQUEST ? (
          <div>
            <button
              onClick={handleReject}
            >
              X
            </button>
            <button
              onClick={handleAccept}
            >
              ✔
            </button>
          </div>

        ) : (
          <p>View Profile</p>
        )}

      </div>
    </div>
  );
};

export default NotificationComponent;