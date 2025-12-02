import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Ride, RideRequest, Message } from '@/types';
import { mockUsers, mockRides, mockMessages } from '@/data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  rides: Ride[];
  messages: Message[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  createRide: (ride: Omit<Ride, 'id' | 'driver' | 'acceptedRiders' | 'pendingRequests' | 'createdAt' | 'status'>) => void;
  requestRide: (rideId: string, message: string) => void;
  acceptRequest: (rideId: string, requestId: string) => void;
  declineRequest: (rideId: string, requestId: string) => void;
  sendMessage: (rideId: string, content: string) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [rides, setRides] = useState<Ride[]>(mockRides);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  useEffect(() => {
    const savedUser = localStorage.getItem('skiCarpool_currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    const savedRides = localStorage.getItem('skiCarpool_rides');
    if (savedRides) {
      setRides(JSON.parse(savedRides));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skiCarpool_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('skiCarpool_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('skiCarpool_rides', JSON.stringify(rides));
  }, [rides]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const signup = async (userData: Partial<User>, password: string): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email || '',
      name: userData.name || '',
      school: userData.school || '',
      phone: userData.phone || '',
      bio: userData.bio || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      role: userData.role || 'rider',
      vehicle: userData.vehicle,
      rating: 5.0,
      totalRides: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('skiCarpool_currentUser');
  };

  const createRide = (rideData: Omit<Ride, 'id' | 'driver' | 'acceptedRiders' | 'pendingRequests' | 'createdAt' | 'status'>) => {
    if (!currentUser) return;
    
    const newRide: Ride = {
      ...rideData,
      id: Date.now().toString(),
      driver: currentUser,
      acceptedRiders: [],
      pendingRequests: [],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'open',
    };
    
    setRides(prev => [newRide, ...prev]);
  };

  const requestRide = (rideId: string, message: string) => {
    if (!currentUser) return;
    
    const newRequest: RideRequest = {
      id: Date.now().toString(),
      rideId,
      riderId: currentUser.id,
      rider: currentUser,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setRides(prev => prev.map(ride => {
      if (ride.id === rideId) {
        return {
          ...ride,
          pendingRequests: [...ride.pendingRequests, newRequest],
        };
      }
      return ride;
    }));
  };

  const acceptRequest = (rideId: string, requestId: string) => {
    setRides(prev => prev.map(ride => {
      if (ride.id === rideId) {
        const request = ride.pendingRequests.find(r => r.id === requestId);
        if (!request) return ride;
        
        return {
          ...ride,
          acceptedRiders: [...ride.acceptedRiders, request.rider],
          pendingRequests: ride.pendingRequests.filter(r => r.id !== requestId),
          seatsAvailable: ride.seatsAvailable - 1,
          status: ride.seatsAvailable - 1 === 0 ? 'full' : ride.status,
        };
      }
      return ride;
    }));
  };

  const declineRequest = (rideId: string, requestId: string) => {
    setRides(prev => prev.map(ride => {
      if (ride.id === rideId) {
        return {
          ...ride,
          pendingRequests: ride.pendingRequests.filter(r => r.id !== requestId),
        };
      }
      return ride;
    }));
  };

  const sendMessage = (rideId: string, content: string) => {
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      rideId,
      senderId: currentUser.id,
      sender: currentUser,
      content,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      rides,
      messages,
      isAuthenticated: !!currentUser,
      login,
      signup,
      logout,
      createRide,
      requestRide,
      acceptRequest,
      declineRequest,
      sendMessage,
      updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
