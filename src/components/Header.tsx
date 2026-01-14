import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, Car, Search, MessageSquare, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import {useInstallPrompt} from "@/hooks/useInstallPrompt";

<img
  src = "/logo.png"
  alt="Waypoint"
  className="h-6 w-6 object-contain"
  draggable={false}
/>


export function Header() {
  const { currentUser, isAuthenticated, logout } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { install, hasPrompt} = useInstallPrompt();

  const navLinks = [
    { href: '/rides', label: 'Find a Ride', icon: Search },
    { href: '/post-ride', label: 'Share the Stoke', icon: Car },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Waypoint"
              className="h-6 w-6 object-contain"
            />
           <span className="font-bold">Waypoint</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block text-foreground group-hover:text-primary transition-colors">
            Waypoint
          </span>
        </Link>

        {/* Desktop Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={isActive(link.href) ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}

        {/* Auth/User Section */}
        <div className="flex items-center gap-3">
        <Button
  variant="ghost"
  size="sm"
  onClick={() => {
    if (hasPrompt) {
      install();
    } else {
      alert(
        "To install Waypoint:\n\n" +
        "• Chrome / Edge: Menu → More Tools → Install App\n" +
        "• iPhone: Share → Add to Home Screen"
      );
    }
  }}
>
  Install App
</Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {currentUser?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{currentUser?.name}</span>
                    <span className="text-xs text-muted-foreground">{currentUser?.school}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-rides" className="flex items-center gap-2 cursor-pointer">
                    <Car className="h-4 w-4" />
                    My Rides
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button variant="gradient" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-up">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive(link.href) ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
