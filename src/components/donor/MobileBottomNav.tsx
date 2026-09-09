import React from 'react';
import { Home, Droplet, Bell, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'overview' | 'requests' | 'history';
  setActiveTab: (tab: 'overview' | 'requests' | 'history') => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadNotificationsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNotifications,
  onOpenProfile,
  unreadNotificationsCount = 0,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 py-1 flex items-center justify-around">
      <button
        onClick={() => setActiveTab('overview')}
        className={`flex flex-col items-center justify-center min-h-[48px] px-3 py-1 rounded-xl transition-colors ${
          activeTab === 'overview' ? 'text-red-700 font-bold' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      <button
        onClick={() => setActiveTab('requests')}
        className={`flex flex-col items-center justify-center min-h-[48px] px-3 py-1 rounded-xl transition-colors ${
          activeTab === 'requests' ? 'text-red-700 font-bold' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Droplet className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Requests</span>
      </button>

      <button
        onClick={onOpenNotifications}
        className="relative flex flex-col items-center justify-center min-h-[48px] px-3 py-1 rounded-xl text-stone-500 hover:text-stone-800 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
        )}
        <span className="text-[10px] mt-0.5">Notifications</span>
      </button>

      <button
        onClick={onOpenProfile}
        className="flex flex-col items-center justify-center min-h-[48px] px-3 py-1 rounded-xl text-stone-500 hover:text-stone-800 transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>
    </div>
  );
};
