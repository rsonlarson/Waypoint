import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Clock, Edit, AlertCircle } from 'lucide-react';
import { differenceInHours, parseISO, format } from 'date-fns';

interface DepartureTimeEditProps {
  rideId: string;
  currentDate: string;
  currentTime: string;
  onUpdate: (newDate: string, newTime: string) => Promise<void>;
}

const DEPARTURE_TIMES = [
  '5:00 AM',
  '5:30 AM',
  '6:00 AM',
  '6:30 AM',
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
];

export function DepartureTimeEdit({
  rideId,
  currentDate,
  currentTime,
  onUpdate,
}: DepartureTimeEditProps) {
  const [open, setOpen] = useState(false);
  const [newDate, setNewDate] = useState(currentDate);
  const [newTime, setNewTime] = useState(currentTime);
  const [loading, setLoading] = useState(false);

  // Check if we're within 24 hours of departure
  const now = new Date();
  const departureDateTime = parseISO(`${currentDate}T${convertTo24Hour(currentTime)}`);
  const hoursUntilDeparture = differenceInHours(departureDateTime, now);
  const canEdit = hoursUntilDeparture >= 24;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(newDate, newTime);
      setOpen(false);
      toast({
        title: 'Departure time updated',
        description: 'All riders will be notified of the change.',
      });
    } catch (error) {
      toast({
        title: 'Failed to update',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!canEdit) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{currentTime}</span>
        <span className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Cannot edit within 24h
        </span>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 h-auto p-1">
          <Clock className="h-4 w-4" />
          <span>{currentTime}</span>
          <Edit className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Departure Time</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            You can change the departure date and time up to 24 hours before the scheduled departure.
          </p>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Date</label>
              <Input
                type="date"
                min={today}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Time</label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTURE_TIMES.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <AlertCircle className="h-4 w-4 mt-0.5 text-accent" />
            <p className="text-sm text-muted-foreground">
              All accepted riders will be notified of this change via push notification.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleSave}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Updating...' : 'Update Time'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper to convert 12-hour time to 24-hour for parsing
function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }
  
  return `${hours.padStart(2, '0')}:${minutes}:00`;
}
