import { useState, useEffect, useCallback } from 'react';

type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermissionState>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      setIsSupported(false);
      setPermission('unsupported');
      return;
    }

    setIsSupported(true);
    setPermission(Notification.permission as NotificationPermissionState);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermissionState);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    ({ title, body, icon, tag, data }: PushNotificationOptions) => {
      if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return null;
      }

      try {
        const notification = new Notification(title, {
          body,
          icon: icon || '/icons/waypoint-192.png',
          tag,
          data,
          badge: '/icons/waypoint-192.png',
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        return notification;
      } catch (error) {
        console.error('Error sending notification:', error);
        return null;
      }
    },
    [permission]
  );

  // Notification helper functions for specific events
  const notifyNewRide = useCallback(
    (destination: string, driverName: string) => {
      sendNotification({
        title: '🚗 New Ride Posted!',
        body: `${driverName} is heading to ${destination}`,
        tag: 'new-ride',
      });
    },
    [sendNotification]
  );

  const notifyRideRequest = useCallback(
    (riderName: string, destination: string) => {
      sendNotification({
        title: '🙋 New Ride Request!',
        body: `${riderName} wants to join your ride to ${destination}`,
        tag: 'ride-request',
      });
    },
    [sendNotification]
  );

  const notifyRequestAccepted = useCallback(
    (destination: string) => {
      sendNotification({
        title: '✅ Request Accepted!',
        body: `You're in! Your ride to ${destination} is confirmed`,
        tag: 'request-accepted',
      });
    },
    [sendNotification]
  );

  const notifyNewMessage = useCallback(
    (senderName: string, preview: string) => {
      sendNotification({
        title: `💬 ${senderName}`,
        body: preview.length > 50 ? `${preview.substring(0, 50)}...` : preview,
        tag: 'new-message',
      });
    },
    [sendNotification]
  );

  return {
    permission,
    isSupported,
    isEnabled: permission === 'granted',
    requestPermission,
    sendNotification,
    notifyNewRide,
    notifyRideRequest,
    notifyRequestAccepted,
    notifyNewMessage,
  };
}
