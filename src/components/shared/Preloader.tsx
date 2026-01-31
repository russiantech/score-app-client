import React from 'react';
// import './Preloader.css';
import '@/styles/components/Preloader.css';

const Preloader: React.FC = () => {
  return (
    <div id="preloader">
      <div className="loader">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;