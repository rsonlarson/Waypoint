import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface RideTimerProps {
  startTime: Date;
  isActive: boolean;
  showVisual?: boolean;
}

export function RideTimer({ startTime, isActive, showVisual = false }: RideTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showVisual) {
    // Timer runs invisibly for data collection
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Timer className="h-4 w-4" />
      <span className="font-mono">{formatTime(elapsed)}</span>
    </div>
  );
}

export function useRideTimer() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(false);

  const start = () => {
    setStartTime(new Date());
    setIsActive(true);
    setEndTime(null);
  };

  const stop = () => {
    setEndTime(new Date());
    setIsActive(false);
  };

  const getDuration = () => {
    if (!startTime) return 0;
    const end = endTime || new Date();
    return Math.floor((end.getTime() - startTime.getTime()) / 1000);
  };

  const getDurationMinutes = () => {
    return Math.round(getDuration() / 60);
  };

  return {
    startTime,
    endTime,
    isActive,
    start,
    stop,
    getDuration,
    getDurationMinutes,
  };
}
