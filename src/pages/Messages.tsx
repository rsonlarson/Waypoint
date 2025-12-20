import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Snowflake } from 'lucide-react';
import { NotificationBanner } from '@/components/NotificationBanner';

export default function Messages() {
  const navigate = useNavigate();
  const { rides, currentUser, messages, sendMessage, isAuthenticated } = useApp();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  if (!isAuthenticated || !currentUser) {
    navigate('/auth');
    return null;
  }

  // Get rides where user is involved
  const myRides = useMemo(() => {
    return rides.filter(
      (ride) =>
        ride.driverId === currentUser.id ||
        ride.acceptedRiders.some((r) => r.id === currentUser.id)
    );
  }, [rides, currentUser.id]);

  const selectedRide = myRides.find((r) => r.id === selectedRideId);
  const rideMessages = messages.filter((m) => m.rideId === selectedRideId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRideId) return;

    sendMessage(selectedRideId, newMessage.trim());
    setNewMessage('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (myRides.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No conversations yet</h2>
            <p className="text-muted-foreground mb-4">
              Join or post a ride to start chatting with your crew
            </p>
            <Link to="/rides">
              <Button variant="gradient">Find a Ride</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <NotificationBanner variant="button" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Ride List */}
          <Card className="shadow-card lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Rides</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-border">
                  {myRides.map((ride) => (
                    <button
                      key={ride.id}
                      onClick={() => setSelectedRideId(ride.id)}
                      className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${
                        selectedRideId === ride.id ? 'bg-primary/5 border-l-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Snowflake className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{ride.destination}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(ride.departureDate)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="shadow-card lg:col-span-2 flex flex-col">
            {selectedRide ? (
              <>
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg gradient-mountain flex items-center justify-center">
                      <Snowflake className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedRide.destination}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedRide.departureDate)} · {selectedRide.acceptedRiders.length + 1} riders
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {rideMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      rideMessages.map((message) => {
                        const isOwn = message.senderId === currentUser.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.sender.avatar} />
                              <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={`max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
                              <div
                                className={`rounded-lg p-3 ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {message.sender.name} · {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-border">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" variant="gradient" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Select a ride to view messages</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
