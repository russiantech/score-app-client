// // src/types/attendance.ts

import type { ReactNode } from "react";
import type { Lesson } from "./lesson";
import type { AttendanceSummary } from "../performance";

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson;
  students: Array<{ id: string; names: string; email: string; username?: string }>;
  onSave: () => void;
}

export interface StudentAttendanceData {
  course_title: ReactNode;
  course_code: ReactNode;
  module_title: ReactNode;
  lesson_title: ReactNode;
  enrollment_id: string;
  student_id: string;
  names: string;
  email: string;
  username: string;
  status: AttendanceStatus | null;
  remarks: string;
  date: string | null;
  attendance_id: string | null;
  is_recorded: boolean;
}

export interface AttendanceResponse {
  lesson: {
    id: string;
    title: string;
    module_id: string;
    course_id: string;
  };
  summary: {
    total_students: number;
    recorded_count: number;
  };
  students: StudentAttendanceData[];
}

export interface AttendanceBulkCreate {
  lesson_id: string;
  attendances: {
    enrollment_id: string;
    status: AttendanceStatus;
    remarks?: string;
  }[];
}


export interface AttendanceTabProps {
	attendance: AttendanceSummary;
	// details: AttendanceRecord[];
	details: StudentAttendanceData[];
}
