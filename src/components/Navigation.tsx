import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Video, Search, User, LogOut, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Search },
    { path: '/contribute', label: 'Contribute', icon: Video },
    { path: '/dashboard', label: 'Dashboard', icon: Search }
  ];

  const NavLink = ({ path, label, icon: Icon }: { path: string; label: string; icon: any }) => (
    <Link
      to={path}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isActive(path)
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Video className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:block">
              SignCorpus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/profile')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">{user.username}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block ml-2">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="shadow-custom-sm">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-2 pb-4 border-b border-border">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl text-foreground">
                      SignCorpus
                    </span>
                  </div>
                  
                  {navItems.map((item) => (
                    <NavLink key={item.path} {...item} />
                  ))}
                  
                  {user && (
                    <div className="pt-4 border-t border-border space-y-2">
                      <NavLink path="/profile" label={`Profile (${user.username})`} icon={User} />
                      <Button
                        variant="ghost"
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full justify-start text-muted-foreground hover:text-foreground"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;