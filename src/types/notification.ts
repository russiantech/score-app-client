/* =====================================================
   NOTIFICATION TYPES
===================================================== */

import type { ReactNode } from "react";

export type NotificationType = 
  | 'assessment_graded'
  | 'new_assessment'
  | 'assessment_due'
  | 'course_enrolled'
  | 'course_completed'
  | 'low_grade_alert'
  | 'system_announcement';

/**
 * Represents a notification sent to a user.
 *
 * The index signature `[x: string]: any;` allows the interface to accept additional properties
 * with string keys and values of any type. This provides flexibility for extending notifications
 * with custom fields that are not explicitly defined in the interface, such as metadata or
 * application-specific attributes. However, use this feature cautiously, as it bypasses strict
 * type checking and may lead to runtime errors if misused.
 *
 * @property id - Unique identifier for the notification.
 * @property userId - Identifier of the user receiving the notification.
 * @property type - The type/category of the notification.
 * @property title - The notification's title.
 * @property message - The notification's content.
 * @property link - Optional link related to the notification.
 * @property isRead - Indicates whether the notification has been read.
 * @property createdAt - Timestamp when the notification was created.
 * @property expiresAt - Optional expiration timestamp for the notification.
 */
export interface Notification {
  [x: string]: any;
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

// 
export interface NotificationDropdown {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'error';
  read: boolean;
}

export interface NotificationCenterProps {
  onClose: () => void;
  onClear: () => void;
}

// context types
export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export interface NotificationProviderProps {
  children: ReactNode;
}