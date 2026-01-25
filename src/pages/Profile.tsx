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
import { User, Car, Calendar, Music, GraduationCap, Snowflake } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, isAuthenticated } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [role, setRole] = useState(currentUser?.role || 'rider');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  
  // New profile fields
  const [yearInSchool, setYearInSchool] = useState(currentUser?.yearInSchool || '');
  const [major, setMajor] = useState(currentUser?.major || '');
  const [sportPreference, setSportPreference] = useState(currentUser?.sportPreference || '');
  const [favoriteMusic, setFavoriteMusic] = useState(currentUser?.favoriteMusic || '');
  
  // Vehicle fields
  const [vehicleMake, setVehicleMake] = useState(currentUser?.vehicle?.make || '');
  const [vehicleModel, setVehicleModel] = useState(currentUser?.vehicle?.model || '');
  const [vehicleColor, setVehicleColor] = useState(currentUser?.vehicle?.color || '');
  const [vehicleYear, setVehicleYear] = useState(currentUser?.vehicle?.year?.toString() || '');
  const [licensePlate, setLicensePlate] = useState(currentUser?.vehicle?.licensePlate || '');
  const [gearStorage, setGearStorage] = useState(currentUser?.vehicle?.gearStorage || '');
  const [passengerCapacity, setPassengerCapacity] = useState(currentUser?.vehicle?.passengerCapacity?.toString() || '4');
  const [gearCapacity, setGearCapacity] = useState(currentUser?.vehicle?.gearCapacity?.toString() || '4');
  const [vehicleMPG, setVehicleMPG] = useState(currentUser?.vehicle?.mpg?.toString() || '25');
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
    const isDriverRole = role !== 'rider';
    
    if (isDriverRole && (!vehicleMake || !vehicleModel || !vehicleYear)) {
      toast({ 
        title: 'Vehicle details required', 
        description: 'Please provide your car details (Year, Make, Model) to save as a driver.',
        variant: 'destructive'
      });
      return;
    }

    updateProfile({
      name,
      phone,
      bio,
      avatar,
      role: role as 'driver' | 'rider' | 'both',
      yearInSchool,
      major,
      sportPreference,
      favoriteMusic,
      vehicle: isDriverRole ? {
        make: vehicleMake,
        model: vehicleModel,
        color: vehicleColor,
        year: vehicleYear ? parseInt(vehicleYear) : undefined,
        licensePlate,
        gearStorage,
        passengerCapacity: parseInt(passengerCapacity),
        gearCapacity: parseInt(gearCapacity),
        mpg: vehicleMPG ? parseFloat(vehicleMPG) : undefined,
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

                    {/* New Profile Fields */}
                    <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        School Info
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Year in School</Label>
                          <Select value={yearInSchool} onValueChange={setYearInSchool}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Freshman">Freshman</SelectItem>
                              <SelectItem value="Sophomore">Sophomore</SelectItem>
                              <SelectItem value="Junior">Junior</SelectItem>
                              <SelectItem value="Senior">Senior</SelectItem>
                              <SelectItem value="Graduate">Graduate</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Major</Label>
                          <Input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="e.g., Computer Science" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium flex items-center gap-2">
                        <Snowflake className="h-4 w-4" />
                        Preferences
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Ski/Snowboard</Label>
                          <Select value={sportPreference} onValueChange={setSportPreference}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ski">Ski</SelectItem>
                              <SelectItem value="Snowboard">Snowboard</SelectItem>
                              <SelectItem value="Both">Both</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1">
                            <Music className="h-3 w-3" />
                            Favorite Music
                          </Label>
                          <Input value={favoriteMusic} onChange={(e) => setFavoriteMusic(e.target.value)} placeholder="e.g., Rock, Hip-hop, Country" />
                        </div>
                      </div>
                    </div>

                    {role !== 'rider' && (
                      <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                        <h4 className="font-medium flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Vehicle Info
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Input 
                              type="number" 
                              value={vehicleYear} 
                              onChange={(e) => setVehicleYear(e.target.value)} 
                              placeholder="e.g., 2020"
                              min="1990"
                              max={new Date().getFullYear() + 1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Make</Label>
                            <Input value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} placeholder="e.g., Toyota" />
                          </div>
                          <div className="space-y-2">
                            <Label>Model</Label>
                            <Input value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="e.g., 4Runner" />
                          </div>
                          <div className="space-y-2">
                            <Label>Color</Label>
                            <Input value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} placeholder="e.g., White" />
                          </div>
                          <div className="space-y-2">
                            <Label>License Plate (Private)</Label>
                            <Input value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} placeholder="e.g., ABC-123" />
                            <p className="text-xs text-muted-foreground">Only visible to you</p>
                          </div>
                          <div className="space-y-2">
                            <Label>Gear Storage</Label>
                            <Select value={gearStorage} onValueChange={setGearStorage}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Ski Rack">Ski Rack</SelectItem>
                                <SelectItem value="Back of Car">Back of Car</SelectItem>
                                <SelectItem value="Roof Box">Roof Box</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
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
                          <div className="space-y-2">
                            <Label>Gear Spots</Label>
                            <Select value={gearCapacity} onValueChange={setGearCapacity}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Vehicle MPG</Label>
                            <Input 
                              type="number" 
                              value={vehicleMPG} 
                              onChange={(e) => setVehicleMPG(e.target.value)} 
                              placeholder="e.g., 25"
                              min="1"
                              step="0.1"
                            />
                            <p className="text-xs text-muted-foreground">Used to estimate ride costs (Avg: 25)</p>
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

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Role</p>
                        <p className="font-medium capitalize">{currentUser.role}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Year in School</p>
                        <p className="font-medium">{currentUser.yearInSchool || 'Not set'}</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Major</p>
                        <p className="font-medium">{currentUser.major || 'Not set'}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Ski/Snowboard</p>
                        <p className="font-medium">{currentUser.sportPreference || 'Not set'}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Music className="h-4 w-4 text-primary" />
                        <p className="text-sm text-muted-foreground">Favorite Music</p>
                      </div>
                      <p className="font-medium">{currentUser.favoriteMusic || 'Not set'}</p>
                    </div>

                    {currentUser.vehicle && (
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-3">
                          <Car className="h-5 w-5 text-primary" />
                          <span className="font-medium">My Vehicle</span>
                        </div>
                        <p className="font-semibold text-lg mb-2">
                          {currentUser.vehicle.year && `${currentUser.vehicle.year} `}
                          {currentUser.vehicle.color} {currentUser.vehicle.make} {currentUser.vehicle.model}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>{currentUser.vehicle.passengerCapacity} passenger seats</span>
                          <span>{currentUser.vehicle.gearCapacity} gear spots</span>
                          {currentUser.vehicle.gearStorage && <span>Gear: {currentUser.vehicle.gearStorage}</span>}
                        </div>
                        {currentUser.vehicle.licensePlate && (
                          <p className="text-sm text-muted-foreground mt-2">
                            License Plate: <span className="font-medium">{currentUser.vehicle.licensePlate}</span>
                            <span className="text-xs ml-2">(only visible to you)</span>
                          </p>
                        )}
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