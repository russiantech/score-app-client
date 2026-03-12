// src/types/idcard.ts
export interface IDCardData {
  student_id: string;
  student_name: string;
  email: string;
  phone?: string;
  course: {
    id: string;
    code: string;
    title: string;
  };
  photo?: string;
  enrolled_date: string;
  valid_until: string;
}


export interface StudentIDData {
  id: string;
  names: string;
  email: string;
  student_id: string;
  phone?: string;
  date_of_birth?: string;
  profile_picture?: string;
}

export interface IDCardGenerateRequest {
  course_id: string;
  photo?: string;
}

export interface CourseEnrollment {
  id: string;
    code: string;
    title: string;
  enrolled_at: string;
}

