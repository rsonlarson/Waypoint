import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PickupWindowBannerProps {
  rideId: string;
  destination: string;
  pickupLocation: string;
  departureTime: string;
  isDriver: boolean;
  ridersCount: number;
  onDismiss?: () => void;
}

export function PickupWindowBanner({
  rideId,
  destination,
  pickupLocation,
  departureTime,
  isDriver,
  ridersCount,
  onDismiss,
}: PickupWindowBannerProps) {
  const [timeRemaining, setTimeRemaining] = useState(16 * 60); // 16 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((16 * 60 - timeRemaining) / (16 * 60)) * 100;

  return (
    <Card className="shadow-card border-accent/50 bg-accent/5 animate-pulse-subtle">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              <span className="font-semibold text-foreground">Pickup Window Active</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {pickupLocation}
              </span>
              <span>→</span>
              <span className="font-medium text-foreground">{destination}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isDriver ? (
                <>
                  <Users className="h-4 w-4 inline mr-1" />
                  {ridersCount} rider{ridersCount !== 1 ? 's' : ''} waiting to be confirmed
                </>
              ) : (
                <>Head to the pickup location now!</>
              )}
            </p>
          </div>

          <div className="text-right space-y-2">
            <div className="text-2xl font-bold font-mono text-accent">
              {formatTimeRemaining(timeRemaining)}
            </div>
            <Link to={`/rides/${rideId}`}>
              <Button size="sm" variant="gradient" className="gap-1">
                {isDriver ? 'Confirm Riders' : 'View Details'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
