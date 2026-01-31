// import type { toast, ToastOptions } from 'react-hot-toast';
// import type { Toast } from "react-hot-toast";

import toast, { type ToastOptions } from "react-hot-toast";

export const NotificationService = {
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const options: ToastOptions = {
      duration: 4000,
      position: 'top-right',
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast(message, {
          ...options,
          icon: '⚠️',
        });
        break;
      default:
        toast(message, options);
    }
  },

  showDialog: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    // For now, we'll use toast for dialogs too
    NotificationService.showToast(message, type);
  },

  showNotification: (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    // This would trigger the notification context in a real app
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    NotificationService.showToast(`${title}: ${message}`, type);
    // NotificationService.showToast(`${title}: ${message}`, type);
  },
};
