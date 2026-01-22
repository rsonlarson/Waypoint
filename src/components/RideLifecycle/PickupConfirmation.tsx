import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';
import { CheckCircle, XCircle, Clock, Users, AlertTriangle } from 'lucide-react';

interface RiderStatus {
  rider: User;
  confirmed: boolean;
  noShow: boolean;
  noShowAction?: 'wait' | 'proceed' | 'remove';
}

interface PickupConfirmationProps {
  riders: User[];
  onConfirmAll: (confirmedRiders: string[], noShowRiders: string[]) => void;
  onStartRide: () => void;
  pickupWindowMinutes?: number;
}

export function PickupConfirmation({
  riders,
  onConfirmAll,
  onStartRide,
  pickupWindowMinutes = 16,
}: PickupConfirmationProps) {
  const [riderStatuses, setRiderStatuses] = useState<RiderStatus[]>(
    riders.map((rider) => ({
      rider,
      confirmed: false,
      noShow: false,
    }))
  );
  const [noShowDialogOpen, setNoShowDialogOpen] = useState(false);
  const [selectedNoShowRider, setSelectedNoShowRider] = useState<RiderStatus | null>(null);

  const confirmedCount = riderStatuses.filter((r) => r.confirmed).length;
  const allConfirmed = confirmedCount === riders.length;
  const hasNoShows = riderStatuses.some((r) => r.noShow);

  const toggleRiderConfirmed = (riderId: string) => {
    setRiderStatuses((prev) =>
      prev.map((r) =>
        r.rider.id === riderId
          ? { ...r, confirmed: !r.confirmed, noShow: false }
          : r
      )
    );
  };

  const confirmAllPresent = () => {
    setRiderStatuses((prev) =>
      prev.map((r) => ({ ...r, confirmed: true, noShow: false }))
    );
  };

  const handleNoShow = (rider: RiderStatus) => {
    setSelectedNoShowRider(rider);
    setNoShowDialogOpen(true);
  };

  const handleNoShowAction = (action: 'wait' | 'proceed' | 'remove') => {
    if (!selectedNoShowRider) return;

    setRiderStatuses((prev) =>
      prev.map((r) =>
        r.rider.id === selectedNoShowRider.rider.id
          ? { ...r, noShow: action !== 'wait', noShowAction: action }
          : r
      )
    );

    setNoShowDialogOpen(false);

    if (action === 'wait') {
      toast({
        title: 'Waiting for rider',
        description: `Giving ${selectedNoShowRider.rider.name} more time to arrive.`,
      });
    } else if (action === 'proceed') {
      toast({
        title: 'Marked as no-show',
        description: `${selectedNoShowRider.rider.name} will be recorded as absent.`,
      });
    } else {
      toast({
        title: 'Rider removed',
        description: `${selectedNoShowRider.rider.name} has been removed from this ride.`,
      });
    }
  };

  const handleStartRide = () => {
    const confirmed = riderStatuses.filter((r) => r.confirmed).map((r) => r.rider.id);
    const noShows = riderStatuses.filter((r) => r.noShow).map((r) => r.rider.id);
    onConfirmAll(confirmed, noShows);
    onStartRide();
  };

  return (
    <Card className="shadow-card border-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Pickup Confirmation
          </div>
          <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
            <Clock className="h-4 w-4" />
            {pickupWindowMinutes} min window
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-sm text-muted-foreground">
            Check off each rider as they arrive at the pickup location.
          </p>
        </div>

        <div className="space-y-2">
          {riderStatuses.map((status) => (
            <div
              key={status.rider.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                status.confirmed
                  ? 'bg-evergreen/10 border-evergreen/30'
                  : status.noShow
                  ? 'bg-destructive/10 border-destructive/30'
                  : 'bg-muted/50 border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={status.confirmed}
                  onCheckedChange={() => toggleRiderConfirmed(status.rider.id)}
                  disabled={status.noShow}
                />
                <Avatar className="h-8 w-8">
                  <AvatarImage src={status.rider.avatar} />
                  <AvatarFallback>{status.rider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground text-sm">{status.rider.name}</p>
                  {status.noShow && (
                    <p className="text-xs text-destructive">
                      {status.noShowAction === 'proceed' ? 'No-show' : 'Removed'}
                    </p>
                  )}
                </div>
              </div>

              {!status.confirmed && !status.noShow && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNoShow(status)}
                  className="text-destructive hover:text-destructive"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}

              {status.confirmed && (
                <CheckCircle className="h-5 w-5 text-evergreen" />
              )}

              {status.noShow && (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={confirmAllPresent}
            disabled={allConfirmed}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            All Present
          </Button>
          <Button
            variant="gradient"
            onClick={handleStartRide}
            disabled={confirmedCount === 0 && !hasNoShows}
            className="flex-1"
          >
            Start Ride ({confirmedCount}/{riders.length})
          </Button>
        </div>

        {/* No-Show Action Dialog */}
        <Dialog open={noShowDialogOpen} onOpenChange={setNoShowDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedNoShowRider?.rider.name} hasn't arrived
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <p className="text-sm text-muted-foreground">
                What would you like to do?
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => handleNoShowAction('wait')}
                  className="w-full justify-start"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Wait a bit longer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNoShowAction('proceed')}
                  className="w-full justify-start"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Mark as no-show and proceed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNoShowAction('remove')}
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Remove from ride
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
