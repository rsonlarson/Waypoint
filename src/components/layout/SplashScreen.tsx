import React, { useEffect, useState } from 'react';
import { Mountain } from 'lucide-react';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-evergreen transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="relative animate-in fade-in zoom-in duration-700">
        <div className="flex items-center justify-center h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-white/20">
          <Mountain className="h-12 w-12 text-white" />
        </div>
        <div className="absolute -inset-4 rounded-full bg-white/5 animate-ping duration-[2000ms]" />
      </div>
      
      <div className="text-center animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Waypoint</h1>
        <p className="text-white/70 text-sm font-medium tracking-wide uppercase">Your crew. Your mountain.</p>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-4">
        <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-progress-indefinite" />
        </div>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">PWA Ready</p>
      </div>
    </div>
  );
}
