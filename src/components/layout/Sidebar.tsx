
// v5 - updated
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  normalizeRoles,
  hasRole,
} from '@/utils/auth/roles';
import type { UserRole } from '@/types/users';

// import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { auth, signout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }, []);

  const roles = normalizeRoles(auth?.user?.roles);
  const can = (role: UserRole) => hasRole(roles, role);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', String(next));
    document.documentElement.classList.toggle('dark-mode', next);
  };

  const handleLogout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar dz-floting-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <NavLink
              to={'/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
          <div className="app-logo">
            <img 
              className="logo-dark" 
              src="/assets/images/app-logo/dunis_academ.png" 
              alt="Dunistech Academy" 
            />
            <img 
              className="logo-white d-none" 
              src="/static/images/app-logo/dunis_academ.png" 
              alt="Dunistech Academy" 
            />
          </div>
          </NavLink>

          <div className="title-bar mb-0">
            <h4 className="title font-w600">Main Navigation</h4>
            <a href="javascript:void(0);" className="floating-close" onClick={onClose}>
              <i className="feather icon-x"></i>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <ul className="nav navbar-nav">
          {/* Dashboard */}

          {/* Admin Menu Items */}
          {can('admin') && (
            <>
              <li>
                <NavLink 
                  to="/admin/courses" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-book-open fs-24 text-green"></i>
                  </span>
                  <span>Manage Courses</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/admin/users" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-users fs-24 text-green"></i>
                  </span>
                  <span>Manage Users</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/admin/enrollments" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-users fs-24 text-green"></i>
                  </span>
                  <span>Enrollments</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/assign-tutors" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                   <i className="feather icon-user-plus fs-24 text-green"></i>
                  </span>
                  <span>Assign Tutors</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/parent-child" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-link fs-24 text-green"></i>
                  </span>
                  <span>Parent-Child Links</span>
                </NavLink>
              </li>
            </>
          )}

          {/* Tutor Menu Items */}
          {can('tutor') && (
            <>
              <li>
                <NavLink 
                  to="/tutor/courses" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-book-open fs-24 text-blue"></i>
                  </span>
                  <span>My Courses</span>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/tutor/courses" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-users fs-24 text-blue"></i>
                  </span>
                  <span>My Students</span>
                </NavLink>
              </li>
            </>
          )}

          {/* Student Menu Items */}
          {can('student') && (
            <>
              {/* <li>
                <NavLink 
                  to="/student/performance" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                   <i className="feather icon-bar-chart-2 fs-24 text-orange"></i>
                  </span>
                  <span>Performance</span>
                </NavLink>
              </li> */}
            </>
          )}

          {/* Parent Menu Items */}
          {can('parent') && (
            <>
              <li>
                <NavLink 
                  to="/parent/children" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-users fs-24 text-blue"></i>
                  </span>
                  <span>My Children</span>
                </NavLink>
              </li>
            </>
          )}

          {/* Common Links */}
          <li> 
            <NavLink 
              to="/us" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="dz-icon">
                <i className="feather icon-info fs-24 text-warning"></i>
              </span>
              <span>About Us</span>
            </NavLink>
          </li>

          <li>
            <button className="nav-link d-flex" onClick={handleLogout}
            >
              <span className="dz-icon">
                <i className="feather icon-maximize-2 fs-24 text-danger"></i>
              </span>
              <span>Logout</span>
            </button>
          </li>
        </ul>

        {/* Footer */}
        <div className="sidebar-bottom">
          <div className="dz-mode">
            <div className="theme-btn" onClick={toggleDarkMode}>
              <i className={`feather icon-${darkMode ? 'moon' : 'sun'} ${darkMode ? 'moon' : 'sun'}`}></i>
            </div>
          </div>
          <div className="app-info">
            <h6 className="name">Score - Innovations</h6>
            <span className="ver-info">Version 0.1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
