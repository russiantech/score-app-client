// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface SplashScreenProps {
//   onComplete: () => void;
//   duration?: number;
// }

// const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, duration = 2000 }) => {
//   const [loading, setLoading] = useState(true);
//   const [showVersion, setShowVersion] = useState(false);
  
//   useEffect(() => {
//     // Show splash screen for specified duration
//     const timer1 = setTimeout(() => {
//       setLoading(false);
//     }, duration - 500);

//     const timer2 = setTimeout(() => {
//       onComplete();
//     }, duration);

//     const versionTimer = setTimeout(() => {
//       setShowVersion(true);
//     }, 1000);

//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//       clearTimeout(versionTimer);
//     };
//   }, [duration, onComplete]);

//   return (
//     <div className="loader-screen" id="splashscreen">
//       {/* Background Image */}
//       <div 
//         className="splash-background" 
//         style={{
//           backgroundImage: "url('/static/images/background/bg1.jpg')",
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           opacity: 0.9
//         }}
//       />

//       {/* Animated Circles */}
//       <img 
//         src="/static/images/preloader/circle1.png" 
//         className="circle-1" 
//         alt="" 
//         style={{
//           position: 'absolute',
//           top: '30%',
//           left: '20%',
//           width: '150px',
//           animation: 'float 3s ease-in-out infinite'
//         }}
//       />
//       <img 
//         src="/static/images/preloader/circle2.png" 
//         className="circle-2" 
//         alt=""
//         style={{
//           position: 'absolute',
//           bottom: '25%',
//           right: '20%',
//           width: '100px',
//           animation: 'float 4s ease-in-out infinite 1s'
//         }}
//       />

//       {/* Main Content */}
//       <div className="main-screen" style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100vh',
//         position: 'relative',
//         zIndex: 2
//       }}>
//         {/* Logo Animation */}
//         <div className="loader" style={{
//           marginBottom: '20px',
//           animation: loading ? 'zoomInDown 1s ease-out' : 'none'
//         }}>
//           <img 
//             src="/static/images/preloader/logo.svg" 
//             alt="Score App Logo"
//             style={{ width: '100px', height: '100px' }}
//           />
//         </div>

//         {/* Loading Text Animation */}
//         <div className="load-text" style={{
//           display: 'flex',
//           gap: '10px',
//           fontSize: '2.5rem',
//           fontWeight: 'bold',
//           color: '#fff',
//           textShadow: '0 2px 10px rgba(0,0,0,0.3)'
//         }}>
//           {['S', 'C', 'O', 'R', 'E'].map((letter, index) => (
//             <span 
//               key={index}
//               style={{
//                 display: 'inline-block',
//                 animation: `bounce 0.5s ease ${index * 0.1}s both`
//               }}
//             >
//               {letter}
//             </span>
//           ))}
//         </div>

//         {/* Version Text */}
//         <p className="version" style={{
//           position: 'absolute',
//           bottom: '30px',
//           color: 'rgba(255,255,255,0.7)',
//           fontSize: '0.9rem',
//           opacity: showVersion ? 1 : 0,
//           transition: 'opacity 0.5s ease',
//           animation: showVersion ? 'bounceIn 0.5s ease 0.5s both' : 'none'
//         }}>
//           Version 2.1
//         </p>
//       </div>

//       {/* Loading Spinner */}
//       <div style={{
//         position: 'absolute',
//         bottom: '80px',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         display: loading ? 'block' : 'none'
//       }}>
//         <div className="spinner-border text-light" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(180deg); }
//         }
        
//         @keyframes zoomInDown {
//           from {
//             opacity: 0;
//             transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
//             animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
//           }
//           60% {
//             opacity: 1;
//             transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
//             animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
//           }
//         }
        
//         @keyframes bounce {
//           from, 20%, 53%, 80%, to {
//             transform: translate3d(0, 0, 0);
//           }
//           40%, 43% {
//             transform: translate3d(0, -30px, 0);
//           }
//           70% {
//             transform: translate3d(0, -15px, 0);
//           }
//           90% {
//             transform: translate3d(0, -4px, 0);
//           }
//         }
        
