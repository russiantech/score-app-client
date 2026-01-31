// import type { Course, Assessment } from '@/types/course';
// import { AxiosService } from '../base/AxiosService';
// import type { ApiResponse } from '@/types';
// // import { ApiResponse, Course, Lesson, Assessment, Score } from '../../types';

// const CourseService = {
//   // Course Management
//   async getCourses(params?: any): Promise<ApiResponse<any>> {
//     const response = await AxiosService.fetchPage('/courses', params);
//     return {
//       success: response.status >= 200 && response.status < 300,
//       data: response.data,
//       message: response.statusText,
//       error: !((response.status >= 200 && response.status < 300)) ? response.statusText : undefined,
//     };
//   },

//   async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
//     const response = await AxiosService.json.get(`/courses/${courseId}`);
//     return response.data;
//   },

//   async createCourse(courseData: Partial<Course>): Promise<ApiResponse<Course>> {
//     const response = await AxiosService.json.post('/courses', courseData);
//     return response.data;
//   },

//   async updateCourse(courseId: string, data: Partial<Course>): Promise<ApiResponse<Course>> {
//     const response = await AxiosService.json.put(`/courses/${courseId}`, data);
//     return response.data;
//   },

//   async deleteCourse(courseId: string): Promise<ApiResponse> {
//     const response = await AxiosService.json.delete(`/courses/${courseId}`);
//     return response.data;
//   },

//   // Lessons
//   async getLessons(courseId: string): Promise<ApiResponse<Lesson[]>> {
//     const response = await AxiosService.json.get(`/courses/${courseId}/lessons`);
//     return response.data;
//   },

//   async createLesson(courseId: string, lessonData: Partial<Lesson>): Promise<ApiResponse<Lesson>> {
//     const response = await AxiosService.json.post(`/courses/${courseId}/lessons`, lessonData);
//     return response.data;
//   },

//   async updateLesson(
//     courseId: string,
//     lessonId: string,
//     data: Partial<Lesson>
//   ): Promise<ApiResponse<Lesson>> {
//     const response = await AxiosService.json.put(`/courses/${courseId}/lessons/${lessonId}`, data);
//     return response.data;
//   },

//   async deleteLesson(courseId: string, lessonId: string): Promise<ApiResponse> {
//     const response = await AxiosService.json.delete(`/courses/${courseId}/lessons/${lessonId}`);
//     return response.data;
//   },

//   // Assessments
//   async getAssessments(courseId: string, params?: any): Promise<ApiResponse<any>> {
//     const response = await AxiosService.fetchPage(`/courses/${courseId}/assessments`, params);
//     return {
//       success: response.status >= 200 && response.status < 300,
//       data: response.data,
//       message: response.statusText,
//       error: !(response.status >= 200 && response.status < 300) ? response.statusText : undefined,
//     };
//   },

//   async createAssessment(
//     courseId: string,
//     assessmentData: Partial<Assessment>
//   ): Promise<ApiResponse<Assessment>> {
//     const response = await AxiosService.json.post(`/courses/${courseId}/assessments`, assessmentData);
//     return response.data;
//   },

//   async updateAssessment(
//     courseId: string,
//     assessmentId: string,
//     data: Partial<Assessment>
//   ): Promise<ApiResponse<Assessment>> {
//     const response = await AxiosService.json.put(
//       `/courses/${courseId}/assessments/${assessmentId}`,
//       data
//     );
//     return response.data;
//   },

//   async deleteAssessment(courseId: string, assessmentId: string): Promise<ApiResponse> {
//     const response = await AxiosService.json.delete(`/courses/${courseId}/assessments/${assessmentId}`);
//     return response.data;
//   },

//   // Scores
//   async getScores(assessmentId: string): Promise<ApiResponse<Score[]>> {
//     const response = await AxiosService.json.get(`/assessments/${assessmentId}/scores`);
//     return response.data;
//   },

//   async recordScore(
//     assessmentId: string,
//     scoreData: Partial<Score>
//   ): Promise<ApiResponse<Score>> {
//     const response = await AxiosService.json.post(`/assessments/${assessmentId}/scores`, scoreData);
//     return response.data;
//   },

//   async updateScore(
//     scoreId: string,
//     data: Partial<Score>
//   ): Promise<ApiResponse<Score>> {
//     const response = await AxiosService.json.put(`/scores/${scoreId}`, data);
//     return response.data;
//   },

//   async getStudentScores(studentId: string, courseId?: string): Promise<ApiResponse<Score[]>> {
//     const url = courseId
//       ? `/students/${studentId}/courses/${courseId}/scores`
//       : `/students/${studentId}/scores`;
//     const response = await AxiosService.json.get(url);
//     return response.data;
//   },

//   // Enrollment
//   async enrollStudent(courseId: string, studentId: string): Promise<ApiResponse> {
//     const response = await AxiosService.json.post(`/courses/${courseId}/enroll`, { studentId });
//     return response.data;
//   },

//   async getEnrolledStudents(courseId: string): Promise<ApiResponse<any>> {
//     const response = await AxiosService.json.get(`/courses/${courseId}/students`);
//     return response.data;
//   },

//   async getMyCourses(): Promise<ApiResponse<Course[]>> {
//     const response = await AxiosService.json.get('/courses/my');
//     return response.data;
//   },
// };

// export default CourseService;



// v2
export const CourseService = {
  
  async getAll(filter?: CourseFilter): Promise<Course[]> {
    try {
      const response = await AxiosService.json.get('/courses', { params: filter });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getById(id: string): Promise<Course> {
    try {
      const response = await AxiosService.json.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async create(data: CreateCourseDTO): Promise<Course> {
    try {
      const response = await AxiosService.json.post('/courses', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async update(id: string, data: UpdateCourseDTO): Promise<Course> {
    try {
      const response = await AxiosService.json.put(`/courses/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await AxiosService.json.delete(`/courses/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  async getLessons(courseId: string): Promise<Lesson[]> {
    try {
      const response = await AxiosService.json.get(`/courses/${courseId}/lessons`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getEnrollments(courseId: string): Promise<Enrollment[]> {
    try {
      const response = await AxiosService.json.get(`/courses/${courseId}/enrollments`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getPerformance(courseId: string): Promise<StudentPerformance[]> {
    try {
      const response = await AxiosService.json.get(`/courses/${courseId}/performance`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};
