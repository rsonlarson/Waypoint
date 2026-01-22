import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { RideCard } from '@/components/RideCard';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationBanner } from '@/components/NotificationBanner';
import { RESORTS } from '@/types';
import { Search, SlidersHorizontal, X, Snowflake } from 'lucide-react';

export default function Rides() {
  const { rides } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResort, setSelectedResort] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      const matchesSearch =
        ride.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.departureLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.driver.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesResort = selectedResort === 'all' || ride.destination === selectedResort;
      
      const isFuture = new Date(ride.departureDate) >= new Date(new Date().setHours(0, 0, 0, 0));
      
      return matchesSearch && matchesResort && isFuture && ride.status !== 'cancelled';
    });
  }, [rides, searchQuery, selectedResort]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedResort('all');
  };

  const hasActiveFilters = searchQuery || selectedResort !== 'all';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Notification Banner */}
        <NotificationBanner className="mb-6" />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Powder Crew</h1>
          <p className="text-muted-foreground">Browse upcoming rides to Colorado's best resorts</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by resort, location, or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {(searchQuery ? 1 : 0) + (selectedResort !== 'all' ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border animate-scale-in">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">Resort</label>
                  <Select value={selectedResort} onValueChange={setSelectedResort}>
                    <SelectTrigger>
                      <SelectValue placeholder="All resorts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All resorts</SelectItem>
                      {RESORTS.map((resort) => (
                        <SelectItem key={resort} value={resort}>
                          {resort}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4">
                  <X className="h-4 w-4 mr-2" />
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {filteredRides.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filteredRides.length} ride{filteredRides.length !== 1 ? 's' : ''} available
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRides.map((ride, index) => (
                <div
                  key={ride.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <RideCard ride={ride} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Snowflake className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No rides found</h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters or search query'
                : 'Be the first to post a ride!'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
