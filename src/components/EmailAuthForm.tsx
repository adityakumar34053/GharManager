import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface EmailAuthFormProps {
  onSuccess: (uid: string) => void;
  currentLocalData?: {
    transactions: any[];
    rationItems: any[];
    goals: any[];
    bills: any[];
    budget: number | null;
    profile: any;
    quickActions: any[];
  };
  onClose?: () => void;
}

export function EmailAuthForm({ onSuccess, currentLocalData, onClose }: EmailAuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'signup') {
        // 1. Create firebase user
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        // 2. Prepare initial user document
        const backupProfile = {
          name: name.trim(),
          avatarUrl: currentLocalData?.profile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
          email: email.trim(),
          currency: currentLocalData?.profile?.currency || 'INR',
          joinedDate: new Date().toISOString(),
          householdId: currentLocalData?.profile?.householdId || ''
        };

        const userPayload = {
          profile: backupProfile,
          transactions: currentLocalData?.transactions?.map((t: any) => ({
            ...t,
            date: typeof t.date === 'string' ? t.date : t.date?.toISOString() || new Date().toISOString()
          })) || [],
          rationItems: currentLocalData?.rationItems || [],
          goals: currentLocalData?.goals || [],
          bills: currentLocalData?.bills || [],
          budget: currentLocalData?.budget !== undefined ? currentLocalData.budget : null,
          quickActions: currentLocalData?.quickActions || [],
          updatedAt: new Date().toISOString()
        };

        // 3. Save to Firestore
        await setDoc(doc(db, 'users', user.uid), userPayload);
        
        onSuccess(user.uid);
      } else {
        // Mode is login
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        onSuccess(userCredential.user.uid);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let friendlyMessage = 'Authentication failed. Please try again.';
      
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email is already registered. Please login instead.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'The email address is badly formatted.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'The password is too weak.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Incorrect email or password.';
      } else if (err.code === 'auth/network-request-failed') {
        friendlyMessage = 'Network error. Please check your internet connection.';
      }
      
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5 bg-white p-2 rounded-2xl">
      <div className="text-center">
        <h3 className="text-xl font-extrabold text-slate-800">
          {mode === 'login' ? 'Welcome Back!' : 'Create Backup Account'}
        </h3>
        <p className="text-slate-500 text-xs font-semibold mt-1 max-w-[280px] mx-auto">
          {mode === 'login' 
            ? 'Login with your email to restore your previous data' 
            : 'Register to securely backup and sync your expenses and bills'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {mode === 'signup' && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Rohit Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-700 font-bold outline-none focus:border-[#5c40e8] transition-all text-sm"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="your@email.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-700 font-bold outline-none focus:border-[#5c40e8] transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-700 font-bold outline-none focus:border-[#5c40e8] transition-all text-sm"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-xs text-rose-500 font-bold bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 text-center">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3.5 bg-[#5c40e8] text-white font-extrabold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-75"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {mode === 'login' ? 'Login' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100">
        <button 
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError(null);
          }}
          className="text-xs font-extrabold text-[#5c40e8] hover:underline"
        >
          {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
      </div>

      {onClose && (
        <button 
          onClick={onClose} 
          className="w-full py-2.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200"
        >
          Back
        </button>
      )}
    </div>
  );
}
