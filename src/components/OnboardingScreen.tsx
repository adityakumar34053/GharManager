import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, ArrowRight, Wallet, CloudLightning } from 'lucide-react';
import { UserProfile } from '../types';
import { EmailAuthForm } from './EmailAuthForm';

export function OnboardingScreen({ onComplete, onRestoreSuccess }: { onComplete: (profile: UserProfile) => void, onRestoreSuccess: (uid: string) => void }) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (name.trim()) {
      onComplete({
        name: name.trim(),
        avatarUrl: imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
      });
    }
  };

  if (showEmailAuth) {
    return (
      <div className="flex flex-col h-full bg-white px-6 py-10 justify-center">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#5c40e8] flex items-center justify-center shadow-md">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">GharManager</h1>
        </div>
        <EmailAuthForm 
          onSuccess={onRestoreSuccess} 
          onClose={() => setShowEmailAuth(false)} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white px-6 py-10 justify-between overflow-y-auto hide-scrollbar">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mt-4">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#5c40e8] flex items-center justify-center shadow-lg shadow-indigo-200">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">GharManager</h1>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Welcome! Let's get started</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Set up your profile to personalize your experience.</p>
        </div>

        <div className="flex flex-col items-center pt-2">
          <div className="relative">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Profile" 
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl" 
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center text-slate-400">
                <Camera className="w-8 h-8" />
              </div>
            )}
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="absolute bottom-1 right-1 w-9 h-9 bg-[#5c40e8] text-white shadow-md border-2 border-white rounded-full flex items-center justify-center hover:bg-[#4b28e3] transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
          <p className="text-xs text-slate-400 mt-4 font-bold uppercase tracking-wider">Profile Photo (Optional)</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Your Full Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. Rohit Sharma"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold outline-none focus:border-[#5c40e8] focus:ring-4 focus:ring-indigo-50/50 transition-all text-lg" 
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pb-4 space-y-4 mt-6">
        <button 
          onClick={handleContinue} 
          disabled={!name.trim()}
          className={`w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all ${name.trim() ? 'bg-[#5c40e8] text-white shadow-lg shadow-indigo-200 active:scale-[0.98]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          Continue to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setShowEmailAuth(true)}
          className="w-full py-3.5 bg-indigo-50 hover:bg-indigo-100/70 text-[#5c40e8] font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
        >
          <CloudLightning className="w-4.5 h-4.5 text-[#5c40e8]" />
          Login to Restore Backup
        </button>
      </motion.div>
    </div>
  );
}