//         @keyframes bounceIn {
//           from, 20%, 40%, 60%, 80%, to {
//             animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
//           }
//           0% {
//             opacity: 0;
//             transform: scale3d(0.3, 0.3, 0.3);
//           }
//           20% {
//             transform: scale3d(1.1, 1.1, 1.1);
//           }
//           40% {
//             transform: scale3d(0.9, 0.9, 0.9);
//           }
//           60% {
//             opacity: 1;
//             transform: scale3d(1.03, 1.03, 1.03);
//           }
//           80% {
//             transform: scale3d(0.97, 0.97, 0.97);
//           }
//           to {
//             opacity: 1;
//             transform: scale3d(1, 1, 1);
//           }
//         }
        
//         .loader-screen {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           z-index: 9999;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SplashScreen;



// // v2
// import React, { useEffect, useState } from 'react';

// interface SplashScreenProps {
//   onComplete: () => void;
// }

// const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
//   const [isVisible, setIsVisible] = useState(true);
//   const [animationComplete, setAnimationComplete] = useState(false);

//   useEffect(() => {
//     // Initialize WOW.js animations
//     const initWow = () => {
//       if ((window as any).WOW) {
//         const wow = new (window as any).WOW({
//           boxClass: 'wow',
//           animateClass: 'animated',
//           offset: 50,
//           mobile: false
//         });
//         wow.init();
//       }
//     };

//     // Load WOW.js
//     const loadWow = async () => {
//       if (!(window as any).WOW) {
//         const WOW = (await import('wow.js')).default;
//         (window as any).WOW = WOW;
//       }
//       initWow();
//     };

//     loadWow();

//     // Sequence animations exactly like HTML
//     const timer1 = setTimeout(() => {
//       setIsVisible(false);
//     }, 1500);

//     const timer2 = setTimeout(() => {
//       onComplete();
//     }, 2000);

//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//     };
//   }, [onComplete]);

//   if (!isVisible) return null;

//   return (
//     <>
//       <div className="loader-screen" id="splashscreen" style={{
//         backgroundImage: "url('/assets/images/background/bg1.jpg')",
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         zIndex: 9999,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}>
//         {/* Circle 1 */}
//         <img 
//           src="/assets/images/preloader/circle1.png" 
//           className="circle-1 wow bounceIn" 
//           alt=""
//           style={{
//             position: 'absolute',
//             top: '25%',
//             left: '15%',
//             width: '120px',
//             animation: 'float 4s ease-in-out infinite'
//           }}
//         />

//         {/* Circle 2 */}
//         <img 
//           src="/assets/images/preloader/circle2.png" 
//           className="circle-2 wow bounceIn" 
//           alt=""
//           style={{
//             position: 'absolute',
//             bottom: '20%',
//             right: '15%',
//             width: '80px',
//             animation: 'float 3s ease-in-out infinite 0.5s'
//           }}
//         />

//         {/* Main Screen Content */}
//         <div className="main-screen" style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           textAlign: 'center',
//           position: 'relative',
//           zIndex: 2
//         }}>
//           {/* Logo */}
//           <div className="loader wow zoomInDown" style={{
//             marginBottom: '30px'
//           }}>
//             <img 
//               src="/assets/images/preloader/logo.svg" 
//               alt="Score App Logo"
//               style={{ 
//                 width: '100px', 
//                 height: '100px',
//                 filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
//               }}
//             />
//           </div>

//           {/* Animated Text */}
//           <div className="load-text" style={{
//             display: 'flex',
//             gap: '12px',
//             fontSize: '2.8rem',
//             fontWeight: '700',
//             color: '#fff',
//             textShadow: '0 4px 12px rgba(0,0,0,0.4)',
//             letterSpacing: '2px'
//           }}>
//             {['S', 'C', 'O', 'R', 'E'].map((letter, index) => (
//               <span 
//                 key={index}
//                 className="wow bounceIn"
//                 style={{
//                   display: 'inline-block',
//                   animationDelay: `${index * 0.1}s`,
//                   animationFillMode: 'both'
//                 }}
//               >
//                 {letter}
//               </span>
//             ))}
//           </div>

