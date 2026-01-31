import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from '../pages/auth/Signin';
import Signup from '../pages/auth/Signup';
// import ForgotPassword from '../pages/auth/ForgotPassword';
// import ResetPassword from '../pages/auth/ResetPassword';

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="signin" element={<Signin />} />
      <Route path="signup" element={<Signup />} />
      {/* <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} /> */}
      <Route path="*" element={<Navigate to="sigin" replace />} />
    </Routes>
  );
};
