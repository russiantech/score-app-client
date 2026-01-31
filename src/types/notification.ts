/* =====================================================
   NOTIFICATION TYPES
===================================================== */

export type NotificationType = 
  | 'assessment_graded'
  | 'new_assessment'
  | 'assessment_due'
  | 'course_enrolled'
  | 'course_completed'
  | 'low_grade_alert'
  | 'system_announcement';

export interface Notification {
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
