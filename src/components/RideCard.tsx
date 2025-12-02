import { Link } from 'react-router-dom';
import { Ride } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Star,
  Snowflake
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RideCardProps {
  ride: Ride;
  variant?: 'default' | 'compact';
}

export function RideCard({ ride, variant = 'default' }: RideCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isCompact = variant === 'compact';

  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-hover border-border/50",
      "bg-card hover:border-primary/30"
    )}>
      <CardContent className={cn("p-4", !isCompact && "sm:p-5")}>
        {/* Header: Destination & Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Snowflake className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {ride.destination}
              </h3>
              <p className="text-sm text-muted-foreground">{formatDate(ride.departureDate)}</p>
            </div>
          </div>
          <Badge 
            variant={ride.seatsAvailable > 0 ? 'default' : 'secondary'}
            className={cn(
              ride.seatsAvailable > 0 
                ? "bg-evergreen/10 text-evergreen border-evergreen/30" 
                : "bg-muted text-muted-foreground"
            )}
          >
            {ride.seatsAvailable > 0 ? `${ride.seatsAvailable} spots` : 'Full'}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary/70" />
            <span className="truncate">{ride.departureLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary/70" />
            <span>{ride.departureTime}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-primary/70" />
            <span>{ride.seatsAvailable}/{ride.seatsTotal} seats</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4 text-evergreen" />
            <span className="font-medium text-foreground">${ride.costPerRider}/person</span>
          </div>
        </div>

        {/* Notes Preview */}
        {!isCompact && ride.notes && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {ride.notes}
          </p>
        )}

        {/* Driver Info */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
              <AvatarFallback className="text-xs">{ride.driver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{ride.driver.name}</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-sunset text-sunset" />
                <span className="text-xs text-muted-foreground">
                  {ride.driver.rating.toFixed(1)} · {ride.driver.totalRides} rides
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/rides/${ride.id}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
