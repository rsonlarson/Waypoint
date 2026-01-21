import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { RideCard } from '@/components/RideCard';
import { StatsSection } from '@/components/StatsSection';
import { useApp } from '@/context/AppContext';
import { Mountain, Snowflake, Users, Shield, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-carpool.jpg';
import { Brand } from "@/components/Brand";

export default function Index() {
  const { rides, isAuthenticated } = useApp();
  const { install, hasPrompt } = useInstallPrompt();
  const featuredRides = rides.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Students carpooling to ski resort" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>
        {/* Decorative blurs */}
        <div className="absolute top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up">
              Find Your{' '}
              <span className="text-gradient">Powder Crew</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Connect with fellow college students heading to the slopes. Share the ride, split the costs, and make friends along the way.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              {isAuthenticated ? (
                <>
                  <Link to="/rides">
                    <Button size="xl" variant="gradient" className="gap-2">
                      Find a Ride
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/post-ride">
                    <Button size="xl" variant="outline">
                      Share the Stoke
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth?signup=true">
                    <Button size="xl" variant="gradient" className="gap-2">
                      Get Started Free
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="xl" variant="outline">
                      I have an account
                    </Button>
                  </Link>
                    <Button
                      size="xl"
                      variant="secondary"
                      onClick={() => {
                        if (hasPrompt){
                          install();
                        } else{
                          alert(
                            "To install Waypoint:\n\n" +
                            "• On Chrome/Edge: use the browser menu → Install App\n" +
                            "• On iPhone: Share → Add to Home Screen"
                          );
                        }
                      }}
                    >
                      Install App
                    </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Rides */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Upcoming Rides
              </h2>
              <p className="text-muted-foreground">Discover who else is hitting the slopes</p>
            </div>
            <Link to="/rides">
              <Button variant="ghost" className="gap-2">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRides.map((ride, index) => (
              <div
                key={ride.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <RideCard ride={ride} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get to the mountain in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Create Your Profile',
                description: 'Sign up with your .edu email and tell us about yourself. Are you a driver, rider, or both?',
              },
              {
                icon: Mountain,
                title: 'Find or Post a Ride',
                description: 'Browse available rides to your favorite resort or post your own trip and pick your crew.',
              },
              {
                icon: Shield,
                title: 'Hit the Slopes',
                description: 'Connect with your carpool, split the costs, and enjoy fresh powder with new friends.',
              },
            ].map((step, index) => (
              <div
                key={step.title}
                className="text-center p-6 rounded-xl bg-card border border-border/50 shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="h-14 w-14 rounded-xl gradient-mountain flex items-center justify-center">
                    <step.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl gradient-mountain p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to hit the mountain?
              </h2>
              <p className="text-primary-foreground/80 mb-6 text-lg">
                Join hundreds of students already carpooling to Colorado's best ski resorts.
              </p>
              <Link to={isAuthenticated ? '/rides' : '/auth?signup=true'}>
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                  {isAuthenticated ? 'Find Your Ride' : 'Join Waypoint'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex justify-center mb-8 ">
                <Brand size={32} textSize='text-lg' />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Waypoint. Made with ❄️ in Colorado.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
