
import { useState } from "react";
import SplashScreen from "@/components/onboarding/SplashScreen";
import Welcome from "./Welcome";

const OnboardingFlow = ({ onFinish }: { onFinish: () => void }) => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return <Welcome onFinish={onFinish} />;
};

export default OnboardingFlow;
