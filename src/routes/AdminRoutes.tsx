import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageCourses from '../pages/admin/ManageCourses';
import AssignTutors from '../pages/admin/AssignTutors';
import ParentChildManagement from '../pages/admin/ParentChildManagement';
import UserManagement from '../pages/admin/UserManagement';
import CourseDetails from '../pages/admin/CourseDetails';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="courses" element={<ManageCourses />} />
      <Route path="courses/:courseId" element={<CourseDetails />} />
      <Route path="assign-tutors" element={<AssignTutors />} />
      <Route path="parent-child" element={<ParentChildManagement />} />
      <Route path="users" element={<UserManagement />} />
    </Routes>
  );
};
