import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, Parallax } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
// import 'swiper/css/autoplay';
// import 'swiper/css/parallax';

// Import Swiper styles
// import 'swiper/css';

import '@styles/components/Onboarding.css';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const slides = [
    {
      id: 1,
      image: '/static/images/svg/illustration.svg',
      title: 'Track Academic Performance',
      description: 'Monitor student progress, grades, and achievements in real-time with our comprehensive tracking system.',
      color: '#4CAF50'
    },
    {
      id: 2,
      image: '/static/images/svg/coffee-mug.svg',
      title: 'Personalized Learning Paths',
      description: 'Tailor educational experiences to individual student needs with customized courses and assessments.',
      color: '#2196F3'
    },
    {
      id: 3,
      image: '/static/images/svg/coffee-cup.svg',
      title: 'Collaborative Education',
      description: 'Connect students, parents, and tutors for a seamless educational experience with instant feedback.',
      color: '#9C27B0'
    }
  ];

  const handleGetStarted = () => {
    // Navigate to auth page or main dashboard
    navigate('/auth/signin');
  };

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <div className="page-wrapper">
      {/* Welcome Area */}
      <main className="page-content">
        <div className="container p-0">
          <div className="welcome-area">
            {/* Background Shapes */}
            <div className="bg-shape">
              <img 
                className="vector-1" 
                src="/static/images/welcome/vector1.svg" 
                alt="" 
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '5%',
                  width: '200px',
                  opacity: 0.7
                }}
              />
              <img 
                className="vector-2" 
                src="/static/images/welcome/vector2.svg" 
                alt=""
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '5%',
                  width: '150px',
                  opacity: 0.7
                }}
              />
            </div>

            {/* Welcome Inner Content */}
            <div className="welcome-inner fixed-wrapper">
              {/* Swiper Slider */}
              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Parallax]}
                spaceBetween={0}
                slidesPerView={1}
                speed={800}
                parallax={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  renderBullet: (index, className) => {
                    return `<span class="${className}" style="background-color: ${slides[index].color}"></span>`;
                  },
                }}
                onSlideChange={handleSlideChange}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '20px 0 60px'
                }}
              >
                {slides.map((slide, _index) => (
                  <SwiperSlide key={slide.id}>
                    <div className="slide-info" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      padding: '20px'
                    }}>
                      {/* Slide Media */}
                      <div className="dz-media" style={{
                        marginBottom: '40px',
                        position: 'relative',
                        width: '250px',
                        height: '250px'
                      }}>
                        <img 
                          src={slide.image} 
                          alt={slide.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.1))`
                          }}
                        />
                        <div 
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '120%',
                            height: '120%',
                            background: `radial-gradient(circle, ${slide.color}20 0%, transparent 70%)`,
                            borderRadius: '50%',
                            zIndex: -1
                          }}
                        />
                      </div>

                      {/* Slide Content */}
                      <div className="slide-content" style={{
                        textAlign: 'center',
                        maxWidth: '500px',
                        margin: '0 auto'
                      }}>
                        <h3 
                          className="dz-title" 
                          data-swiper-parallax="-300"
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            color: '#333',
                            marginBottom: '15px',
                            lineHeight: '1.3'
                          }}
                        >
                          {slide.title}
                        </h3>
                        <p 
                          data-swiper-parallax="-100"
                          style={{
                            fontSize: '1rem',
                            color: '#666',
                            lineHeight: '1.6',
                            marginBottom: '0'
                          }}
                        >
                          {slide.description}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Bottom Button */}
            <div className="bottom-btn" style={{
              position: 'fixed',
              bottom: '30px',
              left: '20px',
              right: '20px',
              zIndex: 100
            }}>
              <button 
                onClick={handleGetStarted}
                className="btn btn-thin rounded-xl text-uppercase btn-lg w-100 btn-primary"
                style={{
                  background: `linear-gradient(135deg, ${slides[activeIndex].color} 0%, ${slides[activeIndex].color}80 100%)`,
                  border: 'none',
                  padding: '15px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  boxShadow: `0 5px 20px ${slides[activeIndex].color}40`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${slides[activeIndex].color}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 5px 20px ${slides[activeIndex].color}40`;
                }}
              >
                Get Started
              </button>
              
              {/* Skip for now (optional) */}
              <button 
                onClick={handleGetStarted}
                className="btn btn-link w-100 mt-2"
                style={{
                  color: '#666',
                  fontSize: '0.9rem'
                }}
              >
                Already have an account? Sign In
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Dot Indicators */}
      <div style={{
        position: 'fixed',
        bottom: '120px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        zIndex: 99
      }}>
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => swiperRef.current?.slideTo(index)}
            style={{
              width: activeIndex === index ? '30px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: activeIndex === index ? slides[index].color : '#ddd',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

    </div>
  );
};

export default Onboarding;

