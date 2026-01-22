import React, { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface NotificationContextType {
  permission: 'default' | 'granted' | 'denied' | 'unsupported';
  isSupported: boolean;
  isEnabled: boolean;
  requestPermission: () => Promise<boolean>;
  notifyNewRide: (destination: string, driverName: string) => void;
  notifyRideRequest: (riderName: string, destination: string) => void;
  notifyRequestAccepted: (destination: string) => void;
  notifyRequestDeclined: (destination: string) => void;
  notifyNewMessage: (senderName: string, preview: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const {
    permission,
    isSupported,
    isEnabled,
    requestPermission,
    sendNotification,
  } = usePushNotifications();

  const notifyNewRide = useCallback(
    (destination: string, driverName: string) => {
      if (!isEnabled) return;
      sendNotification({
        title: '🚗 New Ride Posted!',
        body: `${driverName} is heading to ${destination}`,
        tag: 'new-ride',
      });
    },
    [isEnabled, sendNotification]
  );

  const notifyRideRequest = useCallback(
    (riderName: string, destination: string) => {
      if (!isEnabled) return;
      sendNotification({
        title: '🙋 New Ride Request!',
        body: `${riderName} wants to join your ride to ${destination}`,
        tag: 'ride-request',
      });
    },
    [isEnabled, sendNotification]
  );

  const notifyRequestAccepted = useCallback(
    (destination: string) => {
      if (!isEnabled) return;
      sendNotification({
        title: '✅ Request Accepted!',
        body: `You're in! Your ride to ${destination} is confirmed`,
        tag: 'request-accepted',
      });
    },
    [isEnabled, sendNotification]
  );

  const notifyRequestDeclined = useCallback(
    (destination: string) => {
      if (!isEnabled) return;
      sendNotification({
        title: '❌ Request Declined',
        body: `Your request to join the ride to ${destination} was declined`,
        tag: 'request-declined',
      });
    },
    [isEnabled, sendNotification]
  );

  const notifyNewMessage = useCallback(
    (senderName: string, preview: string) => {
      if (!isEnabled) return;
      // Don't notify if the page is focused
      if (document.hasFocus()) return;
      
      sendNotification({
        title: `💬 ${senderName}`,
        body: preview.length > 50 ? `${preview.substring(0, 50)}...` : preview,
        tag: 'new-message',
      });
    },
    [isEnabled, sendNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        permission,
        isSupported,
        isEnabled,
        requestPermission,
        notifyNewRide,
        notifyRideRequest,
        notifyRequestAccepted,
        notifyRequestDeclined,
        notifyNewMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
