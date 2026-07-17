import { motion } from 'motion/react';
import { Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export function AnalyticsScreen({ transactions = [] }: { transactions?: Transaction[] }) {
  const expenses = transactions.filter(t => t.type === 'Expense');
  const incomes = transactions.filter(t => t.type === 'Income');
  
  const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalSpent;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0';

  // Group by category for pie chart
  const categories = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // top 5

  const colors = ['#5c40e8', '#ec4899', '#0ea5e9', '#f59e0b', '#10b981'];
  const bgColors = ['bg-[#5c40e8]', 'bg-[#ec4899]', 'bg-[#0ea5e9]', 'bg-[#f59e0b]', 'bg-[#10b981]'];
  
  const pieData = sortedCategories.map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));

  // Group by last 7 days for area/bar chart
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dayExp = expenses.filter(t => isSameDay(new Date(t.date), d)).reduce((sum, t) => sum + t.amount, 0);
    const dayInc = incomes.filter(t => isSameDay(new Date(t.date), d)).reduce((sum, t) => sum + t.amount, 0);
    return {
      day: format(d, 'EEE'),
      expense: dayExp,
      income: dayInc,
      net: dayInc - dayExp
    };
  });

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-32 px-5 pt-4 space-y-6">
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Analytics & Insights</h2>

      {/* Financial Health Snapshot */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Income</span>
          </div>
          <span className="text-lg font-black text-emerald-700">₹{totalIncome.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-rose-500">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Expense</span>
          </div>
          <span className="text-lg font-black text-rose-600">₹{totalSpent.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="bg-[#5c40e8] text-white rounded-2xl p-5 shadow-lg shadow-indigo-200 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <Activity className="w-32 h-32 -mt-4 -mr-4" />
        </div>
        <p className="text-sm font-semibold text-indigo-200 mb-1">Savings Rate</p>
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-black">{savingsRate}%</h3>
          <span className="text-sm font-medium text-indigo-200 mb-1">of total income</span>
        </div>
      </div>

      {/* Income vs Expense Area Chart */}
      <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[13px] text-slate-500 font-semibold mb-1">Cash Flow (Last 7 Days)</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>In</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div>Out</div>
          </div>
        </div>
        
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last7Days} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
              <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart */}
      {pieData.length > 0 && (
        <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 mb-6 flex items-center justify-between">
           <div className="w-[120px] h-[120px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={55} stroke="none">
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip formatter={(value: number) => `₹ ${value}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }} />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="flex-1 pl-6 flex flex-col gap-3">
             {pieData.slice(0,3).map(data => (
               <div key={data.name} className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
                   <span className="text-xs font-bold text-slate-700">{data.name}</span>
                 </div>
                 <span className="text-xs font-extrabold text-slate-900">{(data.value / totalSpent * 100).toFixed(0)}%</span>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Spending Breakdown */}
      <h3 className="text-[16px] font-extrabold text-slate-900 tracking-tight mb-4 mt-2">Top Categories Breakdown</h3>
      {sortedCategories.length > 0 ? (
        <div className="space-y-3">
          {sortedCategories.map(([category, amount], idx) => {
            const percent = Math.round((amount / totalSpent) * 100);
            return (
              <CategoryItem 
                key={category}
                title={category} 
                amount={`₹ ${amount.toLocaleString('en-IN')}`} 
                percent={`${percent}%`} 
                color={bgColors[idx % bgColors.length]} 
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
           <p className="text-[14px] font-bold text-slate-700">No data available</p>
           <p className="text-[12px] text-slate-500 mt-1">Start adding expenses to see insights</p>
        </div>
      )}

    </motion.div>
  );
}

function CategoryItem({ title, amount, percent, color }: any) {
  return (
    <div className="bg-white rounded-[16px] p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full relative flex items-center justify-center shrink-0">
         <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 36 36">
          <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path className={color.replace('bg-', 'text-')} strokeDasharray={`${parseInt(percent.replace('%',''))}, 100`} strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
      </div>
      <div className="flex-1">
        <h4 className="font-extrabold text-slate-900 text-[14px]">{title}</h4>
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: percent }}></div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <h4 className="font-extrabold text-slate-900 text-[14px]">{amount}</h4>
        <p className="text-[11px] text-slate-400 mt-0.5 font-bold">{percent}</p>
      </div>
    </div>
  );
}
