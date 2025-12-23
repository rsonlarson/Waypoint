import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { StarRating } from '@/components/StarRating';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, User, Car, Calendar } from 'lucide-react';

interface ProfileData {
  user_id: string;
  name: string;
  email: string;
  school: string;
  bio: string | null;
  phone: string | null;
  avatar: string | null;
  role: string;
  rating: number | null;
  total_rides: number | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_color: string | null;
  passenger_capacity: number | null;
  gear_capacity: number | null;
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-16">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-2">Profile not found</h2>
            <p className="text-muted-foreground mb-4">This user may have been removed or doesn't exist.</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </main>
      </div>
    );
  }

  // If viewing own profile, redirect to /profile
  if (currentUser?.id === userId) {
    navigate('/profile');
    return null;
  }

  const avatarUrl = profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Dialog open={imageOpen} onOpenChange={setImageOpen}>
                  <DialogTrigger asChild>
                    <Avatar className="h-20 w-20 border-4 border-primary/20 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent className="max-w-md p-0 bg-transparent border-none">
                    <img 
                      src={avatarUrl} 
                      alt={profile.name} 
                      className="w-full h-auto rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
                <div>
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <CardDescription>{profile.school}</CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <StarRating rating={profile.rating || 5} size="sm" />
                      <span className="text-sm font-medium ml-1">{(profile.rating || 5).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{profile.total_rides || 0} rides</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">About</span>
                </div>
                <p className="text-muted-foreground">{profile.bio || 'No bio yet'}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Role</p>
                  <p className="font-medium capitalize">{profile.role}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">School</p>
                  <p className="font-medium">{profile.school}</p>
                </div>
              </div>

              {profile.vehicle_make && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Car className="h-5 w-5 text-primary" />
                    <span className="font-medium">Vehicle</span>
                  </div>
                  <p className="font-semibold text-lg mb-2">
                    {profile.vehicle_color} {profile.vehicle_make} {profile.vehicle_model}
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{profile.passenger_capacity} passenger seats</span>
                    <span>{profile.gear_capacity} gear spots</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
