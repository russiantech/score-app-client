import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="page-wrapper">
      {/* Preloader */}
      <div id="preloader" style={{ display: 'none' }}>
        <div className="loader">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      {/* Preloader end*/}

      {/* Header */}
      <header className="header header-fixed border-bottom onepage">
        <div className="header-content">
          <div className="left-content">
            <Link to="/" className="back-btn">
              <i className="feather icon-arrow-left" />
            </Link>
          </div>
          <div className="mid-content">
            <h4 className="title">Error</h4>
          </div>
          <div className="right-content"></div>
        </div>
      </header>
      {/* Header */}

      {/* Page Content Start */}
      <main className="page-content space-top">
        <div className="container fixed-full-area">
          <div className="error-page">
            <div className="icon-bx">
              <img src="assets/images/error2.svg" alt="" />
            </div>
            <div className="clearfix">
              <h2 className="title text-primary">Sorry</h2>
              <p>Requested content not found.</p>
            </div>
            <div className="mt-4">
              <Link to="/" className="btn btn-primary btn-lg">
                Go to Home
              </Link>
            </div>
          </div>
          <div className="error-img">
            <img src="assets/images/error.png" alt="" />
          </div>
        </div>
      </main>
      {/* Page Content End */}
    </div>
  );
};

export default NotFound;
