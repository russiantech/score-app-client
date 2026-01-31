import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TutorDashboard from '../pages/tutor/Dashboard';
import MyCourses from '../pages/tutor/MyCourses';
import CourseDetails from '../pages/tutor/CourseDetails';
import AddCourse from '../pages/tutor/AddCourse';
import RecordScores from '../pages/tutor/_/RecordScores';
import StudentProgress from '../pages/tutor/StudentProgress';

export const TutorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TutorDashboard />} />
      <Route path="courses" element={<MyCourses />} />
      <Route path="courses/add" element={<AddCourse />} />
      <Route path="courses/:courseId" element={<CourseDetails />} />
      <Route path="courses/:courseId/scores" element={<RecordScores />} />
      <Route path="students/:studentId/progress" element={<StudentProgress />} />
    </Routes>
  );
};
