import React from 'react';
import { Home, Clock, BarChart2, Menu, Plus } from 'lucide-react';

export function BottomNav({ activeTab, onTabChange, onAddClick }: any) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-2 pb-6 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-50">
      <div className="flex items-center justify-between relative px-2">
        <NavItem icon={<Home className="w-6 h-6" />} label="Home" active={activeTab === 'Home'} onClick={() => onTabChange('Home')} />
        <NavItem icon={<Clock className="w-6 h-6" />} label="Expenses" active={activeTab === 'Expenses'} onClick={() => onTabChange('Expenses')} />

        {/* Center Add Button */}
        <div className="relative -top-6 flex flex-col items-center justify-center w-[72px]">
          <button onClick={onAddClick} className="bg-[#5c40e8] w-[56px] h-[56px] rounded-full shadow-lg shadow-indigo-200 text-white flex items-center justify-center ring-[6px] ring-white transition-transform hover:scale-105 active:scale-95">
            <Plus className="w-8 h-8" strokeWidth={2.5} />
          </button>
          <span className="absolute -bottom-5 text-[11px] font-semibold text-slate-500">Add</span>
        </div>

        <NavItem icon={<BarChart2 className="w-6 h-6" />} label="Analytics" active={activeTab === 'Analytics'} onClick={() => onTabChange('Analytics')} />
        <NavItem icon={<Menu className="w-6 h-6" />} label="More" active={activeTab === 'More'} onClick={() => onTabChange('More')} />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 mt-2 w-16 transition-colors group">
      <div className={`p-2 rounded-[14px] transition-colors ${active ? 'bg-[#f0ebff] text-[#5c40e8]' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-[#5c40e8]' : 'text-slate-500 group-hover:text-slate-600'}`}>{label}</span>
    </button>
  );
}

