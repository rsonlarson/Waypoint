import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ProfilePhotoUpload } from '@/components/ProfilePhotoUpload';
import { StarRating } from '@/components/StarRating';
import { toast } from '@/hooks/use-toast';
import { User, Car, Calendar } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, isAuthenticated } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [role, setRole] = useState(currentUser?.role || 'rider');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [vehicleMake, setVehicleMake] = useState(currentUser?.vehicle?.make || '');
  const [vehicleModel, setVehicleModel] = useState(currentUser?.vehicle?.model || '');
  const [vehicleColor, setVehicleColor] = useState(currentUser?.vehicle?.color || '');
  const [passengerCapacity, setPassengerCapacity] = useState(currentUser?.vehicle?.passengerCapacity?.toString() || '4');
  const [gearCapacity, setGearCapacity] = useState(currentUser?.vehicle?.gearCapacity?.toString() || '4');
  const [imageOpen, setImageOpen] = useState(false);

  if (!isAuthenticated || !currentUser) {
    navigate('/auth');
    return null;
  }

  const handleAvatarChange = (newAvatarUrl: string) => {
    setAvatar(newAvatarUrl);
    updateProfile({ avatar: newAvatarUrl });
  };

  const handleSave = () => {
    updateProfile({
      name,
      phone,
      bio,
      avatar,
      role: role as 'driver' | 'rider' | 'both',
      vehicle: role !== 'rider' ? {
        make: vehicleMake,
        model: vehicleModel,
        color: vehicleColor,
        passengerCapacity: parseInt(passengerCapacity),
        gearCapacity: parseInt(gearCapacity),
      } : undefined,
    });
    setIsEditing(false);
    toast({ title: 'Profile updated!', description: 'Your changes have been saved.' });
  };

  const avatarUrl = currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <ProfilePhotoUpload
                      currentAvatar={avatarUrl}
                      userName={currentUser.name}
                      userId={currentUser.id}
                      onAvatarChange={handleAvatarChange}
                    />
                  ) : (
                    <Dialog open={imageOpen} onOpenChange={setImageOpen}>
                      <DialogTrigger asChild>
                        <Avatar className="h-20 w-20 border-4 border-primary/20 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                          <AvatarImage src={avatarUrl} />
                          <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </DialogTrigger>
                      <DialogContent className="max-w-md p-0 bg-transparent border-none">
                        <img 
                          src={avatarUrl} 
                          alt={currentUser.name} 
                          className="w-full h-auto rounded-lg"
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                  <div>
                    <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
                    <CardDescription>{currentUser.school}</CardDescription>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <StarRating rating={currentUser.rating} size="sm" />
                        <span className="text-sm font-medium ml-1">{currentUser.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{currentUser.totalRides} rides</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant={isEditing ? 'outline' : 'default'} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <>
                  {/* Edit Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={role} onValueChange={(value) => setRole(value as 'driver' | 'rider' | 'both')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rider">Rider</SelectItem>
                          <SelectItem value="driver">Driver</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {role !== 'rider' && (
                      <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                        <h4 className="font-medium flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Vehicle Info
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Make</Label>
                            <Input value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Model</Label>
                            <Input value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Color</Label>
                            <Input value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Passenger Seats</Label>
                            <Select value={passengerCapacity} onValueChange={setPassengerCapacity}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button variant="gradient" onClick={handleSave} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-medium">About</span>
                      </div>
                      <p className="text-muted-foreground">{currentUser.bio || 'No bio yet'}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="font-medium">{currentUser.email}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                        <p className="font-medium">{currentUser.phone || 'Not set'}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Role</p>
                      <p className="font-medium capitalize">{currentUser.role}</p>
                    </div>

                    {currentUser.vehicle && (
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-3">
                          <Car className="h-5 w-5 text-primary" />
                          <span className="font-medium">My Vehicle</span>
                        </div>
                        <p className="font-semibold text-lg mb-2">
                          {currentUser.vehicle.color} {currentUser.vehicle.make} {currentUser.vehicle.model}
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{currentUser.vehicle.passengerCapacity} passenger seats</span>
                          <span>{currentUser.vehicle.gearCapacity} gear spots</span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
