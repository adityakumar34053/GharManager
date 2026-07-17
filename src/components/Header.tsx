import { Search, Bell, Hexagon } from 'lucide-react';
import { UserProfile } from '../types';

export function Header({ onProfileClick, profile, onAction }: { onProfileClick?: () => void, profile?: UserProfile, onAction?: (action: string) => void }) {
  return (
    <header className="flex items-center justify-between px-5 pt-2 pb-3 bg-white sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#5c40e8] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-indigo-200 relative overflow-hidden">
          <Hexagon className="w-8 h-8 absolute fill-white/20 text-transparent" />
          <span className="relative z-10">G</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-slate-900 text-[17px] leading-tight tracking-tight">GharManager</h1>
          </div>
          <p className="text-[12px] text-slate-500 font-medium">Hi, {profile?.name || 'User'}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => onAction?.('Search')} className="text-slate-800 hover:text-indigo-600 transition-colors">
          <Search className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div className="relative">
          <button onClick={() => onAction?.('Notifications')} className="text-slate-800 hover:text-indigo-600 transition-colors">
            <Bell className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5c40e8] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-[2px] border-white">
            3
          </span>
        </div>
        <img 
          onClick={onProfileClick}
          src={profile?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"} 
          alt="Profile" 
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity" 
        />
      </div>
    </header>
  );
}
