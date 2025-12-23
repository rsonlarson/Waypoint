-- Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create policies for avatar uploads
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add liability waiver fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS signup_waiver_accepted_at timestamp with time zone DEFAULT NULL;

-- Add liability waiver fields to rides table
ALTER TABLE public.rides 
ADD COLUMN IF NOT EXISTS driver_waiver_accepted_at timestamp with time zone DEFAULT NULL;

-- Add rider waiver acceptance to ride_requests table
ALTER TABLE public.ride_requests 
ADD COLUMN IF NOT EXISTS rider_waiver_accepted_at timestamp with time zone DEFAULT NULL;