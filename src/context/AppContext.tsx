import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, Ride, RideRequest, Message } from '@/types';
import { mockUsers, mockRides, mockMessages } from '@/data/mockData';

interface AppContextType {
  currentUser: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  users: User[];
  rides: Ride[];
  messages: Message[];
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  createRide: (ride: Omit<Ride, 'id' | 'driver' | 'acceptedRiders' | 'pendingRequests' | 'createdAt' | 'status'>) => void;
  requestRide: (rideId: string, message: string) => void;
  acceptRequest: (rideId: string, requestId: string) => void;
  declineRequest: (rideId: string, requestId: string) => void;
  sendMessage: (rideId: string, content: string) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [rides, setRides] = useState<Ride[]>(mockRides);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch profile data after auth state changes
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load saved rides from localStorage
  useEffect(() => {
    const savedRides = localStorage.getItem('skiCarpool_rides');
    if (savedRides) {
      setRides(JSON.parse(savedRides));
    }
  }, []);

  // Save rides to localStorage
  useEffect(() => {
    localStorage.setItem('skiCarpool_rides', JSON.stringify(rides));
  }, [rides]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
        return;
      }

      if (profile) {
        const user: User = {
          id: profile.user_id,
          email: profile.email,
          name: profile.name,
          school: profile.school,
          phone: profile.phone || '',
          bio: profile.bio || '',
          avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
          role: profile.role as 'driver' | 'rider' | 'both',
          vehicle: profile.vehicle_make ? {
            make: profile.vehicle_make,
            model: profile.vehicle_model || '',
            color: profile.vehicle_color || '',
            passengerCapacity: profile.passenger_capacity || 4,
            gearCapacity: profile.gear_capacity || 4,
          } : undefined,
          rating: Number(profile.rating) || 5.0,
          totalRides: profile.total_rides || 0,
          createdAt: profile.created_at,
        };
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSupabaseUser(null);
    setSession(null);
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

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser || !supabaseUser) return;
    
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    
    // Update in Supabase
    await supabase
      .from('profiles')
      .update({
        name: updates.name,
        phone: updates.phone,
        bio: updates.bio,
        avatar: updates.avatar,
        role: updates.role,
        vehicle_make: updates.vehicle?.make,
        vehicle_model: updates.vehicle?.model,
        vehicle_color: updates.vehicle?.color,
        passenger_capacity: updates.vehicle?.passengerCapacity,
        gear_capacity: updates.vehicle?.gearCapacity,
      })
      .eq('user_id', supabaseUser.id);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      supabaseUser,
      session,
      users,
      rides,
      messages,
      isAuthenticated: !!supabaseUser && !!session?.user?.email_confirmed_at,
      isLoading,
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
