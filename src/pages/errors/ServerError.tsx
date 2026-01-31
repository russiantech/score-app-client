import React from 'react';
import { Link } from 'react-router-dom';

const ServerError: React.FC = () => {
  return (
    <div className="page-wrapper">
      <header className="header header-fixed border-bottom onepage">
        <div className="header-content">
          <div className="left-content">
            <Link to="/" className="back-btn">
              <i className="feather icon-arrow-left" />
            </Link>
          </div>
          <div className="mid-content">
            <h4 className="title">Server Error</h4>
          </div>
        </div>
      </header>

      <main className="page-content space-top">
        <div className="container fixed-full-area">
          <div className="error-page">
            <div className="icon-bx">
              <img src="assets/images/error2.svg" alt="" />
            </div>
            <div className="clearfix">
              <h2 className="title text-danger">500</h2>
              <p>Something went wrong on our server.</p>
              <p className="text-muted">Please try again later.</p>
            </div>
            <div className="mt-4">
              <Link to="/" className="btn btn-primary me-3">
                Go to Home
              </Link>
              <button 
                className="btn btn-outline-primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServerError;

