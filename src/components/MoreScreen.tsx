import React from 'react';
import { Settings, HelpCircle, FileText, LogOut, ChevronRight, Shield, Bell, CreditCard, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { usePwaInstall } from '../hooks/usePwaInstall';

export function MoreScreen({ onAction }: { onAction?: (action: string) => void }) {
  const { isInstallable, installPwa } = usePwaInstall();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-32 px-5 pt-4">
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight mb-6">Menu</h2>
      
      {isInstallable && (
        <div className="bg-gradient-to-r from-[#5c40e8] to-[#7c63f7] rounded-[24px] p-5 mb-6 text-white shadow-lg shadow-indigo-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-base">Install App</h3>
              <p className="text-white/80 text-xs font-medium mt-0.5 leading-tight">Install GharManager on your device for quick access and offline support.</p>
            </div>
          </div>
          <button 
            onClick={installPwa}
            className="w-full mt-4 py-3 bg-white text-[#5c40e8] font-extrabold rounded-xl text-sm hover:bg-slate-50 transition-colors active:scale-95"
          >
            Download / Install
          </button>
        </div>
      )}

      <div className="bg-white rounded-[24px] shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-6">
        <MenuItem icon={<Settings className="w-5 h-5 text-slate-500" />} label="General Settings" onClick={() => onAction?.('Settings')} />
        <MenuItem icon={<Shield className="w-5 h-5 text-slate-500" />} label="Security & Privacy" onClick={() => onAction?.('SecurityPrivacy')} />
        <MenuItem icon={<Bell className="w-5 h-5 text-slate-500" />} label="Notifications" onClick={() => onAction?.('Notifications')} />
        <MenuItem icon={<CreditCard className="w-5 h-5 text-slate-500" />} label="Payment Methods" isLast onClick={() => onAction?.('PaymentMethods')} />
      </div>
      <div className="bg-white rounded-[24px] shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-6">
        <MenuItem icon={<FileText className="w-5 h-5 text-slate-500" />} label="Export Data" onClick={() => onAction?.('ExportData')} />
        <MenuItem icon={<FileText className="w-5 h-5 text-slate-500" />} label="Backup & Restore" onClick={() => onAction?.('BackupRestore')} />
        <MenuItem icon={<HelpCircle className="w-5 h-5 text-slate-500" />} label="Help & Support" isLast onClick={() => onAction?.('HelpSupport')} />
      </div>
      <button onClick={() => onAction?.('Logout')} className="w-full flex items-center justify-center gap-2 py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl active:scale-[0.98] transition-transform">
        <LogOut className="w-5 h-5" />
        Log Out
      </button>
      <div className="text-center mt-8">
        <p className="text-[12px] font-bold text-slate-400">GharManager Pro v2.4.1</p>
      </div>
    </motion.div>
  );
}

function MenuItem({ icon, label, isLast, onClick }: { icon: React.ReactNode, label: string, isLast?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors active:bg-slate-100 ${!isLast ? 'border-b border-slate-100' : ''}`}>
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
          {icon}
        </div>
        <span className="font-bold text-slate-700 text-[15px]">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300" />
    </button>
  );
}
