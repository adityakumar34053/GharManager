import React from 'react';
import { Clock, Download, Filter, Search, Briefcase, FileText, Edit2, Trash2, BarChart2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Transaction } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function TransactionsScreen({ transactions = [], selectedMonth, setSelectedMonth, onDeleteTransaction, onEditTransaction }: { transactions?: Transaction[], selectedMonth: string, setSelectedMonth: (m: string) => void, onDeleteTransaction?: (id: string) => void, onEditTransaction?: (tx: Transaction) => void }) {
  const [filter, setFilter] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);

  const availableMonths = React.useMemo(() => {
    const months = new Set<string>();
    const now = new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    
    transactions?.forEach(tx => {
      if (tx.date) {
        const d = new Date(tx.date);
        if (!isNaN(d.getTime())) {
          months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        }
      }
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const filteredTransactions = transactions.filter(tx => {
    if (filter !== 'All' && filter !== tx.type) return false;
    
    const d = new Date(tx.date);
    if (!isNaN(d.getTime())) {
      const txMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (txMonth !== selectedMonth) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!tx.category.toLowerCase().includes(query) && 
          !(tx.note && tx.note.toLowerCase().includes(query))) {
        return false;
      }
    }
    return true;
  });

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const groupedTransactions = React.useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    const sorted = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    sorted.forEach(tx => {
      const d = new Date(tx.date);
      let dateLabel = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
      
      if (d.toDateString() === todayStr) {
        dateLabel = 'Today';
      } else if (d.toDateString() === yesterdayStr) {
        dateLabel = 'Yesterday';
      }

      if (!groups[dateLabel]) groups[dateLabel] = [];
      groups[dateLabel].push(tx);
    });
    
    return groups;
  }, [filteredTransactions]);

  const handleDownloadExpenses = () => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(92, 64, 232); // #5c40e8
    doc.text('GharManager Pro', 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text('Expense Report', 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);
    
    // Table
    const tableData = expenses.map(exp => [
      new Date(exp.date).toLocaleDateString(),
      exp.category,
      exp.note || '-',
      `Rs. ${exp.amount.toLocaleString('en-IN')}`
    ]);
    
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    autoTable(doc, {
      startY: 45,
      head: [['Date', 'Category', 'Note', 'Amount']],
      body: [
        ...tableData,
        ['', '', 'Total Expenses', `Rs. ${totalExpense.toLocaleString('en-IN')}`]
      ],
      headStyles: { fillColor: [92, 64, 232], textColor: 255, fontStyle: 'bold' },
      footStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontStyle: 'bold' },
      theme: 'grid',
    });
    
    doc.save('Expense_Report.pdf');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-32 px-5 pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Transactions</h2>
          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(e.target.value)}
            className="text-sm font-bold text-[#5c40e8] bg-indigo-50 px-2 py-1 rounded-lg outline-none mt-1 appearance-none cursor-pointer"
          >
            {availableMonths.map(m => (
              <option key={m} value={m}>{formatMonthLabel(m)}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setShowSearch(!showSearch)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showSearch ? 'bg-indigo-100 text-[#5c40e8]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      {showSearch && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <input 
            type="text" 
            placeholder="Search by category or note..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-semibold outline-none focus:border-[#5c40e8] shadow-sm"
          />
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
        <FilterBtn active={filter === 'All'} label="All" onClick={() => setFilter('All')} />
        <FilterBtn active={filter === 'Income'} label="Income" onClick={() => setFilter('Income')} />
        <FilterBtn active={filter === 'Expense'} label="Expense" onClick={() => setFilter('Expense')} />
        <FilterBtn active={filter === 'Investment'} label="Investment" onClick={() => setFilter('Investment')} />
        <button className="ml-auto w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length > 0 ? (
        <div className="space-y-6">
          {(Object.entries(groupedTransactions) as [string, Transaction[]][]).map(([dateLabel, txs]) => (
            <TransactionGroup key={dateLabel} date={dateLabel}>
               {txs.map(tx => (
                 <TransactionItem 
                   key={tx.id}
                   title={tx.category} 
                   subtitle={tx.note || tx.category} 
                   amount={`${tx.type === 'Expense' ? '- ' : '+ '}₹ ${tx.amount.toLocaleString('en-IN')}`} 
                   time={new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                   isNegative={tx.type === 'Expense'} 
                   color={tx.type === 'Income' ? 'bg-emerald-100 text-emerald-600' : tx.type === 'Investment' ? 'bg-purple-100 text-purple-600' : 'bg-rose-100 text-rose-500'} 
                   icon={tx.type === 'Income' ? <Briefcase className="w-5 h-5" /> : tx.type === 'Investment' ? <BarChart2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                   onClick={() => onEditTransaction?.(tx)}
                   onDelete={() => onDeleteTransaction?.(tx.id)}
                   onEdit={() => onEditTransaction?.(tx)}
                 />
               ))}
            </TransactionGroup>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-[16px] font-bold text-slate-800 mb-1">No transactions found</h3>
          <p className="text-[13px] text-slate-500 max-w-[200px] mx-auto">Add an expense or income to see your transaction history.</p>
        </div>
      )}
      
      <button onClick={handleDownloadExpenses} className="mt-8 w-full py-3.5 bg-indigo-50 text-[#5c40e8] font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
        <Download className="w-4 h-4" />
        Download Expense Report
      </button>
    </motion.div>
  );
}

function FilterBtn({ active, label, onClick }: { active?: boolean, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${active ? 'bg-[#5c40e8] text-white shadow-md shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
      {label}
    </button>
  );
}

function TransactionGroup({ date, children }: { date: string, children: React.ReactNode, key?: string }) {
  return (
    <div>
      <h3 className="text-[13px] font-bold text-slate-400 mb-3 uppercase tracking-wider">{date}</h3>
      <div className="bg-white rounded-[20px] p-2 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 space-y-1">
        {children}
      </div>
    </div>
  );
}

function TransactionItem({ title, subtitle, amount, time, isNegative, color, icon, onClick, onEdit, onDelete }: any) {
  return (
    <div className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-3.5 flex-1">
        <div className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center font-black text-lg ${color}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900 text-[15px]">{title}</h4>
          <p className="text-[12px] text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right cursor-pointer">
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
