import CourseDetails from '@/pages/admin/CourseDetails';
import MyCourses from '@/pages/tutor/MyCourses';
import TutorDashboard from '@/pages/tutor/TutorDashboard';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

export const TutorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TutorDashboard />} />
      <Route path="courses" element={<MyCourses />} />
      <Route path="courses/:courseId" element={<CourseDetails />} />
    </Routes>
  );
};
