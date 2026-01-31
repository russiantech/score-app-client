import React from 'react';
import '@/styles/components/NotificationCenter.css';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'error';
  read: boolean;
}

interface NotificationCenterProps {
  onClose: () => void;
  onClear: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, onClear }) => {
  const notifications: Notification[] = [
    {
      id: 1,
      title: 'New Assessment Added',
      message: 'A new quiz has been added to Advanced Python Programming',
      time: '10 min ago',
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'Score Updated',
      message: 'Your score for Web Development assignment has been updated',
      time: '2 hours ago',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'Upcoming Deadline',
      message: 'Data Science project submission due in 3 days',
      time: '1 day ago',
      type: 'warning',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return 'fa-check-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'error': return 'fa-times-circle';
      default: return 'fa-info-circle';
    }
  };

  const getNotificationClass = (type: string) => {
    switch(type) {
      case 'success': return 'notification-success';
      case 'warning': return 'notification-warning';
      case 'error': return 'notification-error';
      default: return 'notification-info';
    }
  };

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h5 className="mb-0">Notifications</h5>
        <div className="notification-actions">
          <button className="btn btn-sm btn-link" onClick={onClear}>
            Mark all as read
          </button>
          <button className="btn btn-sm btn-link text-danger" onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>
      </div>
      
      <div className="notification-list">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item ${getNotificationClass(notification.type)} ${notification.read ? 'read' : ''}`}
          >
            <div className="notification-icon">
              <i className={`fa ${getNotificationIcon(notification.type)}`}></i>
            </div>
            <div className="notification-content">
              <h6 className="notification-title">{notification.title}</h6>
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="notification-footer">
        <a href="/notifications" className="btn btn-primary btn-sm">
          View All Notifications
        </a>
      </div>
    </div>
  );
};

export default NotificationCenter;