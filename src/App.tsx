import { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { BottomNav } from './components/BottomNav';
import { ActionModal } from './components/ActionModal';
import { TransactionsScreen } from './components/TransactionsScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { MoreScreen } from './components/MoreScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Transaction, UserProfile, RationItem, QuickActionState, Goal, Bill } from './types';
import { signInHidden, db, auth } from './lib/firebase';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const loadState = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(() => loadState('gm_isOnboarded', false));
  const [isDarkMode, setIsDarkMode] = useState(() => loadState('gm_isDarkMode', false));
  const [activeTab, setActiveTab] = useState('Home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('gm_transactions', []));
  const [rationItems, setRationItems] = useState<RationItem[]>(() => loadState('gm_rationItems', []));
  const [goals, setGoals] = useState<Goal[]>(() => loadState('gm_goals', []));
  const [bills, setBills] = useState<Bill[]>(() => loadState('gm_bills', []));

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const filteredTransactionsByMonth = transactions.filter(tx => {
    const d = new Date(tx.date);
    if (!isNaN(d.getTime())) {
      const txMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return txMonth === selectedMonth;
    }
    return false;
  });
  
  const isRemoteUpdate = useRef(false);

  const [budget, setBudget] = useState<number | null>(() => loadState('gm_budget', null));
  const defaultQuickActions: QuickActionState[] = [
    { id: 'AddExpense', label: 'Add Expense', visible: true },
    { id: 'AddInvestment', label: 'Add Invest', visible: true },
    { id: 'VoiceEntry', label: 'Voice Entry', visible: true },
    { id: 'RationList', label: 'Ration List', visible: true },
    { id: 'AddIncome', label: 'Add Income', visible: true },
    { id: 'FamilySync', label: 'Family Sync', visible: true },
    { id: 'ReceiptScanner', label: 'Scan Receipt', visible: true },
    { id: 'Goals', label: 'Savings Goals', visible: true },
    { id: 'RationPredictor', label: 'AI Ration', visible: true }
  ];

  const [quickActions, setQuickActions] = useState<QuickActionState[]>(() => {
    const saved = loadState('gm_quickActions', defaultQuickActions);
    const merged = [...saved];
    defaultQuickActions.forEach(da => {
      if (!merged.find((m: any) => m.id === da.id)) {
        merged.push(da);
      }
    });
    return merged;
  });
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [profile, setProfile] = useState<UserProfile>(() => loadState('gm_profile', {
    name: '',
    avatarUrl: '',
    currency: 'INR'
  }));

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    signInHidden();
    
    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeAuth();
    };
  }, []);

  // Subscribe to Firebase if householdId exists
  useEffect(() => {
    if (!profile.householdId) return;
    
    const unsubscribe = onSnapshot(doc(db, 'households', profile.householdId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        isRemoteUpdate.current = true;
        
        if (data.transactions) {
           const parsedTx = data.transactions.map((tx: any) => ({
             ...tx,
             date: new Date(tx.date)
           }));
           setTransactions(parsedTx);
        }
        if (data.rationItems) setRationItems(data.rationItems);
        if (data.goals) setGoals(data.goals);
        if (data.bills) setBills(data.bills);
        
        setTimeout(() => { isRemoteUpdate.current = false; }, 100);
      }
    });

    return () => unsubscribe();
  }, [profile.householdId]);

  const syncData = async (data: any) => {
    if (isRemoteUpdate.current) return;
    
    setIsSyncing(true);
    try {
       // 1. Sync shared household data if householdId is active
       if (profile.householdId) {
         const payload = {
           transactions: data.transactions.map((t: any) => ({...t, date: t.date.toISOString()})),
           rationItems: data.rationItems,
           goals: data.goals,
           bills: data.bills
         };
         await setDoc(doc(db, 'households', profile.householdId), payload, { merge: true });
       }

       // 2. Sync full user backup if currentUser is logged in via email
       if (auth.currentUser && !auth.currentUser.isAnonymous) {
         const userPayload = {
           profile: profile,
           transactions: data.transactions.map((t: any) => ({...t, date: t.date.toISOString()})),
           rationItems: data.rationItems,
           goals: data.goals,
           bills: data.bills,
           budget: budget,
           quickActions: quickActions,
           updatedAt: new Date().toISOString()
         };
         await setDoc(doc(db, 'users', auth.currentUser.uid), userPayload, { merge: true });
       }
    } catch (error) {
       console.log('Firebase sync failed, saved locally', error);
    }
    setTimeout(() => setIsSyncing(false), 500);
  };

  const restoreUserData = async (uid: string) => {
    setIsSyncing(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.transactions) {
          setTransactions(data.transactions.map((t: any) => ({ ...t, date: new Date(t.date) })));
        } else {
          setTransactions([]);
        }
        if (data.rationItems) setRationItems(data.rationItems);
        else setRationItems([]);
        
        if (data.goals) setGoals(data.goals);
        else setGoals([]);
        
        if (data.bills) setBills(data.bills);
        else setBills([]);
        
        if (data.budget !== undefined) setBudget(data.budget);
        else setBudget(null);
        
        if (data.quickActions) setQuickActions(data.quickActions);
        
        if (data.profile) {
          setProfile(data.profile);
        }
        setIsOnboarded(true);
        setIsSyncing(false);
        return true;
      }
      setIsSyncing(false);
      return false;
    } catch (e) {
      console.error("Error restoring user data:", e);
      setIsSyncing(false);
      throw e;
    }
  };

  useEffect(() => {
    localStorage.setItem('gm_isOnboarded', JSON.stringify(isOnboarded));
    localStorage.setItem('gm_isDarkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('gm_transactions', JSON.stringify(transactions));
    localStorage.setItem('gm_rationItems', JSON.stringify(rationItems));
    localStorage.setItem('gm_goals', JSON.stringify(goals));
    localStorage.setItem('gm_bills', JSON.stringify(bills));
    localStorage.setItem('gm_budget', JSON.stringify(budget));
    localStorage.setItem('gm_quickActions', JSON.stringify(quickActions));
    localStorage.setItem('gm_profile', JSON.stringify(profile));

    if (isOnboarded) {
      syncData({ transactions, rationItems, goals, bills });
    }
  }, [isOnboarded, isDarkMode, transactions, rationItems, budget, quickActions, profile, goals, bills, currentUser]);

  // Local Notification System for Bills due within 3 days
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const checkAndNotifyBills = async () => {
      // Request permission if default
      if (Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch (e) {
          console.warn("Notification permission request failed or rejected:", e);
        }
      }

      if (Notification.permission === 'granted') {
        const today = new Date();
        today.setHours(0,0,0,0);

        const alertBills = bills.filter(bill => {
          if (bill.isPaid) return false;
          const due = new Date(bill.dueDate);
          due.setHours(0,0,0,0);
          const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays >= 0 && diffDays <= 3;
        });

        if (alertBills.length > 0) {
          alertBills.forEach(bill => {
            const due = new Date(bill.dueDate);
            due.setHours(0,0,0,0);
            const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            let daysText = `due in ${diffDays} days`;
            if (diffDays === 0) daysText = 'due today!';
            else if (diffDays === 1) daysText = 'due tomorrow!';

            try {
              new Notification('📅 Bill Due Soon Alert', {
                body: `Your bill "${bill.name}" of ₹${bill.amount} is ${daysText}`,
              });
            } catch (err) {
              console.warn("Could not fire standard browser Notification:", err);
            }
          });
        }
      }
    };

    if (isOnboarded && bills.length > 0) {
      checkAndNotifyBills();
    }
  }, [isOnboarded, bills]);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsOnboarded(true);
  };

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...transactionData } : t));
      setEditingTransaction(null);
    } else {
      const newTx: Transaction = {
        ...transactionData,
        id: Math.random().toString(36).substring(2, 9),
        date: new Date()
      };
      setTransactions(prev => [newTx, ...prev]);
    }
    setActiveModal(null);
  };

  const handlePurchaseRation = (item: RationItem, actualAmount: number) => {
    // Add to expenses directly
    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date(),
      type: 'Expense',
      amount: actualAmount,
      category: 'Groceries',
      note: `Ration: ${item.name}`
    };
    setTransactions(prev => [newTx, ...prev]);
    // Remove item from ration list
    setRationItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setActiveModal(tx.type === 'Income' ? 'AddIncome' : tx.type === 'Investment' ? 'AddInvestment' : 'AddExpense');
  };

  const handleSetBudget = (amount: number) => {
    setBudget(amount);
    setActiveModal(null);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setEditingTransaction(null);
  };

  return (
    <div className={`h-screen bg-slate-50 flex justify-center overflow-hidden font-sans ${isDarkMode ? 'dark-mode-app' : ''}`}>
      
      {/* App Container */}
      <div className="w-full max-w-md bg-white h-full relative flex flex-col shadow-2xl border-x border-slate-100 overflow-hidden">
        
        {!isOnboarded ? (
          <OnboardingScreen onComplete={handleOnboardingComplete} onRestoreSuccess={restoreUserData} />
        ) : (
          <>
            {(!isOnline || isSyncing) && (
              <div className={`px-4 py-1.5 flex items-center justify-center gap-2 text-xs font-bold shadow-sm z-50 ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5" />
                    Data Synced
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    Offline • Saved Locally
                  </>
                )}
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar relative bg-white pb-24">
              {activeTab === 'Home' && (
                <>
                  <Header onProfileClick={() => setActiveModal('Profile')} profile={profile} onAction={setActiveModal} />
                  <HomeDashboard 
                    onAction={setActiveModal} 
                    transactions={filteredTransactionsByMonth} 
                    budget={budget}
                    onDeleteTransaction={handleDeleteTransaction}
                    onEditTransaction={handleEditTransaction}
                    onTabChange={setActiveTab}
                    profile={profile}
                    quickActions={quickActions}
                    goals={goals}
                    bills={bills}
                  />
                </>
              )}
              {activeTab === 'Expenses' && (
                 <TransactionsScreen 
                   transactions={transactions} 
                   selectedMonth={selectedMonth}
                   setSelectedMonth={setSelectedMonth}
                   onDeleteTransaction={handleDeleteTransaction}
                   onEditTransaction={handleEditTransaction}
                 />
              )}
              {activeTab === 'Analytics' && <AnalyticsScreen transactions={filteredTransactionsByMonth} />}
              {activeTab === 'More' && <MoreScreen onAction={setActiveModal} />}
            </div>

            {/* Fixed Bottom Navigation */}
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onAddClick={() => setActiveModal('AddExpense')} />
            
            {/* Dynamic Action Modal */}
            <ActionModal 
              activeModal={activeModal} 
              onClose={handleCloseModal} 
              onAddTransaction={handleAddTransaction}
              onSetBudget={handleSetBudget}
              profile={profile}
              onUpdateProfile={setProfile}
              editingTransaction={editingTransaction}
              transactions={transactions}
              setTransactions={setTransactions}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              rationItems={rationItems}
              setRationItems={setRationItems}
              onPurchaseRation={handlePurchaseRation}
              quickActions={quickActions}
              setQuickActions={setQuickActions}
              goals={goals}
              setGoals={setGoals}
              bills={bills}
              setBills={setBills}
              onRestoreSuccess={restoreUserData}
            />
          </>
        )}
      </div>

    </div>
  );
}
