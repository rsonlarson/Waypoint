import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LiabilityWaiver } from '@/components/LiabilityWaiver';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Car, User, Mail, CheckCircle } from 'lucide-react';
import { Brand } from "@/components/Brand";



export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(searchParams.get('signup') === 'true');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<'driver' | 'rider' | 'both'>('rider');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [passengerCapacity, setPassengerCapacity] = useState('4');
  const [gearCapacity, setGearCapacity] = useState('4');
  const [signupWaiverAccepted, setSignupWaiverAccepted] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email_confirmed_at) {
        navigate('/rides');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email_confirmed_at) {
        navigate('/rides');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'Ready to hit the slopes? 🎿'
      });
      navigate('/rides');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!email.endsWith('.edu')) {
      toast({
        title: 'Invalid email',
        description: 'Please use your college .edu email address.',
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          school,
          phone,
          bio,
          role,
          vehicle_make: role !== 'rider' ? vehicleMake : null,
          vehicle_model: role !== 'rider' ? vehicleModel : null,
          vehicle_color: role !== 'rider' ? vehicleColor : null,
          passenger_capacity: role !== 'rider' ? parseInt(passengerCapacity) : null,
          gear_capacity: role !== 'rider' ? parseInt(gearCapacity) : null,
        }
      }
    });
    
    if (error) {
      toast({
        title: 'Signup failed',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      setShowVerification(true);
    }
    setLoading(false);
  };

  const renderVerificationScreen = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-10 w-10 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
        <p className="text-muted-foreground">
          We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-primary" />
          <span>Click the link in your email to verify your account</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-primary" />
          <span>You'll be redirected back to Waypoint</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Didn't receive the email? Check your spam folder or{' '}
        <button 
          type="button"
          onClick={() => setShowVerification(false)}
          className="text-primary hover:underline font-medium"
        >
          try again
        </button>
      </p>
    </div>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          placeholder="you@mines.edu" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="••••••••" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
      </div>
      <Button type="submit" className="w-full" variant="gradient" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );

  const renderSignupStep1 = () => (
    <form onSubmit={e => { e.preventDefault(); setStep(2); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">College Email</Label>
        <Input 
          id="signup-email" 
          type="email" 
          placeholder="you@mines.edu" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <p className="text-xs text-muted-foreground">Must be a .edu email address</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input 
          id="signup-password" 
          type="password" 
          placeholder="Create a password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          minLength={6} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          placeholder="Your name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="school">School</Label>
        <Select value={school} onValueChange={setSchool} required>
          <SelectTrigger>
            <SelectValue placeholder="Select your school" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Colorado School of Mines">Colorado School of Mines</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <LiabilityWaiver 
        type="signup" 
        checked={signupWaiverAccepted} 
        onCheckedChange={setSignupWaiverAccepted} 
      />
      <Button type="submit" className="w-full" variant="gradient" disabled={!signupWaiverAccepted}>
        Continue
      </Button>
    </form>
  );

  const renderSignupStep2 = () => (
    <form onSubmit={e => { e.preventDefault(); role === 'rider' ? handleSignup(e) : setStep(3); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          type="tel" 
          placeholder="(303) 555-0123" 
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          placeholder="Tell us about yourself - skiing experience, what you're looking for..." 
          value={bio} 
          onChange={e => setBio(e.target.value)} 
          rows={3} 
        />
      </div>
      <div className="space-y-3">
        <Label>I want to...</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: 'rider', label: 'Find Rides', icon: User, desc: 'I need rides to the mountain' },
            { value: 'driver', label: 'Offer Rides', icon: Car, desc: 'I have a car and want to drive' },
            { value: 'both', label: 'Both', icon: Brand, desc: 'I can do both!' }
          ].map(option => (
            <button 
              key={option.value} 
              type="button" 
              onClick={() => setRole(option.value as typeof role)} 
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                role === option.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                role === option.value ? 'gradient-mountain' : 'bg-muted'
              }`}>
                <option.icon className={`h-5 w-5 ${role === option.value ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-medium text-foreground">{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button type="submit" variant="gradient" className="flex-1" disabled={loading}>
          {loading ? 'Creating...' : role === 'rider' ? 'Complete Signup' : 'Add Vehicle Info'}
        </Button>
      </div>
    </form>
  );

  const renderSignupStep3 = () => (
    <form onSubmit={handleSignup} className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Add your vehicle details so riders know what to expect.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input id="make" placeholder="Subaru" value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" placeholder="Outback" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input id="color" placeholder="Blue" value={vehicleColor} onChange={e => setVehicleColor(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="passengers">Passenger Seats</Label>
          <Select value={passengerCapacity} onValueChange={setPassengerCapacity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gear">Gear Capacity</Label>
          <Select value={gearCapacity} onValueChange={setGearCapacity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <SelectItem key={n} value={n.toString()}>{n} skis/boards</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button type="submit" variant="gradient" className="flex-1" disabled={loading}>
          {loading ? 'Creating account...' : 'Complete Signup'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-4">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <Brand />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center">
            {!showVerification && (
              <>
                <CardTitle className="text-2xl">
                  {isSignup 
                    ? step === 1 ? 'Create your account' 
                    : step === 2 ? 'Tell us about you' 
                    : 'Vehicle details' 
                    : 'Welcome back'}
                </CardTitle>
                <CardDescription>
                  {isSignup 
                    ? step === 1 ? 'Join the Colorado ski carpool community' 
                    : step === 2 ? 'Help us connect you with the right crew' 
                    : 'Almost there! Add your ride info' 
                    : 'Sign in to find your next ride'}
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {showVerification 
              ? renderVerificationScreen()
              : isSignup 
                ? step === 1 ? renderSignupStep1() 
                : step === 2 ? renderSignupStep2() 
                : renderSignupStep3() 
                : renderLoginForm()}

            {!showVerification && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}
                  <button 
                    type="button" 
                    onClick={() => { setIsSignup(!isSignup); setStep(1); }} 
                    className="ml-1 text-primary hover:underline font-medium"
                  >
                    {isSignup ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
