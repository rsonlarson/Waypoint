export interface User {
  id: string;
  email: string;
  name: string;
  school: string;
  phone: string;
  bio: string;
  avatar: string;
  role: 'driver' | 'rider' | 'both';
  vehicle?: Vehicle;
  rating: number;
  totalRides: number;
  createdAt: string;
}

export interface Vehicle {
  make: string;
  model: string;
  color: string;
  passengerCapacity: number;
  gearCapacity: number;
}

export interface Ride {
  id: string;
  driverId: string;
  driver: User;
  destination: string;
  departureDate: string;
  departureTime: string;
  departureLocation: string;
  returnDate: string;
  returnTime: string;
  seatsAvailable: number;
  seatsTotal: number;
  gearCapacity: number;
  costPerRider: number;
  notes: string;
  status: 'open' | 'full' | 'completed' | 'cancelled';
  acceptedRiders: User[];
  pendingRequests: RideRequest[];
  createdAt: string;
}

export interface RideRequest {
  id: string;
  rideId: string;
  riderId: string;
  rider: User;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Message {
  id: string;
  rideId: string;
  senderId: string;
  sender: User;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  rideId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const RESORTS = [
  'Vail',
  'Breckenridge',
  'Keystone',
  'Arapahoe Basin',
  'Copper Mountain',
  'Loveland',
  'Winter Park',
  'Eldora',
  'Steamboat Springs',
  'Aspen Snowmass',
] as const;

export type Resort = typeof RESORTS[number];
