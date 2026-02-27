// 
// App.tsx (v3 – Organized, Role-Based, Suspense Optimized)

import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// contexts
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { CourseModalProvider } from './context/CourseModalContext';
import { UserModalProvider } from './context/UserModalContext';

import Layout from '@/components/layout/Layout';
import Preloader from '@/components/shared/Preloader';
import ProtectedRoute from '@/pages/auth/ProtectedRoute';
import RoleRedirect from '@/pages/auth/RoleRedirect';
import AssignTutors from '@/pages/admin/AssignTutors';
import ManageCourses from '@/pages/admin/ManageCourses';
import ParentChildLinks from '@/pages/admin/ParentChildLinks';
import ManageUsers from '@/pages/admin/ManageUsers';
import ManageEnrollments from './pages/admin/ManageEnrollments';

import MyChildren from './pages/parent/MyChildren';
import ChildPerformance from './pages/parent/ChildPerformance';

import MyCourses from '@/pages/tutor/MyCourses';

import StudentPerformance from '@/pages/student/Performance';

import GlobalCourseModal from './components/modals/course/GlobalCourseModal';
import { GlobalUserModal } from './components/modals/user/GlobalUserModal';
import CourseInfo from './pages/shared/CourseInfo';

// css
// ----

// =======================
// Lazy Loaded Pages
// =======================

// Auth
const Signin = lazy(() => import('@/pages/auth/Signin'));
const Signup = lazy(() => import('@/pages/auth/Signup'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const VerifySignup = lazy(() => import('@/pages/auth/VerifySignup'));

// Dashboards
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const TutorDashboard = lazy(() => import('@/pages/tutor/TutorDashboard'));
const ParentDashboard = lazy(() => import('@/pages/parent/Dashboard'));

// Common
const Us = lazy(() => import('@/pages/shared/Us'));
const Me = lazy(() => import('@/pages/shared/Me'));
const OnboardingFlow = lazy(() => import('@/pages/welcome/OnboardingFlow'));
const NotFound = lazy(() => import('@/pages/errors/NotFound'));
const ServerError = lazy(() => import('@/pages/errors/ServerError'));


// =======================
// App Shell
// =======================

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
             <CourseModalProvider>
             <UserModalProvider>
            <Suspense fallback={<Preloader />}>
              <AppContent />
            </Suspense>

            <GlobalCourseModal />  
            <GlobalUserModal />  

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { background: '#363636', color: '#fff' },
                success: { style: { background: '#28a745' } },
                error: { style: { background: '#dc3545' } },
              }}
            />
            </UserModalProvider>
            </CourseModalProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

// =======================
// Auth & Onboarding Check
// =======================

function AuthCheck() {

  const { auth } = useAuth();
  const location = useLocation();

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(
    () => localStorage.getItem('hasSeenOnboarding') === 'true'
  );

  useEffect(() => {
    if (auth && !hasSeenOnboarding) {
      localStorage.setItem('hasSeenOnboarding', 'true');
      setHasSeenOnboarding(true);
    }
  }, [auth, hasSeenOnboarding]);

  // New visitors onboarding
  if (!hasSeenOnboarding && !auth) {
    return (
      <OnboardingFlow
        onFinish={() => {
          localStorage.setItem('hasSeenOnboarding', 'true');
          setHasSeenOnboarding(true);
        }}
      />
    );
  }

  // Auth users accessing auth pages
  if (auth && location.pathname.startsWith('/auth')) {
    return <RoleRedirect />;
  }

  return null;
}


// =======================
// Routes
// =======================

function AppContent() {
  const { auth } = useAuth();
  const authCheck = AuthCheck();

  if (authCheck) return authCheck;

  return (
    <Routes>

      {/* ================= PUBLIC / AUTH ================= */}
      <Route path="/auth/signin" element={auth ? <RoleRedirect /> : <Signin />} />
      <Route path="/auth/signup" element={auth ? <RoleRedirect /> : <Signup />} />
      <Route path="/auth/verify-signup" element={auth ? <RoleRedirect /> : <VerifySignup />} />
      <Route path="/auth/forgot-password" element={auth ? <RoleRedirect /> : <ForgotPassword />} />
      <Route path="/auth/reset-password" element={auth ? <RoleRedirect /> : <ResetPassword />} />

      {/* ================= ERRORS ================= */}
      <Route path="/error/404" element={<NotFound />} />
      <Route path="/error/500" element={<ServerError />} />

      {/* ================= ROOT ================= */}
      <Route path="/" element={<RoleRedirect />} />

      {/* ================= PROTECTED APP ================= */}
      <Route element={<Layout />}>

        {/* ---------- ADMIN (PROTECTED ONCE) ---------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']} children={undefined} />
          }
        >
          <Route path="" element={<AdminDashboard />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="enrollments" element={<ManageEnrollments />} />
          <Route path="assign-tutors" element={<AssignTutors />} />
          <Route path="parent-child" element={<ParentChildLinks />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>


        {/* ---------- TUTOR & ADMIN ---------- */}
        <Route path="/" element={<ProtectedRoute allowedRoles={['admin', 'tutor']} children={undefined} />}>
          <Route path="courses/:id" element={<CourseInfo />} />
        </Route>

        {/* ---------- TUTOR ---------- */}
        <Route path="/tutor" element={<ProtectedRoute allowedRoles={['admin', 'tutor']} children={undefined} />}>
          <Route path="" element={<TutorDashboard />} />
          <Route path="courses" element={<MyCourses />} />
        </Route>

        {/* ---------- STUDENT ---------- */}
        <Route
          path="/student"
          element={<ProtectedRoute allowedRoles={['student', 'tutor', 'admin']} children={undefined} />}
        >
          <Route path="" element={<StudentPerformance />} />
          <Route path="performance" element={<StudentPerformance />} />
        </Route>

        {/* ---------- PARENT ---------- */}
        <Route
          path="/parent"
          element={<ProtectedRoute allowedRoles={['parent']} children={undefined} />}
        >
          <Route path="" element={<ParentDashboard />} />
          <Route path="children" element={<MyChildren />} />
          <Route
            path="children/:childId/performance"
            element={<ChildPerformance />}
          /> 
        </Route>
        

        {/* ---------- COMMON PROTECTED ---------- */}
        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <Me />
            </ProtectedRoute>
          }
        />

        {/* ---------- PUBLIC ---------- */}
        <Route path="/us" element={<Us />} />

      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

