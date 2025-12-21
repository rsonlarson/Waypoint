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

// Gas price in Golden, CO
export const GAS_PRICE_PER_GALLON = 2.40;

// Average MPG for carpool vehicles
export const AVERAGE_MPG = 25;

// Resort distances from downtown Golden, CO (one-way miles)
export const RESORT_DISTANCES: Record<string, number> = {
  'Vail': 97,
  'Breckenridge': 80,
  'Keystone': 67,
  'Arapahoe Basin': 60,
  'Copper Mountain': 75,
  'Loveland': 52,
  'Winter Park': 67,
  'Eldora': 32,
  'Steamboat Springs': 157,
  'Aspen Snowmass': 162,
};

export const RESORTS = Object.keys(RESORT_DISTANCES) as const;

export type Resort = keyof typeof RESORT_DISTANCES;

// Calculate gas cost for a round trip to a resort
export function calculateGasCost(resort: string): number {
  const oneWayMiles = RESORT_DISTANCES[resort] || 0;
  const roundTripMiles = oneWayMiles * 2;
  const gallonsNeeded = roundTripMiles / AVERAGE_MPG;
  const totalCost = gallonsNeeded * GAS_PRICE_PER_GALLON;
  return Math.round(totalCost);
}
