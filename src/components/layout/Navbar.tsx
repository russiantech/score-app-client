import React, { useState } from 'react';
import NotificationCenter from '@/components/shared/NotificationCenter';
import { useAuth } from '@/hooks/useAuth';
import { getPrimaryRole } from '@/utils/auth/roles';
import '@/styles/components/Navbar.css';

interface NavbarProps {
  onMenuClick: () => void;
}


const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  // const { role } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [, setNotificationCount] = useState(3);

   const { auth } = useAuth();
  const roles = auth?.user?.roles ?? [];

  const allowedRoles = ['dev', 'admin', 'tutor', 'super_admin', 'parent', 'student'] as const;
  const filteredRoles = roles.filter((role: string) =>
    allowedRoles.includes(role as typeof allowedRoles[number])
  ) as typeof allowedRoles[number][];
  const primaryRole = getPrimaryRole(filteredRoles);

  const getRoleBadge = () => {
    switch (primaryRole) {
      case 'dev': return { text: 'Developer', class: 'bg-info' };
      case 'admin': return { text: 'Admin', class: 'bg-danger' };
      case 'tutor': return { text: 'Tutor', class: 'bg-primary' };
      case 'parent': return { text: 'Parent', class: 'bg-success' };
      case 'student': return { text: 'Student', class: 'bg-warning' };
      default: return { text: 'User', class: 'bg-secondary' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <>
      <header className="header py-2 mx-auto">
        <div className="header-content">
          <div className="left-content">
            <div className="info">
              <p className="text m-b10">Welcome to</p>
              <h3 className="title">Score App </h3>
              <span className={`badge user-role-badge ${roleBadge.class}`}>
              {roleBadge.text}
            </span>
            </div>
          </div>
          
          <div className="right-content d-flex align-items-center gap-4">

          <button
            type="button"
            disabled
            className={`notification-badge font-20 border-0 bg-transparent pe-none badge-active`}
            aria-disabled="true"
          >
            <i className="fi fi-rr-bell fs-30 " />
          </button>

            <button
            className="icon dz-floating-toggler border-0 bg-transparent"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            
            {/* <button className="icon dz-floating-toggler border-0 bg-transparent"> */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect y="2" width="20" height="3" rx="1.5" fill="#5F5F5F"/>
                <rect y="18" width="20" height="3" rx="1.5" fill="#5F5F5F"/>
                <rect x="4" y="10" width="20" height="3" rx="1.5" fill="#5F5F5F"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {showNotifications && (
        <NotificationCenter 
          onClose={() => setShowNotifications(false)}
          onClear={() => setNotificationCount(0)}
        />
      )}
    </>
  );
};

export default Navbar;

