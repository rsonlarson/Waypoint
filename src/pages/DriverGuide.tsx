import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Timer,
  Bell,
  Car,
  MessageSquare,
} from 'lucide-react';
import { Brand } from "@/components/Brand";


export default function DriverGuide() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <Link to="/post-ride">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Post Ride
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl gradient-mountain mb-4">
              <Brand />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Driver's Guide</h1>
            <p className="text-muted-foreground">
              Everything you need to know about managing your ride
            </p>
          </div>

          <div className="space-y-6">
            {/* Overview */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Ride Lifecycle Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  As a driver, you're responsible for coordinating the pickup and return of your
                  riders. Here's how the process works from start to finish.
                </p>
                <div className="grid gap-3">
                  {[
                    { step: 1, title: 'Post Your Ride', desc: 'Set destination, times, and capacity' },
                    { step: 2, title: 'Accept Riders', desc: 'Review and approve ride requests' },
                    { step: 3, title: 'Pickup Window', desc: '16-minute window to gather everyone' },
                    { step: 4, title: 'Confirm Attendance', desc: 'Mark who showed up' },
                    { step: 5, title: 'Hit the Slopes', desc: 'Enjoy the mountain!' },
                    { step: 6, title: 'Return Pickup', desc: 'Gather crew for the ride home' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="h-8 w-8 rounded-full gradient-mountain flex items-center justify-center text-sm font-bold text-primary-foreground">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pickup Window */}
            <Card className="shadow-card border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  The 16-Minute Pickup Window
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="font-medium text-foreground mb-2">How it works:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Bell className="h-4 w-4 mt-0.5 text-accent" />
                      <span>
                        16 minutes before departure, both you and your riders will receive a notification
                        that the pickup window has started.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 mt-0.5 text-accent" />
                      <span>
                        Use this time to arrive at the pickup location and wait for all riders to gather.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-accent" />
                      <span>
                        Once everyone is present, confirm attendance in the app to start the ride.
                      </span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  The pickup window gives everyone a buffer to arrive without stress. Be patient, but
                  also respect everyone's time!
                </p>
              </CardContent>
            </Card>

            {/* Confirming Riders */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Confirming Rider Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  When the pickup window starts, you'll see a checklist of all accepted riders.
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-evergreen/10 border border-evergreen/20">
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-evergreen" />
                      Mark as Present
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check off each rider as they arrive. You can also use "All Present" if everyone shows up.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Handle No-Shows
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      If a rider doesn't show up, you can:
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 ml-4 list-disc space-y-1">
                      <li>Wait a bit longer (if within the window)</li>
                      <li>Mark them as no-show and proceed</li>
                      <li>Remove them from the ride entirely</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ride Timing */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Ride Duration Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Once you confirm all riders and start the ride, we'll track the duration for your records.
                  This helps with planning future trips and understanding travel times.
                </p>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> The timer runs privately and won't
                    distract you during your ski day. It's just for analytics!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Return Trip */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brand/>
                  Return Trip
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The return trip follows the same process as the departure:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Bell className="h-4 w-4 mt-0.5 text-primary" />
                    <span>
                      You'll get a notification 16 minutes before the scheduled return time.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-primary" />
                    <span>
                      <strong>Need more time?</strong> You can adjust the return time directly from the
                      notification if skiing conditions are too good to leave!
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Confirm all riders are present before heading home.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Communication Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-lg">💬</span>
                    <span>Use the in-app chat to coordinate with your riders before the trip.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">📍</span>
                    <span>Share specific pickup details (exact spot, what your car looks like, etc.).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">⏰</span>
                    <span>Give riders a heads up if you're running early or late.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">🎿</span>
                    <span>Discuss plans for the day so everyone's on the same page!</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="text-center pt-6">
              <Link to="/post-ride">
                <Button variant="gradient" size="lg">
                  Ready to Post Your Ride
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
