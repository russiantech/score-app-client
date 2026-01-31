// // src/types/attendance.ts

// export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

// export interface Attendance {
//   id: string;
//   lesson_id: string;
//   student_id: string;
//   student_name?: string;
//   student_email?: string;
//   status: AttendanceStatus;
//   marked_at?: string;
//   remarks?: string;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface AttendanceCreate {
//   lesson_id: string;
//   student_id: string;
//   status: AttendanceStatus;
//   remarks?: string;
// }

// export interface AttendanceUpdate {
//   status?: AttendanceStatus;
//   remarks?: string;
// }

// export interface AttendanceBulkCreate {
//   lesson_id: string;
//   attendances: {
//     student_id: string;
//     status: AttendanceStatus;
//     remarks?: string;
//   }[];
// }



// v2
// src/types/attendance.ts

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface StudentAttendanceData {
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
