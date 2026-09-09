import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplet, Menu, X, Shield, User, Heart, PlusCircle, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Container } from '../ui/Container';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  currentRole?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, role, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E7E5E4] py-3 shadow-xs'
          : 'bg-[#FAFAF8] py-4 border-b border-[#E7E5E4]/60'
      }`}
    >
      <Container className="flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#C62828] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Droplet className="w-5.5 h-5.5 fill-white text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-extrabold tracking-tight text-[#171717] group-hover:text-[#C62828] transition-colors">
              BloodConnect
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#737373] -mt-1">
              Verified Coordination
            </span>
          </div>
        </Link>

        {/* Navigation Tabs (When Logged In) */}
        {user ? (
          <nav className="hidden md:flex items-center gap-2 text-xs font-bold bg-stone-100 p-1 rounded-xl border border-stone-200">
            <Link
              to="/donor"
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/donor')
                  ? 'bg-white text-[#C62828] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-[#C62828]" />
              Donor Workspace
            </Link>

            <Link
              to="/request"
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/request')
                  ? 'bg-white text-[#C62828] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Requester Workspace
            </Link>

            <Link
              to="/admin"
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/admin')
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Center
            </Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#525252]">
            <a href="/#how-it-works" className="hover:text-[#171717] transition-colors">
              How It Works
            </a>
            <a href="/#why-bloodconnect" className="hover:text-[#171717] transition-colors">
              Why BloodConnect
            </a>
            <a href="/#blood-groups" className="hover:text-[#171717] transition-colors">
              Blood Groups
            </a>
            <a href="/#faq" className="hover:text-[#171717] transition-colors">
              FAQ
            </a>
          </nav>
        )}

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <NotificationCenter />
              <div className="h-4 w-px bg-stone-200" />
              <span className="text-xs text-stone-500 font-semibold truncate max-w-[120px]">
                {profile?.full_name || user.email?.split('@')[0]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="text-stone-600 hover:text-stone-900 text-xs gap-1 border-stone-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-[#525252] hover:text-[#171717]">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button variant="default" size="sm" className="bg-[#C62828] hover:bg-[#8F1D2C] text-white shadow-xs">
                  Donate Blood
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#171717] hover:bg-[#F4F3F0] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAFAF8] border-b border-[#E7E5E4] px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200 text-left">
          {user ? (
            <div className="flex flex-col space-y-2">
              <Link
                to="/donor"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-white border border-stone-200 font-bold text-stone-900 flex items-center gap-2 text-xs"
              >
                <Heart className="w-4 h-4 text-red-700 fill-red-700" />
                Donor Workspace
              </Link>
              <Link
                to="/request"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-white border border-stone-200 font-bold text-stone-900 flex items-center gap-2 text-xs"
              >
                <PlusCircle className="w-4 h-4 text-amber-700" />
                Requester Workspace
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-stone-900 text-white font-bold flex items-center gap-2 text-xs"
              >
                <Shield className="w-4 h-4" />
                Admin Control Center
              </Link>

              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2 text-xs text-red-700 font-bold border border-red-200 rounded-lg text-center bg-red-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 font-semibold text-[#171717]">
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?mode=register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full justify-center bg-[#C62828]">
                  Donate Blood
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
