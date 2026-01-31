
// Layout.tsx - Complete working implementation
import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Preloader from '../shared/Preloader';
import MobileBottomNav from './MobileBottomNav';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { auth } = useAuth();
  // 🔥 Auto-open sidebar after successful login
  useEffect(() => {
    if (auth?.user) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
    
  }, [auth]);
  
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle menu click - open sidebar
  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  // Handle close - close sidebar
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="page-wrapper">
      {/* Preloader */}
      {loading && <Preloader />}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* Main Content Wrapper */}
      <div className="dz-nav-floting">
        {/* Navbar */}
        <Navbar onMenuClick={handleMenuClick} />

        {/* Page Content */}
        <main className="page-content bg-white p-b60">
          <div className="container">
            {children || <Outlet />}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>

      {/* PWA Install Modal */}
      <div className="modal fade dz-pwa-modal" id="pwaModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <Link to="/" className="btn-close" data-bs-dismiss="modal" 
              aria-label="Close">
              <i className="feather icon-x"></i>
            </Link>
            <img 
              className="logo dark" 
              src="/static/images/app-logo/logo.x.png" 
              alt="Dunistech Academy" 
            />
            <h5 className="title">Score App - Dunistech Academy</h5>
            <p className="pwa-text">
              Install "Score App" to your home screen for easy access to academic performance tracking
            </p>
            <button type="button" className="btn pwa-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16.0001V13.0001M12 13.0001V10.0001M12 13.0001H9M12 13.0001H15M4 16.8002V11.4522C4 10.9179 4 10.6506 4.06497 10.4019C4.12255 10.1816 4.2173 9.97307 4.34521 9.78464C4.48955 9.57201 4.69064 9.39569 5.09277 9.04383L9.89436 4.84244C10.6398 4.19014 11.0126 3.86397 11.4324 3.73982C11.8026 3.63035 12.1972 3.63035 12.5674 3.73982C12.9875 3.86406 13.3608 4.19054 14.1074 4.84383L18.9074 9.04383C19.3096 9.39569 19.5102 9.57201 19.6546 9.78464C19.7825 9.97307 19.8775 10.1816 19.9351 10.4019C20 10.6505 20 10.9184 20 11.4522V16.8037C20 17.9216 20 18.4811 19.7822 18.9086C19.5905 19.2849 19.2842 19.5906 18.9079 19.7823C18.4805 20.0001 17.9215 20.0001 16.8036 20.0001H7.19691C6.07899 20.0001 5.5192 20.0001 5.0918 19.7823C4.71547 19.5906 4.40973 19.2849 4.21799 18.9086C4 18.4807 4 17.9203 4 16.8002Z" stroke="#03764D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Add to Home Screen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;


// // v2
// // Layout.tsx - auto sidebar open on login but with localStorage persistence, but sidebar is breaking
// import React, { useEffect, useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Navbar from './Navbar';
// import Preloader from '../shared/Preloader';
// import MobileBottomNav from './MobileBottomNav';
// import { useAuth } from '@/hooks/useAuth';

// const SIDEBAR_KEY = 'sidebar:open';

// const Layout: React.FC = () => {
//   const { auth } = useAuth();

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [loading, setLoading] = useState(true);

//   /* 1️⃣ Restore sidebar state on EVERY refresh */
//   useEffect(() => {
//     const saved = localStorage.getItem(SIDEBAR_KEY);
//     setSidebarOpen(saved === 'true');
//   }, []);

//   /* 2️⃣ Auth-based safety */
//   useEffect(() => {
//     if (loading) return;

//     if (!auth?.user) {
//       localStorage.removeItem(SIDEBAR_KEY);
//       setSidebarOpen(false);
//     }
//   }, [auth?.user, loading]);

//   /* 3️⃣ Preloader */
//   useEffect(() => {
//     const t = setTimeout(() => setLoading(false), 500);
//     return () => clearTimeout(t);
//   }, []);

//   const openSidebar = () => {
//     localStorage.setItem(SIDEBAR_KEY, 'true');
//     setSidebarOpen(true);
//   };

//   const closeSidebar = () => {
//     localStorage.setItem(SIDEBAR_KEY, 'false');
//     setSidebarOpen(false);
//   };

//   return (
//     <div className="page-wrapper">
//       {loading && <Preloader />}

//       {!loading && (
//         <>
//           <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

//           {/* ⚠️ CLASS IS CONTROLLED BY Sidebar EFFECT */}
//           <div className="dz-nav-floting">
//             <Navbar onMenuClick={openSidebar} />

//             <main className="page-content bg-white p-b60">
//               <div className="container">
//                 <Outlet />
//               </div>
//             </main>

//             <MobileBottomNav />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Layout;
