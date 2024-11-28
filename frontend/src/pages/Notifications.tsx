import React, { useEffect, useState } from 'react';
import { fetchNotifications, updateNotificationStatus, NotificationInterface } from '../services/authService'; // Replace with your service file path
import NotificationComponent from '../styles/NotificationComponent';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationInterface[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationsData = await fetchNotifications();
        setNotifications(notificationsData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load notifications.');
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleNotificationUpdate = async (notificationId: string, status: boolean) => {
    try {
      const updatedNotification = await updateNotificationStatus(notificationId, status);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === updatedNotification.id ? updatedNotification : notification
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update notification status.');
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="notifications-wrapper">
      <h1>Notifications</h1>
      {notifications.map((notification) => (
        <NotificationComponent
          key={notification.id}
          id={notification.id}
          title={notification.title}
          message={notification.message}
          icon={notification.icon}
          status={notification.status}
          onUpdate={handleNotificationUpdate}
        />
      ))}
    </div>
  );
};

export default Notifications;
