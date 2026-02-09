
// v5 - updated
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  normalizeRoles,
  hasRole,
} from '@/utils/auth/roles';

import type { UserRole } from '@/types/users';
import type { SidebarProps } from '@/types/utils';


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
              className="created_at" 
              src="/assets/images/app-logo/favicon50x50.png" 
              alt="Dunistech Academy" 
            />
            <img 
              className="logo-white d-none" 
              src="/static/images/app-logo/logo-white.png" 
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
          {/* Handled already in landing by the Home Icon in Bottom Navbar. */}
          {/* <li>
            <NavLink
              to={'/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="dz-icon">
                <i className="feather icon-home fs-24 text-primary"></i>
              </span>
              <span>Dashboard</span>
            </NavLink>
          </li> */}

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
                    <i className="feather icon-book-open fs-24 text-green"></i>
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
                  to="/tutor/add-course" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-plus-circle fs-24 text-blue"></i>
                  </span>
                  <span>Add New Course</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/tutor/students" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-users fs-24 text-blue"></i>
                  </span>
                  <span>Enrolled Students</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/tutor/record-scores" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                   <i className="feather icon-edit-3 fs-24 text-blue"></i>
                  </span>
                  <span>Record Scores</span>
                </NavLink>
              </li>
            </>
          )}

          {/* Student Menu Items */}
          {can('student') && (
            <>
              <li>
                <NavLink 
                  to="/student/courses" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-book-open fs-24 text-info"></i>
                  </span>
                  <span>My Courses</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/student/assessments" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-file-text fs-24 text-orange"></i>
                  </span>
                  <span>Assessments</span>
                </NavLink>
              </li>
              <li>
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
              </li>
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#9C27B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#9C27B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>My Children</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/parent/progress" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dz-icon">
                    <i className="feather icon-bar-chart-2 fs-24 text-purple"></i>
                  </span>
                  <span>Progress Tracking</span>
                </NavLink>
              </li>
            </>
          )}

          {/* Common Links */}
          {/* Already accessible from the landing page */}
          {/* <li>
            <NavLink 
              to="/me" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="dz-icon">
                <i className="feather icon-user fs-24 text-success"></i>
              </span>
              <span>Me</span>
            </NavLink>
          </li> */}
          <li> 
            <NavLink 
              to="/us" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="dz-icon">
                <i className="feather icon-info fs-24 text-warning"></i>
              </span>
              <span>Us</span>
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
            <span className="ver-info">Version 2.1</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
