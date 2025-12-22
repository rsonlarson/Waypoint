import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { RESORTS, RESORT_DISTANCES, calculateGasCost, GAS_PRICE_PER_GALLON, AVERAGE_MPG } from '@/types';
import { Mountain, Calendar, Clock, MapPin, Users, Fuel, Snowflake, FileText } from 'lucide-react';

export default function PostRide() {
  const navigate = useNavigate();
  const { createRide, currentUser, isAuthenticated } = useApp();
  const { notifyNewRide } = useNotifications();

  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [departureLocation, setDepartureLocation] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [seatsAvailable, setSeatsAvailable] = useState('');
  const [gearCapacity, setGearCapacity] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-calculate cost based on destination
  const costPerRider = useMemo(() => {
    if (!destination) return 0;
    return calculateGasCost(destination);
  }, [destination]);

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    createRide({
      driverId: currentUser!.id,
      destination,
      departureDate,
      departureTime,
      departureLocation,
      returnDate: returnDate || departureDate,
      returnTime,
      seatsAvailable: parseInt(seatsAvailable),
      seatsTotal: parseInt(seatsAvailable),
      gearCapacity: parseInt(gearCapacity),
      costPerRider: costPerRider,
      notes,
    });

    // Notify others about the new ride
    notifyNewRide(destination, currentUser!.name);

    toast({
      title: 'Ride posted! 🎿',
      description: 'Your ride is now visible to other students.',
    });

    setLoading(false);
    navigate('/rides');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl gradient-mountain mb-4">
              <Mountain className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Share the Stoke</h1>
            <p className="text-muted-foreground">Post your ride and find your crew</p>
            <Link to="/driver-guide" className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline">
              <FileText className="h-4 w-4" />
              Read the Driver's Guide
            </Link>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Ride Details</CardTitle>
              <CardDescription>Fill in the details for your trip to the mountain</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <Snowflake className="h-4 w-4 text-primary" />
                    Destination
                  </Label>
                  <Select value={destination} onValueChange={setDestination} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a resort" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESORTS.map((resort) => (
                        <SelectItem key={resort} value={resort}>
                          {resort}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Departure Location */}
                <div className="space-y-2">
                  <Label htmlFor="departureLocation" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Pickup Location
                  </Label>
                  <Input
                    id="departureLocation"
                    placeholder="e.g., CU Boulder - Farrand Field"
                    value={departureLocation}
                    onChange={(e) => setDepartureLocation(e.target.value)}
                    required
                  />
                </div>

                {/* Departure Date & Time */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Departure Date
                    </Label>
                    <Input
                      id="departureDate"
                      type="date"
                      min={today}
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Departure Time
                    </Label>
                    <Select value={departureTime} onValueChange={setDepartureTime} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {['5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM'].map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Return Date & Time */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="returnDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Return Date
                    </Label>
                    <Input
                      id="returnDate"
                      type="date"
                      min={departureDate || today}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Leave blank for same-day return</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Return Time
                    </Label>
                    <Select value={returnTime} onValueChange={setReturnTime} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'].map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Capacity */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seatsAvailable" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Seats Available
                    </Label>
                    <Select value={seatsAvailable} onValueChange={setSeatsAvailable} required>
                      <SelectTrigger>
                        <SelectValue placeholder="How many?" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} seat{n !== 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gearCapacity" className="flex items-center gap-2">
                      <Snowflake className="h-4 w-4 text-primary" />
                      Gear Capacity
                    </Label>
                    <Select value={gearCapacity} onValueChange={setGearCapacity} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Skis/boards" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} skis/boards
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Cost - Auto-calculated based on gas */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-evergreen" />
                    Gas Cost (Auto-calculated)
                  </Label>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    {destination ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-evergreen">${costPerRider}</span>
                          <span className="text-sm text-muted-foreground">total gas cost</span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>📍 {RESORT_DISTANCES[destination]} miles each way ({RESORT_DISTANCES[destination] * 2} mi round trip)</p>
                          <p>⛽ ${GAS_PRICE_PER_GALLON.toFixed(2)}/gal × {((RESORT_DISTANCES[destination] * 2) / AVERAGE_MPG).toFixed(1)} gal needed</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Select a destination to see gas cost</p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Based on gas prices in Golden ($2.40/gal) and {AVERAGE_MPG} MPG</p>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes & Preferences</Label>
                  <Textarea
                    id="notes"
                    placeholder="E.g., 'Planning to hit the terrain park', 'prefer experienced riders', 'acoustic jam session welcome'..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Pickup Window Disclaimer */}
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium text-foreground text-sm">16-Minute Pickup Window</p>
                      <p className="text-sm text-muted-foreground">
                        You and your riders will receive a notification 16 minutes before departure. 
                        Use this time to arrive at the pickup location. Both drivers and riders are 
                        expected to be present and ready during this window.
                      </p>
                      <Link 
                        to="/driver-guide" 
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Learn more about the ride process
                      </Link>
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Posting...' : 'Post Your Ride'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
