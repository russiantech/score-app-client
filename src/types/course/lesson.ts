// // /* =====================================================
// //    LESSON TYPES
// // ===================================================== */

// import type { Attendance } from "./attendance";
// import type { Score } from "./score";

// // import type { Assessment } from "./assessment";

// // export interface Lesson_0 {
// //   id: string;
// //   courseId: string;
// //   courseName?: string;
// //   title: string;
// //   description: string;
// //   content?: string;
// //   order: number;
// //   assessments: Assessment[];
// //   duration?: number; // in minutes
// //   resources?: LessonResource[];
// //   isPublished: boolean;
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // export interface LessonResource {
// //   id: string;
// //   type: 'pdf' | 'video' | 'link' | 'document';
// //   title: string;
// //   url: string;
// //   size?: number;
// // }

// export interface CreateLessonDTO {
//   courseId: string;
//   title: string;
//   description: string;
//   content?: string;
//   order: number;
//   duration?: number;
//   // resources?: Omit<LessonResource, 'id'>[];
//   isPublished?: boolean;

// }

// export interface UpdateLessonDTO extends Partial<CreateLessonDTO> {}



// // Update Lesson type to include attendance and scores
// export interface Lesson {
//   id: string;
//   module_id: string;
//   title: string;
//   description?: string;
//   order: number;
//   date?: string;
//   duration?: string;
//   status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
//   is_published: boolean;
//   created_at?: string;
//   updated_at?: string;
  
//   // Attendance data
//   attendances?: Attendance[];
//   attendance_count?: number;
//   present_count?: number;
//   absent_count?: number;
//   attendance_rate?: number;
  
//   // Score data
//   scores?: Score[];
//   scores_count?: number;
//   average_score?: number;
//   highest_score?: number;
//   lowest_score?: number;
// }




// v2
import type { AttendanceResponse } from "./attendance";
import type { Course } from "./course";
import type { LessonScoreResponse } from "./score";

export interface CreateLessonDTO {
  module_id: string;           // module this lesson belongs to
  title: string;
  description?: string;
  content?: string;
  order: number;
  date?: string;
  duration?: number;           // in minutes
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  is_published?: boolean;
}

export interface UpdateLessonDTO extends Partial<CreateLessonDTO> {}

// Full Lesson type including attendance and scores
export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  order: number;
  date?: string;
  duration?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  total_assessments?: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;

  // Attendance
  attendances?: AttendanceResponse[];
  attendance_count?: number;
  present_count?: number;
  absent_count?: number;
  attendance_rate?: number;

  // Scores
  scores?: LessonScoreResponse[];
  scores_count?: number;
  average_score?: number;
  highest_score?: number;
  lowest_score?: number;
}


export interface AddLessonModalProps {
  course: Course;
 students_count?: number;
 lessons_count?: number;
  lesson?: Lesson | null;
  isEditing?: boolean;
  onSave: (data: {
    title: string;
    date: string;
    duration: string;
    description: string;
  }) => void;
  onClose: () => void;
}