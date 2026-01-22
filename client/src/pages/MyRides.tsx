import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { RideCard } from '@/components/RideCard';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Users, Plus, Snowflake } from 'lucide-react';

export default function MyRides() {
  const navigate = useNavigate();
  const { rides, currentUser, isAuthenticated } = useApp();

  if (!isAuthenticated || !currentUser) {
    navigate('/auth');
    return null;
  }

  const myDrivingRides = rides.filter((ride) => ride.driverId === currentUser.id);
  const myRidingRides = rides.filter((ride) => 
    ride.acceptedRiders.some((r) => r.id === currentUser.id) ||
    ride.pendingRequests.some((r) => r.riderId === currentUser.id)
  );

  const EmptyState = ({ type }: { type: 'driving' | 'riding' }) => (
    <div className="text-center py-12">
      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Snowflake className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {type === 'driving' ? 'No rides posted yet' : 'No rides joined yet'}
      </h3>
      <p className="text-muted-foreground mb-4">
        {type === 'driving'
          ? 'Share a ride to the mountain and find your crew!'
          : 'Browse available rides and request to join'}
      </p>
      <Link to={type === 'driving' ? '/post-ride' : '/rides'}>
        <Button variant="gradient">
          {type === 'driving' ? 'Post Your First Ride' : 'Find a Ride'}
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Rides</h1>
            <p className="text-muted-foreground">Manage your trips to the mountain</p>
          </div>
          <Link to="/post-ride">
            <Button variant="gradient">
              <Plus className="h-4 w-4 mr-2" />
              Post a Ride
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="driving" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="driving" className="gap-2">
              <Car className="h-4 w-4" />
              Driving ({myDrivingRides.length})
            </TabsTrigger>
            <TabsTrigger value="riding" className="gap-2">
              <Users className="h-4 w-4" />
              Riding ({myRidingRides.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="driving">
            {myDrivingRides.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myDrivingRides.map((ride, index) => (
                  <div
                    key={ride.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <RideCard ride={ride} />
                    {ride.pendingRequests.length > 0 && (
                      <Link to={`/rides/${ride.id}`}>
                        <div className="mt-2 p-2 rounded-lg bg-accent/10 border border-accent/30 text-center">
                          <span className="text-sm font-medium text-accent">
                            {ride.pendingRequests.length} pending request{ride.pendingRequests.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState type="driving" />
            )}
          </TabsContent>

          <TabsContent value="riding">
            {myRidingRides.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRidingRides.map((ride, index) => {
                  const isPending = ride.pendingRequests.some((r) => r.riderId === currentUser.id);
                  return (
                    <div
                      key={ride.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <RideCard ride={ride} />
                      {isPending && (
                        <div className="mt-2 p-2 rounded-lg bg-muted border border-border text-center">
                          <span className="text-sm text-muted-foreground">Request pending</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState type="riding" />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
