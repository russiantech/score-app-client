// Welcome.tsx
// Onboarding / Welcome screen (NO splash responsibility)

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swiper from 'swiper';
import { Pagination, Autoplay, Parallax } from 'swiper/modules';
import AOS from 'aos';

// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'aos/dist/aos.css';

Swiper.use([Pagination, Autoplay, Parallax]);

// const Welcome: React.FC = () => {
const Welcome = ({ onFinish }: { onFinish: () => void }) => {
  const navigate = useNavigate();

  const handleFinish = () => {
    onFinish();
    navigate('/auth/signin', { replace: true });
  };


  const swiperRef = useRef<HTMLDivElement | null>(null);
  const swiperInstance = useRef<Swiper | null>(null);
  // const navigate = useNavigate();

  /* ---------------- AOS INIT ---------------- */
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 50,
    });
  }, []);

  /* ---------------- SWIPER INIT ---------------- */
  useEffect(() => {
    if (swiperRef.current && !swiperInstance.current) {
      swiperInstance.current = new Swiper(swiperRef.current, {
        slidesPerView: 1,
        speed: 800,
        parallax: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }

    return () => {
      swiperInstance.current?.destroy(true, true);
      swiperInstance.current = null;
    };
  }, []);

  /* ---------------- CTA HANDLER ---------------- */

// const handleFinish = () => {
//   localStorage.setItem('hasSeenOnboarding', 'true');
//   // navigate('/auth/signin', { replace: true }); // prevents the user from goiing back
//   navigate('/auth/signin');
// };

  return (

    <div className="page-wrapper">
      <main className="page-content">
        <div className="container p-0">
          <div className="welcome-area">

             {/* Brand Header */}
            <div className="welcome-header" data-aos="fade-down">
              <img
                src="/assets/images/app-logo/favicon50x50.png"
                alt="Score App Logo"
                className="welcome-logo"
              />
              <h2 className="welcome-title">Score App</h2>
            </div>

            {/* Background vectors */}
            <div className="bg-shape">
              <img
                className="vector-1"
                src="/assets/images/welcome/vector1.svg"
                alt=""
                data-aos="fade-right"
              />
              <img
                className="vector-2"
                src="/assets/images/welcome/vector2.svg"
                alt=""
                data-aos="fade-left"
              />
            </div>

            {/* Swiper */}
            <div className="welcome-inner fixed-wrapper">
              <div className="swiper get-started" ref={swiperRef}>
                <div className="swiper-wrapper">

                  {/* Slide 1 */}
                  <div className="swiper-slide">
                    <div className="slide-info">
                      <div className="dz-media" data-aos="zoom-in">
                        <img src="/assets/images/welcome/vector.0.png" alt="" />
                      </div>
                      <div className="slide-content">
                        <h3 className="dz-title" data-swiper-parallax="-300">
                          Track Academic Performance
                        </h3>
                        <p data-swiper-parallax="-100">
                          Monitor grades, assessments, and progress in real time.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 2 */}
                  <div className="swiper-slide">
                    <div className="slide-info">
                      <div className="dz-media" data-aos="zoom-in">
                        <img
                          src="/assets/images/welcome/vector.1.png"
                          className="rounded"
                          alt=""
                        />
                      </div>
                      <div className="slide-content">
                        <h3 className="dz-title" data-swiper-parallax="-300">
                          Personalized Learning Paths
                        </h3>
                        <p data-swiper-parallax="-100">
                          Customized courses for every student.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 3 */}
                  <div className="swiper-slide">
                    <div className="slide-info">
                      <div className="dz-media" data-aos="zoom-in">
                        <img
                          src="/assets/images/welcome/vector.1.2.png"
                          className="rounded"
                          alt=""
                        />
                      </div>
                      <div className="slide-content">
                        <h3 className="dz-title" data-swiper-parallax="-300">
                          Collaborative Education
                        </h3>
                        <p data-swiper-parallax="-100">
                          Students, parents, and tutors connected seamlessly.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="swiper-btn">
                  <div className="swiper-pagination style-1"></div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bottom-btn" data-aos="fade-up">
              <button
                onClick={handleFinish}
                className="btn btn-primary btn-lg w-100 rounded-xl"
              >
                Get Started
              </button>
              
            </div>

          </div>
        </div>
      </main>
    </div>
    
  );
};

export default Welcome;

