import { Navigate, useLocation } from 'react-router-dom';
import { getPrimaryRole, normalizeRoles, resolveRoleRedirect } from '@/utils/auth/roles';
import { useAuth } from '../../hooks/useAuth';

const RoleRedirect = () => {
  const { auth } = useAuth();
  const location = useLocation();
    console.log('RoleRedirect: current location =', location.pathname);
    console.log('RoleRedirect: current user =', auth?.user);
  if (!auth) {
    console.warn('RoleRedirect: No authenticated user found, redirecting to signin');
    return (
      <Navigate
        to="/auth/signin"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const roles = normalizeRoles(auth.user.roles);
  const primaryRole = getPrimaryRole(roles);
  const redirectTo = resolveRoleRedirect(primaryRole);
  console.log(`RoleRedirect: User roles = ${JSON.stringify(roles)}, primary role = ${primaryRole}, redirecting to ${redirectTo}`);
  return <Navigate to={redirectTo} replace />;

};

export default RoleRedirect;
