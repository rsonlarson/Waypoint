import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, Ride, RideRequest, Message } from '@/types';

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
  createRide: (ride: Omit<Ride, 'id' | 'driver' | 'acceptedRiders' | 'pendingRequests' | 'createdAt' | 'status'>) => Promise<void>;
  requestRide: (rideId: string, message: string) => Promise<void>;
  acceptRequest: (rideId: string, requestId: string) => Promise<void>;
  declineRequest: (rideId: string, requestId: string) => Promise<void>;
  sendMessage: (rideId: string, content: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  fetchMessages: (rideId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

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

  useEffect(() => {
    if (session) {
      fetchRides();
    }
  }, [session]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

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
            year: profile.vehicle_year || undefined,
            licensePlate: profile.license_plate || undefined,
            gearStorage: profile.gear_storage || undefined,
            passengerCapacity: profile.passenger_capacity || 4,
            gearCapacity: profile.gear_capacity || 4,
          } : undefined,
          rating: Number(profile.rating) || 5.0,
          totalRides: profile.total_rides || 0,
          createdAt: profile.created_at,
          yearInSchool: profile.year_in_school || undefined,
          major: profile.major || undefined,
          sportPreference: profile.sport_preference || undefined,
          favoriteMusic: profile.favorite_music || undefined,
        };
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRides = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          driver:profiles!rides_driver_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedRides: Ride[] = (data || []).map(r => ({
        id: r.id,
        driverId: r.driver_id,
        driver: {
          id: r.driver.user_id,
          email: r.driver.email,
          name: r.driver.name,
          school: r.driver.school,
          phone: r.driver.phone || '',
          bio: r.driver.bio || '',
          avatar: r.driver.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.driver.email}`,
          role: r.driver.role as 'driver' | 'rider' | 'both',
          rating: Number(r.driver.rating) || 5.0,
          totalRides: r.driver.total_rides || 0,
          createdAt: r.driver.created_at,
        },
        destination: r.destination,
        departureDate: r.departure_date,
        departureTime: r.departure_time,
        departureLocation: r.departure_location,
        returnDate: r.return_date,
        returnTime: r.return_time,
        seatsAvailable: r.seats_available,
        seatsTotal: r.seats_total,
        gearCapacity: r.gear_capacity,
        costPerRider: Number(r.cost_per_rider),
        notes: r.notes || '',
        status: r.status as any,
        acceptedRiders: [], 
        pendingRequests: [], 
        createdAt: r.created_at,
      }));
      
      setRides(transformedRides);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  const fetchMessages = async (rideId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages' as any)
        .select('*, sender:profiles(*)')
        .eq('ride_id', rideId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const transformedMessages: Message[] = (data || []).map(m => ({
        id: m.id,
        rideId: m.ride_id,
        senderId: m.sender_id,
        sender: {
          id: m.sender.user_id,
          email: m.sender.email,
          name: m.sender.name,
          school: m.sender.school,
          phone: m.sender.phone || '',
          bio: m.sender.bio || '',
          avatar: m.sender.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.sender.email}`,
          role: m.sender.role as 'driver' | 'rider' | 'both',
          rating: Number(m.sender.rating) || 5.0,
          totalRides: m.sender.total_rides || 0,
          createdAt: m.sender.created_at,
        },
        content: m.content,
        createdAt: m.created_at,
      }));
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSupabaseUser(null);
    setSession(null);
  };

  const createRide = async (rideData: any) => {
    if (!currentUser) return;
    try {
      const { error } = await supabase.from('rides').insert({
        driver_id: currentUser.id,
        ...rideData,
        status: 'open',
      });
      if (error) throw error;
      fetchRides();
    } catch (error) {
      console.error('Error creating ride:', error);
    }
  };

  const requestRide = async (rideId: string, message: string) => {
    if (!currentUser) return;
    try {
      const { error } = await supabase.from('ride_requests').insert({
        ride_id: rideId,
        rider_id: currentUser.id,
        message,
        status: 'pending',
      });
      if (error) throw error;
      fetchRides();
    } catch (error) {
      console.error('Error requesting ride:', error);
    }
  };

  const acceptRequest = async (rideId: string, requestId: string) => {
    try {
      const { error } = await supabase.from('ride_requests').update({ status: 'accepted' }).eq('id', requestId);
      if (error) throw error;
      fetchRides();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const declineRequest = async (rideId: string, requestId: string) => {
    try {
      const { error } = await supabase.from('ride_requests').update({ status: 'declined' }).eq('id', requestId);
      if (error) throw error;
      fetchRides();
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const sendMessage = async (rideId: string, content: string) => {
    if (!currentUser) return;
    try {
      const { error } = await supabase.from('messages' as any).insert({
        ride_id: rideId,
        sender_id: currentUser.id,
        content,
      });
      if (error) throw error;
      fetchMessages(rideId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser || !supabaseUser) return;
    try {
      const { error } = await supabase.from('profiles').update({
        name: updates.name,
        phone: updates.phone,
        bio: updates.bio,
        avatar: updates.avatar,
        role: updates.role,
        vehicle_make: updates.vehicle?.make,
        vehicle_model: updates.vehicle?.model,
        vehicle_color: updates.vehicle?.color,
        vehicle_year: updates.vehicle?.year,
        license_plate: updates.vehicle?.licensePlate,
        gear_storage: updates.vehicle?.gearStorage,
        passenger_capacity: updates.vehicle?.passengerCapacity,
        gear_capacity: updates.vehicle?.gearCapacity,
        year_in_school: updates.yearInSchool,
        major: updates.major,
        sport_preference: updates.sportPreference,
        favorite_music: updates.favoriteMusic,
      }).eq('user_id', supabaseUser.id);
      if (error) throw error;
      fetchUserProfile(supabaseUser.id);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
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
      fetchMessages
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
