import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Clock, Edit, Bell } from 'lucide-react';

interface ReturnTimeAdjustProps {
  currentReturnTime: string;
  onTimeChange: (newTime: string) => void;
  isDriver: boolean;
}

const RETURN_TIMES = [
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
];

export function ReturnTimeAdjust({
  currentReturnTime,
  onTimeChange,
  isDriver,
}: ReturnTimeAdjustProps) {
  const [open, setOpen] = useState(false);
  const [newTime, setNewTime] = useState(currentReturnTime);

  const handleSave = () => {
    onTimeChange(newTime);
    setOpen(false);
    toast({
      title: 'Return time updated',
      description: `New return time: ${newTime}. All riders will be notified.`,
    });
  };

  if (!isDriver) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Return: {currentReturnTime}</span>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="h-4 w-4" />
          {currentReturnTime}
          <Edit className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Return Time</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Need more time on the slopes? Adjust the return time and all riders will be notified.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">New Return Time</label>
            <Select value={newTime} onValueChange={setNewTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RETURN_TIMES.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <Bell className="h-4 w-4 mt-0.5 text-accent" />
            <p className="text-sm text-muted-foreground">
              All riders will receive a notification about the time change.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleSave} className="flex-1">
              Update Time
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
