import { useState, useEffect } from 'react';
import edoLogo from '@/assets/edo-logo.png';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFading(true), 2200);
    const complete = setTimeout(onComplete, 2700);
    return () => { clearTimeout(timer); clearTimeout(complete); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background edo-transition ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      <img
        src={edoLogo}
        alt="EDO Pack"
        className="w-28 animate-pulse-logo"
      />
    </div>
  );
};

export default SplashScreen;
