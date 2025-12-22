-- Create enum for ride lifecycle status
CREATE TYPE public.ride_lifecycle_status AS ENUM (
  'scheduled',
  'pickup_window',
  'in_progress',
  'return_window',
  'completed',
  'cancelled'
);

-- Create rides table for persistent ride data
CREATE TABLE public.rides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  departure_location TEXT NOT NULL,
  return_date DATE NOT NULL,
  return_time TIME NOT NULL,
  seats_available INTEGER NOT NULL DEFAULT 4,
  seats_total INTEGER NOT NULL DEFAULT 4,
  gear_capacity INTEGER NOT NULL DEFAULT 2,
  cost_per_rider NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  lifecycle_status ride_lifecycle_status NOT NULL DEFAULT 'scheduled',
  pickup_confirmed_at TIMESTAMP WITH TIME ZONE,
  ride_started_at TIMESTAMP WITH TIME ZONE,
  ride_ended_at TIMESTAMP WITH TIME ZONE,
  return_started_at TIMESTAMP WITH TIME ZONE,
  return_ended_at TIMESTAMP WITH TIME ZONE,
  actual_return_time TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ride requests table
CREATE TABLE public.ride_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  confirmed_present BOOLEAN DEFAULT FALSE,
  marked_no_show BOOLEAN DEFAULT FALSE,
  no_show_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ride_id, rider_id)
);

-- Create ride notifications log table
CREATE TABLE public.ride_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_notifications ENABLE ROW LEVEL SECURITY;

-- Rides policies
CREATE POLICY "Anyone can view rides" ON public.rides
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create rides" ON public.rides
  FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update their own rides" ON public.rides
  FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can delete their own rides" ON public.rides
  FOR DELETE USING (auth.uid() = driver_id);

-- Ride requests policies
CREATE POLICY "Users can view ride requests for rides they're involved in" ON public.ride_requests
  FOR SELECT USING (
    auth.uid() = rider_id OR 
    auth.uid() IN (SELECT driver_id FROM public.rides WHERE id = ride_id)
  );

CREATE POLICY "Authenticated users can create ride requests" ON public.ride_requests
  FOR INSERT WITH CHECK (auth.uid() = rider_id);

CREATE POLICY "Drivers and riders can update requests" ON public.ride_requests
  FOR UPDATE USING (
    auth.uid() = rider_id OR 
    auth.uid() IN (SELECT driver_id FROM public.rides WHERE id = ride_id)
  );

-- Ride notifications policies
CREATE POLICY "Users can view their own notifications" ON public.ride_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.ride_notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.ride_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_rides_updated_at
  BEFORE UPDATE ON public.rides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ride_requests_updated_at
  BEFORE UPDATE ON public.ride_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();