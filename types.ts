
export enum UserRole {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export type AppState = 'LOADING' | 'ROLE_SELECTION' | 'LOGIN' | 'DASHBOARD';

export type AdminTab = 'OVERVIEW' | 'TEACHERS' | 'STUDENTS' | 'HOMEWORK' | 'ATTENDANCE' | 'FINANCE' | 'SETTINGS' | 'NOTIFICATIONS';

export interface Notification {
  id?: string;
  subject: string;
  content: string;
  targets: UserRole[];
  createdAt: string;
  senderName: string;
}
