import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StarRating } from '@/components/StarRating';
import { LiabilityWaiver } from '@/components/LiabilityWaiver';
import { toast } from '@/hooks/use-toast';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Car,
  Snowflake,
  ArrowLeft,
  MessageSquare,
  Star,
  Check,
  X,
} from 'lucide-react';

export default function RideDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rides, currentUser, requestRide, acceptRequest, declineRequest } = useApp();
  const { notifyRideRequest } = useNotifications();
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [riderWaiverAccepted, setRiderWaiverAccepted] = useState(false);

  const ride = rides.find((r) => r.id === id);

  if (!ride) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-2">Ride not found</h2>
            <p className="text-muted-foreground mb-4">This ride may have been removed or doesn't exist.</p>
            <Link to="/rides">
              <Button>Browse rides</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const isDriver = currentUser?.id === ride.driverId;
  const hasRequested = ride.pendingRequests.some((r) => r.riderId === currentUser?.id);
  const isAccepted = ride.acceptedRiders.some((r) => r.id === currentUser?.id);
  const canRequest = currentUser && !isDriver && !hasRequested && !isAccepted && ride.seatsAvailable > 0;

  const handleRequestRide = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    requestRide(ride.id, requestMessage);
    // Notify the driver about the new request
    notifyRideRequest(currentUser.name, ride.destination);
    setShowRequestDialog(false);
    setRequestMessage('');
    toast({
      title: 'Request sent!',
      description: `${ride.driver.name} will review your request.`,
    });
  };

  const handleAcceptRequest = (requestId: string, riderName: string) => {
    acceptRequest(ride.id, requestId);
    toast({ title: 'Request accepted!', description: `${riderName} is now part of your crew.` });
  };

  const handleDeclineRequest = (requestId: string) => {
    declineRequest(ride.id, requestId);
    toast({ title: 'Request declined', description: 'The rider has been notified.' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ride Header */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl gradient-mountain flex items-center justify-center">
                      <Snowflake className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{ride.destination}</h1>
                      <p className="text-muted-foreground">{formatDate(ride.departureDate)}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      ride.seatsAvailable > 0
                        ? 'bg-evergreen/10 text-evergreen border-evergreen/30'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {ride.seatsAvailable > 0 ? `${ride.seatsAvailable} spots left` : 'Full'}
                  </Badge>
                </div>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="font-medium text-foreground">{ride.departureLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Departure</p>
                      <p className="font-medium text-foreground">{ride.departureTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Return</p>
                      <p className="font-medium text-foreground">{ride.returnTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <DollarSign className="h-5 w-5 text-evergreen" />
                    <div>
                      <p className="text-xs text-muted-foreground">Cost</p>
                      <p className="font-medium text-foreground">${ride.costPerRider} per person</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {ride.notes && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm text-foreground">{ride.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Accepted Riders */}
            {ride.acceptedRiders.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" />
                    Crew ({ride.acceptedRiders.length + 1})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ride.acceptedRiders.map((rider) => (
                    <Link 
                      key={rider.id} 
                      to={`/user/${rider.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={rider.avatar} />
                          <AvatarFallback>{rider.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{rider.name}</p>
                          <p className="text-sm text-muted-foreground">{rider.school}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-sunset text-sunset" />
                        <span className="text-sm font-medium">{rider.rating.toFixed(1)}</span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Pending Requests (Driver Only) */}
            {isDriver && ride.pendingRequests.length > 0 && (
              <Card className="shadow-card border-accent/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-5 w-5 text-accent" />
                    Pending Requests ({ride.pendingRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ride.pendingRequests.map((request) => (
                    <div key={request.id} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <Link 
                          to={`/user/${request.rider.id}`}
                          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.rider.avatar} />
                            <AvatarFallback>{request.rider.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{request.rider.name}</p>
                            <p className="text-sm text-muted-foreground">{request.rider.school}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <StarRating rating={request.rider.rating} size="sm" />
                              <span className="text-xs text-muted-foreground">
                                ({request.rider.totalRides} rides)
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                      {request.message && (
                        <p className="text-sm text-muted-foreground mb-4 p-3 rounded bg-muted/50">
                          "{request.message}"
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="evergreen"
                          onClick={() => handleAcceptRequest(request.id, request.rider.name)}
                          className="flex-1"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineRequest(request.id)}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Driver Card */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Driver</CardTitle>
              </CardHeader>
              <CardContent>
                <Link 
                  to={`/user/${ride.driver.id}`}
                  className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="h-14 w-14 border-2 border-primary/20">
                    <AvatarImage src={ride.driver.avatar} />
                    <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{ride.driver.name}</p>
                    <p className="text-sm text-muted-foreground">{ride.driver.school}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={ride.driver.rating} size="sm" />
                      <span className="text-sm text-muted-foreground">
                        ({ride.driver.totalRides} rides)
                      </span>
                    </div>
                  </div>
                </Link>
                <p className="text-sm text-muted-foreground mb-4">{ride.driver.bio}</p>
                {ride.driver.vehicle && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {ride.driver.vehicle.color} {ride.driver.vehicle.make} {ride.driver.vehicle.model}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{ride.driver.vehicle.passengerCapacity} seats</span>
                      <span>{ride.driver.vehicle.gearCapacity} gear spots</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Button */}
            {canRequest && (
              <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                <DialogTrigger asChild>
                  <Button variant="gradient" size="lg" className="w-full">
                    Request to Join
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request to join this ride</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Message to {ride.driver.name} (optional)
                      </label>
                      <Textarea
                        placeholder="Introduce yourself, mention your experience level, or ask any questions..."
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <LiabilityWaiver 
                      type="rider" 
                      checked={riderWaiverAccepted} 
                      onCheckedChange={setRiderWaiverAccepted} 
                    />
                    <Button variant="gradient" onClick={handleRequestRide} className="w-full" disabled={!riderWaiverAccepted}>
                      Send Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {hasRequested && (
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 text-center">
                <p className="font-medium text-foreground">Request Pending</p>
                <p className="text-sm text-muted-foreground">Waiting for {ride.driver.name} to respond</p>
              </div>
            )}

            {isAccepted && (
              <div className="p-4 rounded-lg bg-evergreen/10 border border-evergreen/30 text-center">
                <Check className="h-6 w-6 text-evergreen mx-auto mb-2" />
                <p className="font-medium text-foreground">You're in!</p>
                <p className="text-sm text-muted-foreground">Contact {ride.driver.name} for details</p>
              </div>
            )}

            {isDriver && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-center">
                <p className="font-medium text-foreground">This is your ride</p>
                <p className="text-sm text-muted-foreground">{ride.pendingRequests.length} pending requests</p>
              </div>
            )}

            {!currentUser && (
              <Link to="/auth">
                <Button variant="gradient" size="lg" className="w-full">
                  Sign in to Request
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
