// import React, { useState, useEffect } from 'react';
// import SplashScreen from '../../components/onboarding/SplashScreen';
// import Onboarding from './Onboarding';
// // import Onboarding from './Onboarding';

import { useState } from "react";
import SplashScreen from "../../components/onboarding/SplashScreen";
import Welcome from "./Welcome";

// const OnboardingFlow: React.FC = () => {
//   const [showSplash, setShowSplash] = useState(true);
//   const [showOnboarding, setShowOnboarding] = useState(false);
//   const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

//   // Check localStorage to see if user has already seen onboarding
//   useEffect(() => {
//     const seen = localStorage.getItem('hasSeenOnboarding');
//     if (seen === 'true') {
//       setHasSeenOnboarding(true);
//       setShowSplash(false);
//       setShowOnboarding(false);
//     } else {
//       setShowSplash(true);
//     }
//   }, []);

//   const handleSplashComplete = () => {
//     setShowSplash(false);
//     setShowOnboarding(true);
//   };

//   const handleOnboardingComplete = () => {
//     setShowOnboarding(false);
//     setHasSeenOnboarding(true);
//     localStorage.setItem('hasSeenOnboarding', 'true');
//     // Navigation will be handled by the Onboarding component
//   };

//   // If user has already seen onboarding, don't show anything
//   if (hasSeenOnboarding) {
//     return null; // Or redirect to login
//   }

//   return (
//     <>
//       {showSplash && (
//         <SplashScreen 
//           onComplete={handleSplashComplete}
//           duration={3000} // 3 seconds
//         />
//       )}
      
//       {showOnboarding && (
//         <Onboarding />
//       )}
//     </>
//   );
// };

// export default OnboardingFlow;




// // v2

// import React, { useState, useEffect } from 'react';
// import SplashScreen from '../../components/onboarding/SplashScreen';
// import Welcome from './Welcome';
// // import SplashScreen from '../components/onboarding/SplashScreen';
// // import Welcome from './Welcome';

// const OnboardingFlow: React.FC = () => {
//   const [showSplash, setShowSplash] = useState(true);
//   const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
//     return localStorage.getItem('hasSeenOnboarding') === 'true';
//   });

//   const handleSplashComplete = () => {
//     setShowSplash(false);
//   };

//   const handleOnboardingComplete = () => {
//     setHasSeenOnboarding(true);
//     localStorage.setItem('hasSeenOnboarding', 'true');
//   };

//   // If user has already seen onboarding, don't show anything (redirect handled by App.tsx)
//   if (hasSeenOnboarding) {
//     return null;
//   }

//   return (
//     <>
//       {showSplash && (
//         <SplashScreen onComplete={handleSplashComplete} />
//       )}
      
//       {!showSplash && (
//         <Welcome />
//       )}
//     </>
//   );
// };

// export default OnboardingFlow;




// v3
// import React, { useState } from 'react';
// // import SplashScreen from '../components/onboarding/SplashScreen';
// import Welcome from './Welcome';
// import SplashScreen from '../../components/onboarding/SplashScreen';

// const OnboardingFlow: React.FC = () => {
//   const [showSplash, setShowSplash] = useState(true);

//   const handleSplashComplete = () => {
//     setShowSplash(false);
//   };

//   return showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : <Welcome />;
// };

// export default OnboardingFlow;



// // v2
// const OnboardingFlow = () => {
//   const [showSplash, setShowSplash] = useState(true);

//   if (showSplash) {
//     return <SplashScreen onComplete={() => setShowSplash(false)} />;
//   }

//   return <Welcome />;
// };

// export default OnboardingFlow;

// 3
const OnboardingFlow = ({ onFinish }: { onFinish: () => void }) => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return <Welcome onFinish={onFinish} />;
};

export default OnboardingFlow;
