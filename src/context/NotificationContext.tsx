// import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
// // import { Notification } from '../types';
// import {Notification} from '../types/index'

// interface NotificationContextType {
//   notifications: Notification[];
//   unreadCount: number;
//   showNotification: (title: string, message: string, type?: Notification['type']) => void;
//   markAsRead: (id: string) => void;
//   markAllAsRead: () => void;
//   clearAll: () => void;
//   removeNotification: (id: string) => void;
// }

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// export const useNotification = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error('useNotification must be used within a NotificationProvider');
//   }
//   return context;
// };

// interface NotificationProviderProps {
//   children: ReactNode;
// }

// export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
//   const [notifications, setNotifications] = useState<Notification[]>([
//     {
//       id: '1',
//       userId: '1',
//       title: 'Welcome to Score App',
//       message: 'Start tracking academic performance and managing courses',
//       type: 'info',
//       read: false,
//       createdAt: new Date().toISOString(),
//     },
//     {
//       id: '2',
//       userId: '1',
//       title: 'New Assessment Added',
//       message: 'Python Functions Quiz has been added to your course',
//       type: 'success',
//       read: false,
//       link: '/student/assessments',
//       createdAt: new Date(Date.now() - 3600000).toISOString(),
//     },
//     {
//       id: '3',
//       userId: '1',
//       title: 'Score Recorded',
//       message: 'Your score for Data Structures Assignment has been recorded',
//       type: 'info',
//       read: true,
//       link: '/student/performance',
//       createdAt: new Date(Date.now() - 7200000).toISOString(),
//     },
//   ]);

//   const unreadCount = notifications.filter(n => !n.read).length;

//   const showNotification = useCallback((title: string, message: string, type: Notification['type'] = 'info') => {
//     const newNotification: Notification = {
//       id: Date.now().toString(),
//       userId: '1',
//       title,
//       message,
//       type,
//       read: false,
//       createdAt: new Date().toISOString(),
//     };

//     setNotifications(prev => [newNotification, ...prev]);
    
//     // Auto-remove notification after 5 seconds
//     setTimeout(() => {
//       setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
//     }, 5000);
//   }, []);

//   const markAsRead = useCallback((id: string) => {
//     setNotifications(prev =>
//       prev.map(notification =>
//         notification.id === id ? { ...notification, read: true } : notification
//       )
//     );
//   }, []);

//   const markAllAsRead = useCallback(() => {
//     setNotifications(prev =>
//       prev.map(notification => ({ ...notification, read: true }))
//     );
//   }, []);

//   const clearAll = useCallback(() => {
//     setNotifications([]);
//   }, []);

//   const removeNotification = useCallback((id: string) => {
//     setNotifications(prev => prev.filter(notification => notification.id !== id));
//   }, []);

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         unreadCount,
//         showNotification,
//         markAsRead,
//         markAllAsRead,
//         clearAll,
//         removeNotification,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };



// v2

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { NotificationContextType } from '../types';
// import { Notification, NotificationContextType } from '../types';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to Score App!',
      message: 'Get started by exploring your dashboard and courses.',
      time: 'Just now',
      type: 'info',
      read: false
    },
    {
      id: '2',
      title: 'New Assignment Posted',
      message: 'Python Functions Quiz has been posted. Due: Dec 10',
      time: '10 minutes ago',
      type: 'info',
      read: false
    },
    {
      id: '3',
      title: 'Score Updated',
      message: 'Your score for Data Structures Assignment has been updated',
      time: '2 hours ago',
      type: 'success',
      read: false
    },
    {
      id: '4',
      title: 'Attendance Alert',
      message: 'Attendance for Python class is below 75%',
      time: '1 day ago',
      type: 'warning',
      read: true
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remove success/error notifications after 5 seconds
    if (notification.type === 'success' || notification.type === 'error') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Function to show a toast notification
  const showToast = useCallback((title: string, message: string, type: Notification['type'] = 'info') => {
    addNotification({
      title,
      message,
      type,
      time: 'Just now'
    });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Utility hook for showing toast notifications
export const useToast = () => {
  const { addNotification } = useNotification();

  const showSuccess = useCallback((message: string, title: string = 'Success') => {
    addNotification({
      title,
      message,
      type: 'success',
      time: 'Just now'
    });
  }, [addNotification]);

  const showError = useCallback((message: string, title: string = 'Error') => {
    addNotification({
      title,
      message,
      type: 'error',
      time: 'Just now'
    });
  }, [addNotification]);

  const showWarning = useCallback((message: string, title: string = 'Warning') => {
    addNotification({
      title,
      message,
      type: 'warning',
      time: 'Just now'
    });
  }, [addNotification]);

  const showInfo = useCallback((message: string, title: string = 'Info') => {
    addNotification({
      title,
      message,
      type: 'info',
      time: 'Just now'
    });
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
