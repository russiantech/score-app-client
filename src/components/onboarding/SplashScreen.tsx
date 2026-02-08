
import React, { useEffect } from 'react';
import AOS from 'aos';

interface SplashScreenProps {
  onComplete: () => void;
}


const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {


  useEffect(() => {
    /* -------- AOS INIT -------- */
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 50,
    });

    /* -------- SPLASH TIMER -------- */
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="page-wrapper">
      <div
        className="loader-screen"
        style={{ backgroundImage: 'url("/assets/images/background/vector.2.png")' }}
      >
        <img
          src="/assets/images/preloader/circle1.png"
          className="circle-1"
          alt=""
          data-aos="fade-right"
        />
        <img
          src="/assets/images/preloader/circle2.png"
          className="circle-2"
          alt=""
          data-aos="fade-left"
        />

        <div className="main-screen">
          <div className="loader" data-aos="zoom-in">
            <img
              // src="/assets/images/preloader/logo.svg"
              src="/assets/images/preloader/logo.png"
              alt="Score App Logo"
            />
          </div>

          <div
            className="load-text"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <span>S</span>
            <span>c</span>
            <span>o</span>
            <span>r</span>
            <span>e</span>
            <span>.</span>
            <span>App</span>
          </div>
        </div>

        <p
          className="version"
          data-aos="fade-in"
          data-aos-delay="700"
        >
          Version 0.1.0
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;

