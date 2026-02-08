import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from '../pages/auth/Signin';
import Signup from '../pages/auth/Signup';

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="signin" element={<Signin />} />
      <Route path="signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="sigin" replace />} />
    </Routes>
  );
};
