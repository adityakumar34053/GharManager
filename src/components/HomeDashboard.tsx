import { Sparkles, Eye, ArrowUpRight, ArrowDownLeft, FileText, ScanLine, Mic, SplitSquareHorizontal, PlusSquare, Bot, Briefcase, BarChart2, Edit2, Trash2, Target, Calendar, Users } from 'lucide-react';
import { motion } from 'motion/react';

import { Transaction, UserProfile, Goal, Bill } from '../types';

export function HomeDashboard({ onAction, transactions = [], budget, onDeleteTransaction, onEditTransaction, onTabChange, profile, quickActions = [], goals = [], bills = [] }: { onAction: (action: string) => void, transactions?: Transaction[], budget?: number | null, onDeleteTransaction?: (id: string) => void, onEditTransaction?: (tx: Transaction) => void, onTabChange?: (tab: string) => void, profile?: UserProfile, quickActions?: any[], goals?: Goal[], bills?: Bill[] }) {
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const totalInvestment = transactions.filter(t => t.type === 'Investment').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalIncome - totalExpense - totalInvestment;
  
  const budgetProgress = budget ? Math.min((totalExpense / budget) * 100, 100) : 0;
  
  const savingsPercent = totalIncome > 0 ? ((currentBalance / totalIncome) * 100).toFixed(1) + '%' : '0.0%';
  const investmentPercent = totalIncome > 0 ? ((totalInvestment / totalIncome) * 100).toFixed(1) + '%' : '0.0%';
  const expensePercent = totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) + '%' : '0.0%';

  const firstName = profile?.name ? profile.name.split(' ')[0] : 'User';

  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 17) greeting = 'Good Afternoon';

  return (
    <div className="pb-[100px] px-5 space-y-6 pt-2">
       
       {/* Greeting */}
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
         <div>
           <h2 className="text-[22px] font-medium text-slate-800 tracking-tight">{greeting}, <span className="font-extrabold text-slate-900">{firstName}</span> 👋</h2>
           <p className="text-[13px] text-slate-500 font-medium">Here's your financial overview</p>
         </div>
         <button 
           onClick={() => onAction('AIInsights')} 
           className="bg-indigo-50 text-[#5c40e8] border border-indigo-100 px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1 shadow-sm hover:bg-indigo-100 transition-all active:scale-95"
         >
           <Sparkles className="w-3.5 h-3.5" />
           AI
         </button>
       </motion.div>

       {/* Upcoming Bills Alert Notification Banner */}
       {(() => {
         const upcomingBills = bills.filter(bill => {
           if (bill.isPaid) return false;
           const dueDate = new Date(bill.dueDate);
           const today = new Date();
           today.setHours(0,0,0,0);
           dueDate.setHours(0,0,0,0);
           const diffTime = dueDate.getTime() - today.getTime();
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
           return diffDays >= 0 && diffDays <= 3;
         });

         if (upcomingBills.length === 0) return null;

         return (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }} 
             animate={{ opacity: 1, scale: 1 }} 
             className="bg-amber-50/70 border border-amber-200/60 rounded-[24px] p-4 text-left space-y-3 shadow-sm"
           >
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <span className="text-base animate-bounce">📅</span>
                 <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wider">Bill Due Alert</h4>
               </div>
               <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                 {upcomingBills.length} Due Soon
               </span>
             </div>
             
             <div className="space-y-2">
               {upcomingBills.map(bill => {
                 const dueDate = new Date(bill.dueDate);
                 const today = new Date();
                 today.setHours(0,0,0,0);
                 dueDate.setHours(0,0,0,0);
                 const diffTime = dueDate.getTime() - today.getTime();
                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                 
                 let dayLabel = `Due in ${diffDays} days`;
                 if (diffDays === 0) dayLabel = 'Due today!';
                 else if (diffDays === 1) dayLabel = 'Due tomorrow!';

                 return (
                   <div key={bill.id} className="flex items-center justify-between bg-white border border-amber-100/50 p-2.5 rounded-xl shadow-sm">
                     <div>
                       <p className="font-extrabold text-slate-800 text-sm">{bill.name}</p>
                       <p className="text-xs text-amber-700 font-bold mt-0.5">{dayLabel} • {new Date(bill.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="font-black text-slate-800 text-sm mr-1">₹{bill.amount}</span>
                       <button 
                         onClick={() => onAction('Bills')} 
                         className="bg-[#5c40e8] hover:bg-[#4b28e3] text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                       >
                         Pay
                       </button>
                     </div>
                   </div>
                 );
               })}
             </div>
           </motion.div>
         );
       })()}

       {/* Balance Card */}
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
         <div className="bg-gradient-to-br from-[#f8fafe] via-[#f2f6ff] to-[#e8eeff] rounded-[28px] p-6 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
           
           {/* Abstract graphics - Chart Line & Cards */}
           <div className="absolute top-0 right-0 w-3/5 h-full pointer-events-none">
             {/* Chart Line */}
             <svg viewBox="0 0 200 150" className="absolute right-0 top-0 h-full w-full opacity-60 text-[#c0ccff]" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M0 120 C 40 120, 60 70, 100 80 C 140 90, 160 30, 200 40" strokeDasharray="4 4" />
               <path d="M0 130 C 50 130, 70 60, 120 70 C 150 75, 170 10, 200 20" strokeWidth="3" className="text-[#8c9fff]" />
             </svg>
             
             {/* Stacked Cards Illustration */}
             <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="relative w-[130px] h-[100px]">
                  {/* Bottom Card */}
                  <div className="absolute bottom-0 right-2 w-[110px] h-[65px] bg-gradient-to-tr from-[#91a6ff] to-[#b1c2ff] rounded-[14px] transform rotate-[15deg] shadow-lg border border-white/40"></div>
                  {/* Middle Card */}
                  <div className="absolute bottom-3 right-4 w-[110px] h-[65px] bg-gradient-to-tr from-[#6b8cff] to-[#8c9fff] rounded-[14px] transform rotate-[8deg] shadow-lg border border-white/40"></div>
                  {/* Top Card */}
                  <div className="absolute bottom-6 right-6 w-[110px] h-[65px] bg-gradient-to-br from-[#5c40e8] to-[#806bf0] rounded-[14px] shadow-xl border border-white/20 p-2 flex flex-col justify-between overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-12 h-12 rounded-full bg-white/10 blur-md"></div>
                      <div className="w-6 h-4 bg-white/20 rounded-[4px]"></div>
                      <div className="space-y-1">
                        <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
                        <div className="w-8 h-1.5 bg-white/30 rounded-full"></div>
                      </div>
                  </div>
                </div>
             </div>
           </div>

           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-1">
                 <p className="text-slate-600 text-[13px] font-semibold">Total Balance</p>
             </div>
             <div className="flex items-center gap-2">
                 <div className="flex items-baseline gap-1">
                   <span className="text-[28px] font-bold text-slate-800">₹</span>
                   <h3 className="text-[34px] tracking-tight font-extrabold text-slate-900">{currentBalance.toLocaleString('en-IN')}<span className="text-[20px] text-slate-700 font-bold">.00</span></h3>
                 </div>
                 <button onClick={() => onAction('TotalBalanceDetails')} className="text-slate-400 hover:text-slate-600 transition-colors ml-1"><Eye className="w-5 h-5" /></button>
             </div>
             <div className="flex items-center gap-1.5 mt-2 text-[13px]">
               <span className="text-slate-400 font-bold flex items-center">
                 0.0%
               </span>
               <span className="text-slate-500 font-medium">vs last month</span>
             </div>
             <button onClick={() => onAction('ViewDetails')} className="mt-5 bg-white text-[#5c40e8] font-bold text-[13px] px-6 py-2.5 rounded-xl transition-all shadow-sm border border-[#e0e7ff] hover:bg-indigo-50 active:scale-95">
               View Details
             </button>
           </div>
         </div>
       </motion.div>

       {/* Stats Grid */}
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-3.5">
         <StatCard title="Income" amount={`₹ ${totalIncome.toLocaleString('en-IN')}`} trend="100%" trendColor="text-emerald-500" iconBg="bg-emerald-100" iconColor="text-emerald-600" icon={<ArrowDownLeft className="w-5 h-5" />} onClick={() => onTabChange?.('Analytics')} />
         <StatCard title="Expenses" amount={`₹ ${totalExpense.toLocaleString('en-IN')}`} trend={expensePercent} trendColor="text-rose-500" iconBg="bg-rose-100" iconColor="text-rose-500" icon={<ArrowUpRight className="w-5 h-5" />} onClick={() => onTabChange?.('Analytics')} />
         <StatCard title="Savings" amount={`₹ ${currentBalance.toLocaleString('en-IN')}`} trend={savingsPercent} trendColor="text-blue-500" iconBg="bg-blue-100" iconColor="text-blue-500" icon={<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.43 4 16.05 4 12C4 7.95 7.05 4.57 11 4.07V19.93ZM13 4.07C16.95 4.57 20 7.95 20 12C20 16.05 16.95 19.43 13 19.93V4.07Z"/></svg>} onClick={() => onTabChange?.('Analytics')} />
         <StatCard title="Investments" amount={`₹ ${totalInvestment.toLocaleString('en-IN')}`} trend={investmentPercent} trendColor="text-purple-500" iconBg="bg-purple-100" iconColor="text-purple-600" icon={<BarChart2 className="w-4 h-4" />} onClick={() => onTabChange?.('Analytics')} />
       </motion.div>

       {/* Monthly Budget Setup */}
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
         <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100">
           {budget ? (
             <div>
               <div className="flex justify-between items-end mb-2">
                 <div>
                   <h3 className="text-[14px] font-extrabold text-slate-900 tracking-tight">Monthly Budget</h3>
                   <p className="text-[12px] text-slate-500 font-medium">₹ {totalExpense.toLocaleString('en-IN')} of ₹ {budget.toLocaleString('en-IN')}</p>
                 </div>
                 <button onClick={() => onAction('SetBudget')} className="text-[#5c40e8] text-[12px] font-bold hover:underline">Edit</button>
               </div>
               <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                 <div className={`h-full ${budgetProgress > 90 ? 'bg-rose-500' : 'bg-[#5c40e8]'}`} style={{ width: `${budgetProgress}%` }}></div>
               </div>
             </div>
           ) : (
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="text-[14px] font-extrabold text-slate-900 tracking-tight mb-0.5">Set Monthly Budget</h3>
                 <p className="text-[12px] text-slate-500 font-medium">Track your expenses easily</p>
               </div>
               <button onClick={() => onAction('SetBudget')} className="bg-indigo-50 text-[#5c40e8] font-bold text-[12px] px-4 py-2 rounded-xl transition-all active:scale-95">Set Now</button>
             </div>
           )}
         </div>
       </motion.div>

       {/* Quick Actions */}
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
         <div className="flex items-center justify-between mb-4">
           <h3 className="text-[16px] font-extrabold text-slate-900 tracking-tight">Quick Actions</h3>
           <button onClick={() => onAction('EditQuickActions')} className="text-[#5c40e8] text-[13px] font-bold hover:underline">Edit</button>
         </div>
         <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
           {quickActions.find((a: any) => a.id === 'AddExpense')?.visible && <ActionBtn onClick={() => onAction('AddExpense')} icon={<FileText className="w-6 h-6 stroke-[1.5]" />} iconColor="text-[#4e89ff]" label="Add Expense" />}
           {quickActions.find((a: any) => a.id === 'AddInvestment')?.visible && <ActionBtn onClick={() => onAction('AddInvestment')} icon={<BarChart2 className="w-6 h-6 stroke-[1.5]" />} iconColor="text-[#8b5cf6]" label="Add Invest" />}
           {quickActions.find((a: any) => a.id === 'VoiceEntry')?.visible && <ActionBtn onClick={() => onAction('VoiceEntry')} icon={<Mic className="w-6 h-6 stroke-[1.5]" />} iconColor="text-[#4e89ff]" label="Voice Entry" />}
           {quickActions.find((a: any) => a.id === 'RationList')?.visible && <ActionBtn onClick={() => onAction('RationList')} icon={<SplitSquareHorizontal className="w-6 h-6 stroke-[1.5]" />} iconColor="text-[#8b5cf6]" label="Ration List" />}
           {quickActions.find((a: any) => a.id === 'AddIncome')?.visible && <ActionBtn onClick={() => onAction('AddIncome')} icon={<PlusSquare className="w-6 h-6 stroke-[1.5]" />} iconColor="text-[#10b981]" label="Add Income" />}
           {quickActions.find((a: any) => a.id === 'FamilySync')?.visible && <ActionBtn onClick={() => onAction('FamilySync')} icon={<Users className="w-6 h-6 stroke-[1.5]" />} iconColor="text-[#ec4899]" label="Family Sync" />}
           {quickActions.find((a: any) => a.id === 'ReceiptScanner')?.visible && <ActionBtn onClick={() => onAction('ReceiptScanner')} icon={<ScanLine className="w-6 h-6 stroke-[1.5]" />} iconColor="text-[#f59e0b]" label="Scan Receipt" />}
           {quickActions.find((a: any) => a.id === 'Goals')?.visible && <ActionBtn onClick={() => onAction('Goals')} icon={<Target className="w-6 h-6 stroke-[1.5]" />} iconColor="text-[#0ea5e9]" label="Savings Goals" />}
           {quickActions.find((a: any) => a.id === 'RationPredictor')?.visible && <ActionBtn onClick={() => onAction('RationPredictor')} icon={<Sparkles className="w-6 h-6 stroke-[1.5]" />} iconColor="text-[#8b5cf6]" label="AI Ration" />}
         </div>
       </motion.div>

       {/* AI Banner */}
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-r from-[#f0f4ff] to-[#f5f3ff] rounded-[24px] p-4 relative overflow-hidden border border-[#e8eeff] shadow-sm">
          <div className="absolute right-0 bottom-0 w-40 h-40 opacity-40 bg-[#c4d2ff] rounded-full blur-[40px]"></div>
          <div className="absolute right-10 top-2 w-2 h-2 rounded-full bg-yellow-400 opacity-60"></div>
          <div className="absolute right-32 bottom-4 w-3 h-3 rounded-full bg-indigo-400 opacity-40"></div>
          
          <div className="relative z-10 flex gap-2 items-center justify-between">
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                 <h3 className="font-extrabold text-slate-900 text-[14px]">AI Financial Assistant</h3>
                 <span className="bg-yellow-100 text-yellow-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Beta</span>
               </div>
               <p className="text-[12px] text-slate-500 mb-3 leading-snug max-w-[200px] font-medium">Get smart insights, predictions & personalized recommendations</p>
               <button onClick={() => onAction('ChatNow')} className="bg-[#5c40e8] text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">Chat Now</button>
             </div>
             <div className="w-[100px] h-[100px] flex-shrink-0 flex items-center justify-center relative">
                {/* Robot Illustration Simulation */}
                <div className="w-[80px] h-[80px] bg-gradient-to-b from-blue-100 to-indigo-100 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-lg"></div>
                <div className="relative z-10 bg-gradient-to-b from-[#4e89ff] to-[#5c40e8] w-16 h-12 rounded-[20px] rounded-b-[24px] shadow-lg flex flex-col items-center justify-center pt-1 border-t border-white/20">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-slate-300 rounded-full"></div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div>
                  
                  {/* Eyes */}
                  <div className="flex gap-4 mb-1">
                    <div className="w-3 h-1.5 bg-[#00f0ff] rounded-full shadow-[0_0_5px_rgba(0,240,255,0.8)]"></div>
                    <div className="w-3 h-1.5 bg-[#00f0ff] rounded-full shadow-[0_0_5px_rgba(0,240,255,0.8)]"></div>
                  </div>
                  {/* Smile */}
                  <div className="w-4 h-1.5 border-b-2 border-white/50 rounded-full mt-0.5"></div>
                  
                  {/* Arms */}
                  <div className="absolute -left-2 top-4 w-2 h-6 bg-[#6b8cff] rounded-full -rotate-[15deg]"></div>
                  <div className="absolute -right-2 top-4 w-2 h-6 bg-[#6b8cff] rounded-full rotate-[15deg]"></div>
                </div>
             </div>
          </div>
       </motion.div>

       {/* Goals & Bills Summary */}
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="grid grid-cols-2 gap-3.5">
         <div onClick={() => onAction('Goals')} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[20px] p-4 shadow-sm border border-indigo-100 cursor-pointer hover:shadow-md transition-shadow">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
               <Target className="w-4 h-4" />
             </div>
             <span className="text-[13px] font-bold text-indigo-900">Savings Goals</span>
           </div>
           <p className="text-[20px] font-black text-indigo-950">{goals?.length || 0}</p>
           <p className="text-[11px] font-semibold text-indigo-600 mt-0.5">Active goals</p>
         </div>
         <div onClick={() => onAction('Bills')} className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-[20px] p-4 shadow-sm border border-rose-100 cursor-pointer hover:shadow-md transition-shadow">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
               <Calendar className="w-4 h-4" />
             </div>
             <span className="text-[13px] font-bold text-rose-900">Upcoming Bills</span>
           </div>
           <p className="text-[20px] font-black text-rose-950">{bills?.length || 0}</p>
           <p className="text-[11px] font-semibold text-rose-600 mt-0.5">Pending bills</p>
         </div>
       </motion.div>

       {/* Recent Transactions */}
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
         <div className="flex items-center justify-between mb-4">
           <h3 className="text-[16px] font-extrabold text-slate-900 tracking-tight">Recent Transactions</h3>
           <button onClick={() => onTabChange?.('Expenses')} className="text-[#5c40e8] text-[13px] font-bold hover:underline">See All</button>
         </div>
         {transactions.length > 0 ? (
           <div className="space-y-4">
             {transactions.slice(0, 5).map(tx => (
               <TransactionItem 
                 key={tx.id}
                 icon={tx.type === 'Income' ? <Briefcase className="w-5 h-5 text-emerald-600 stroke-[2.5]" /> : tx.type === 'Investment' ? <BarChart2 className="w-5 h-5 text-purple-600 stroke-[2.5]" /> : <FileText className="w-5 h-5 text-rose-500 stroke-[2.5]" />} 
                 iconBg={tx.type === 'Income' ? 'bg-emerald-100' : tx.type === 'Investment' ? 'bg-purple-100' : 'bg-rose-100'} 
                 title={tx.category} 
                 subtitle={tx.note || tx.category} 
                 amount={`${tx.type === 'Expense' ? '- ' : '+ '}₹ ${tx.amount.toLocaleString('en-IN')}`} 
                 time={new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                 isNegative={tx.type === 'Expense'} 
                 onClick={() => onEditTransaction?.(tx)} 
                 onDelete={() => onDeleteTransaction?.(tx.id)}
                 onEdit={() => onEditTransaction?.(tx)}
               />
             ))}
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
               <FileText className="w-5 h-5 text-slate-400" />
             </div>
             <p className="text-[14px] font-bold text-slate-700">No transactions yet</p>
             <p className="text-[12px] text-slate-500 mt-1">Your recent activity will appear here</p>
           </div>
         )}
       </motion.div>
    </div>
  );
}

function StatCard({ title, amount, trend, trendColor, iconBg, iconColor, icon, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-white rounded-[20px] p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <span className="text-[13px] text-slate-600 font-semibold">{title}</span>
      </div>
      <h4 className="text-[16px] font-extrabold text-slate-900 tracking-tight">{amount}</h4>
      <span className={`text-[11px] font-bold ${trendColor} mt-0.5 block`}>{trend}</span>
    </div>
  );
}

function ActionBtn({ icon, label, badge, iconColor, onClick }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 relative group w-[60px]">
      {badge && <span className="absolute -top-2.5 right-0 bg-[#f0ebff] text-[#5c40e8] text-[9px] font-bold px-1.5 py-0.5 rounded border border-white shadow-sm z-10 tracking-wide">{badge}</span>}
      <div className={`w-[52px] h-[52px] rounded-[18px] bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:shadow-md group-hover:-translate-y-0.5 transition-all ${iconColor}`}>
        {icon}
      </div>
      <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight mt-1">{label}</span>
    </button>
  );
}

function TransactionItem({ icon, iconBg, title, subtitle, amount, time, isNegative, onClick, onEdit, onDelete }: any) {
  return (
    <div className="flex items-center justify-between p-1 hover:bg-slate-50 rounded-xl transition-colors group">
      <div className="flex items-center gap-3.5 cursor-pointer flex-1" onClick={onClick}>
        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shadow-sm ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900 text-[15px]">{title}</h4>
          <p className="text-[12px] text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right cursor-pointer" onClick={onClick}>
          <h4 className={`font-extrabold text-[15px] ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>{amount}</h4>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{time}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); onEdit?.(); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete?.(); }} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
