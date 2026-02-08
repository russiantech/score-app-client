import { Navigate, Outlet } from 'react-router-dom';
import { normalizeRoles, hasAnyRole } from '@/utils/auth/roles';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/users';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode; //  optional
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { auth, loading } = useAuth();

  if (loading) return null;

  if (!auth) {
    return <Navigate to="/auth/signin" replace />;
  }

  const roles = normalizeRoles(auth.user.roles);

  if (allowedRoles && !hasAnyRole(roles, allowedRoles)) {
    return <Navigate to="/404" replace />;
  }

  //  KEY PART
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
