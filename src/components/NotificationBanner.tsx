import { Bell, BellOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useState, useEffect } from 'react';

interface NotificationBannerProps {
  variant?: 'banner' | 'button';
  className?: string;
}

export function NotificationBanner({ variant = 'banner', className = '' }: NotificationBannerProps) {
  const { permission, isSupported, requestPermission } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the banner
    const wasDismissed = localStorage.getItem('waypoint_notification_banner_dismissed');
    if (wasDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    const granted = await requestPermission();
    setIsRequesting(false);
    
    if (granted) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('waypoint_notification_banner_dismissed', 'true');
  };

  // Don't show if not supported, already granted, or dismissed
  if (!isSupported || permission === 'granted' || (permission === 'denied' && variant === 'banner')) {
    if (variant === 'button') {
      return (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className={`gap-2 ${className}`}
        >
          {permission === 'granted' ? (
            <>
              <Bell className="h-4 w-4 text-secondary" />
              <span className="hidden sm:inline">Notifications On</span>
            </>
          ) : permission === 'denied' ? (
            <>
              <BellOff className="h-4 w-4 text-muted-foreground" />
              <span className="hidden sm:inline">Blocked</span>
            </>
          ) : null}
        </Button>
      );
    }
    return null;
  }

  if (dismissed && variant === 'banner') {
    return null;
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleEnableNotifications}
        disabled={isRequesting}
        className={`gap-2 border-primary/30 hover:bg-primary/10 ${className}`}
      >
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isRequesting ? 'Enabling...' : 'Enable Notifications'}
        </span>
      </Button>
    );
  }

  return (
    <div className={`bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Bell className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Stay in the loop</p>
          <p className="text-xs text-muted-foreground">Get notified about ride requests and messages</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={handleEnableNotifications}
          disabled={isRequesting}
          className="text-xs"
        >
          {isRequesting ? 'Enabling...' : 'Enable'}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
