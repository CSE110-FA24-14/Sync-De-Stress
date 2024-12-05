import React, { useEffect, useState } from 'react';
import { fetchNotifications, acceptFriendRequest, declineFriendRequest, NotificationInterface } from '../services/authService'; 
import NotificationComponent from '../styles/NotificationComponent';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationInterface[]>([]);
  const [error, setError] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(true); // loading

  // Fetch notifications from the server
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err: any) {
      setError('Failed to load notifications. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Handle Accept Friend Request
  const handleAccept = async (id: string) => {
    try {
      setLoading(true);
      const success = await acceptFriendRequest(id);
      if (success) {
        // Update notification status locally
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, status: 'accepted' } : notif
          )
        );
      }
    } catch (err: any) {
      setError('Failed to accept friend request.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Decline Friend Request
  const handleDecline = async (id: string) => {
    try {
      setLoading(true);
      const success = await declineFriendRequest(id);
      if (success) {
        // Remove notification from the list
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      }
    } catch (err: any) {
      setError('Failed to decline friend request.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="notifications-wrapper">
      {notifications != undefined && notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        notifications?.map((notification) => (
          <NotificationComponent
            key={notification.id}
            id={notification.id}
            title={notification.title}
            message={notification.message}
            icon={notification.icon}
            status={notification.status === 'read'}
            onUpdate={(id, status) => {
              if (status) {
                handleAccept(id);
              } else {
                handleDecline(id);
              }
            }}
          />
        ))
      )}
    </div>
  );
};

export default Notifications;