//           {/* Version Text */}
//           <p 
//             className="version wow bounceIn" 
//             style={{
//               position: 'absolute',
//               bottom: '40px',
//               color: 'rgba(255,255,255,0.8)',
//               fontSize: '0.9rem',
//               fontFamily: 'Raleway, sans-serif',
//               letterSpacing: '1px',
//               animationDelay: '1s'
//             }}
//           >
//             Version 2.1
//           </p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes float {
//           0%, 100% { 
//             transform: translateY(0) rotate(0deg); 
//           }
//           50% { 
//             transform: translateY(-25px) rotate(180deg); 
//           }
//         }

//         @keyframes zoomInDown {
//           from {
//             opacity: 0;
//             transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
//             animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
//           }
//           60% {
//             opacity: 1;
//             transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
//             animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
//           }
//         }

//         @keyframes bounceIn {
//           from, 20%, 40%, 60%, 80%, to {
//             animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
//           }
//           0% {
//             opacity: 0;
//             transform: scale3d(0.3, 0.3, 0.3);
//           }
//           20% {
//             transform: scale3d(1.1, 1.1, 1.1);
//           }
//           40% {
//             transform: scale3d(0.9, 0.9, 0.9);
//           }
//           60% {
//             opacity: 1;
//             transform: scale3d(1.03, 1.03, 1.03);
//           }
//           80% {
//             transform: scale3d(0.97, 0.97, 0.97);
//           }
//           to {
//             opacity: 1;
//             transform: scale3d(1, 1, 1);
//           }
//         }

//         .loader-screen {
//           animation: fadeOut 0.5s ease 1.5s forwards;
//         }

//         @keyframes fadeOut {
//           to {
//             opacity: 0;
//             visibility: hidden;
//           }
//         }

//         .wow {
//           visibility: hidden;
//         }
//       `}</style>
//     </>
//   );
// };

// export default SplashScreen;



// v3

// import React, { useEffect } from 'react';

// interface SplashScreenProps {
//   onComplete: () => void;
// }

// const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
//   useEffect(() => {
//     // Load WOW.js for animations
//     const loadWow = async () => {
//       if (!(window as any).WOW) {
//         const WOW = (await import('wow.js')).default;
//         (window as any).WOW = WOW;
        
//         new WOW({
//           boxClass: 'wow',
//           animateClass: 'animated',
//           offset: 50,
//           mobile: false
//         }).init();
//       }
//     };

//     loadWow();

//     // Hide splash after 2 seconds (exactly like the HTML timing)
//     const timer = setTimeout(() => {
//       onComplete();
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [onComplete]);

//   return (
//     <div className="page-wrapper">
//       {/* splash */}        
//       <div className="loader-screen" id="splashscreen" style={{backgroundImage: 'url("/assets/images/background/bg1.jpg")'}}>
//         <img src="/assets/images/preloader/circle1.png" className="circle-1" alt="" />
//         <img src="/assets/images/preloader/circle2.png" className="circle-2" alt="" />
//         <div className="main-screen">
//           <div className="loader">
//             <img src="/assets/images/preloader/logo.svg" className="wow zoomInDown" alt="" />
//           </div>
//           <div className="load-text">
//             <span>S</span>
//             <span>c</span>
//             <span>o</span>
//             <span>r</span>
//             <span>e</span>
//             <span>.</span>
//             <span>App</span>
//           </div>
//         </div>
//         <p className="version wow bounceIn" data-wow-duration="0.5s" data-wow-delay="1s">
//           Version 2.1
//         </p>                                        
//       </div>
//     </div>
//   );
// };

// export default SplashScreen;


// v4 - aos version

import React, { useEffect } from 'react';
import AOS from 'aos';
import { useNavigate } from 'react-router-dom';

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

