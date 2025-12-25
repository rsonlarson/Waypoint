-- Add new profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS year_in_school text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS major text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sport_preference text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS favorite_music text DEFAULT NULL;

-- Add new vehicle fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS vehicle_year integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS license_plate text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS gear_storage text DEFAULT NULL;