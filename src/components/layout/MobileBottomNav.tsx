// v2
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const DASHBOARD_PREFIXES = [
  '/admin',
  '/tutor',
  '/student',
  '/parent',
];

const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const isHomeActive = DASHBOARD_PREFIXES.some(prefix =>
    location.pathname === '/' ||
    location.pathname.startsWith(prefix)
  );

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

        {/* Courses */}
        {/* Courses - show only for roles that have access */}
        {['tutor', 'student', 'parent'].some(role =>
          location.pathname.startsWith(`/${role}`)
          ) && (
          <NavLink
            to="/courses"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title="Courses"
          >
            <i className="fi fi-rr-book"></i>
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
