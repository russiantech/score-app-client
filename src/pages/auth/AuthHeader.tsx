import React from 'react';

const AuthHeader: React.FC = () => {
  return (
    <div className="auth-header text-align-center">
    <div className="d-flex">
      <img
        src="/assets/images/preloader/logo.png"
        alt="Score App Logo"
        className="auth-logo"
      />
      <h1 className="auth-title">Score app</h1>
      </div>
      <p className="auth-subtitle">Smart academic tracking</p>
    </div>
  );
};

export default AuthHeader;

