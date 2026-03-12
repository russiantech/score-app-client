// // v2
// import React from 'react';
// import { NavLink, useLocation } from 'react-router-dom';

// const DASHBOARD_PREFIXES = [
//   '/admin',
//   '/tutor',
//   '/student',
//   '/parent',
// ];

// const MobileBottomNav: React.FC = () => {
//   const location = useLocation();

//   const isHomeActive = DASHBOARD_PREFIXES.some(prefix =>
//     location.pathname === '/' ||
//     location.pathname.startsWith(prefix)
//   );

//   return (
//     <div className="menubar-area footer-fixed">
//       <div className="toolbar-inner menubar-nav justify-content-center">

//         {/* Home */}
//         <NavLink
//           to="/"
//           className={`nav-link ${isHomeActive ? 'active' : ''}`}
//           title="Home"
//         >
//           <i className="fi fi-rr-home"></i>
//         </NavLink>

//         {/* Courses */}
//         {/* Courses - show only for roles that have access */}
//         {['tutor', 'student', 'parent'].some(role =>
//           location.pathname.startsWith(`/${role}`)
//           ) && (
//           <NavLink
//             to="/courses"
//             className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
//             title="Courses"
//           >
//             <i className="fi fi-rr-book"></i>
//           </NavLink>
//         )}

//         {/* Profile */}
//         <NavLink
//           to="/me"
//           className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
//           title="Profile"
//         >
//           <i className="fi fi-rr-user"></i>
//         </NavLink>

//       </div>
//     </div>
//   );
// };

// export default MobileBottomNav;


// v2
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getPrimaryRole } from '@/utils/auth/roles';

const DASHBOARD_PREFIXES = [
  '/admin',
  '/tutor',
  '/student',
  '/parent',
];

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { auth } = useAuth();

  const roles = auth?.user?.roles ?? [];

  const allowedRoles = ['dev', 'admin', 'tutor', 'super_admin', 'parent', 'student'] as const;

  const filteredRoles = roles.filter((role: string) =>
    allowedRoles.includes(role as typeof allowedRoles[number])
  ) as typeof allowedRoles[number][];

  const primaryRole = getPrimaryRole(filteredRoles);

  const pathname = location.pathname;

  const isHomeActive =
    pathname === '/' ||
    DASHBOARD_PREFIXES.some(prefix => pathname.includes(prefix));

  /** Role based navigation config */
  const roleNavConfig: Record<string, { link: string; icon: string; title: string }> = {
    admin: {
      link: '/admin/courses',
      icon: 'fi fi-rr-diploma',
      title: 'Certificates',
    },
    student: {
      link: '/student/id-card',
      // icon: 'fi fi-rr-diploma',
      icon: 'fi fi-rr-id-badge',
      title: 'Certificates',
    },
    tutor: {
      link: '/tutor/courses',
      icon: 'fi fi-rr-book',
      title: 'My Courses',
    },
    parent: {
      link: '/parent/courses',
      icon: 'fi fi-rr-book-open-cover',
      title: 'Children Courses',
    },
  };

  const courseConfig =
    primaryRole && pathname.includes(primaryRole)
      ? roleNavConfig[primaryRole]
      : null;

  return (
    <div className="menubar-area footer-fixed">
      <div className="toolbar-inner menubar-nav justify-content-center">

        {/* Home */}
        <NavLink
          to="/"
          className={`nav-link ${isHomeActive ? 'active' : ''}`}
          title="Home"
        >
          <i className="fi fi-rr-home"></i>
        </NavLink>

        {/* Role-based Courses */}
        {courseConfig && (
          <NavLink
            to={courseConfig.link}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title={courseConfig.title}
          >
            <i className={courseConfig.icon}></i>
          </NavLink>
        )}

        {/* Profile */}
        <NavLink
          to="/me"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          title="Profile"
        >
          <i className="fi fi-rr-user"></i>
        </NavLink>

      </div>
    </div>
  );
};

export default MobileBottomNav;
