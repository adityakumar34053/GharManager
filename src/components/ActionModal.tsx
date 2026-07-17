import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Camera,
  Mic,
  Users,
  Plus,
  Check,
  Edit3,
  Bot,
  Search,
  FileText,
  ScanLine,
  Sparkles,
  Cloud,
  LogOut,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { UserProfile } from "../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { EmailAuthForm } from "./EmailAuthForm";

import { RationItem } from "../types";

export function ActionModal({
  activeModal,
  onClose,
  onAddTransaction,
  onSetBudget,
  profile,
  onUpdateProfile,
  editingTransaction,
  transactions = [],
  setTransactions,
  isDarkMode,
  setIsDarkMode,
  rationItems = [],
  setRationItems,
  onPurchaseRation,
  quickActions = [],
  setQuickActions,
  goals,
  setGoals,
  bills,
  setBills,
  onRestoreSuccess,
}: {
  activeModal: string | null;
  onClose: () => void;
  onAddTransaction: (tx: any) => void;
  onSetBudget?: (amount: number) => void;
  profile?: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
  editingTransaction?: any;
  transactions?: any[];
  setTransactions?: any;
  isDarkMode?: boolean;
  setIsDarkMode?: any;
  rationItems?: RationItem[];
  setRationItems?: any;
  onPurchaseRation?: (item: RationItem, actualAmount: number) => void;
  quickActions?: any[];
  setQuickActions?: any;
  goals?: any;
  setGoals?: any;
  bills?: any;
  setBills?: any;
  onRestoreSuccess?: (uid: string) => Promise<boolean>;
}) {
  if (!activeModal) return null;

  return (
    <AnimatePresence>
      {activeModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] min-h-[50vh] max-h-[85vh] z-[70] shadow-2xl flex flex-col"
          >
            <div className="flex justify-center pt-3 pb-2 shrink-0">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
            </div>

            <div className="px-6 pb-4 flex justify-between items-center border-b border-slate-100 shrink-0">
              <h2 className="text-lg font-extrabold text-slate-900">
                {activeModal === "AddExpense"
                  ? editingTransaction
                    ? "Edit Expense"
                    : "Add Expense"
                  : activeModal === "AddIncome"
                    ? editingTransaction
                      ? "Edit Income"
                      : "Add Income"
                    : activeModal === "AddInvestment"
                      ? editingTransaction
                        ? "Edit Investment"
                        : "Add Investment"
                      : activeModal.replace(/([A-Z])/g, " $1").trim()}
              </h2>
              <button
                onClick={onClose}
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
              {renderModalContent({
                modal: activeModal,
                onClose,
                onAddTransaction,
                onSetBudget,
                profile,
                onUpdateProfile,
                editingTransaction,
                transactions,
                setTransactions,
                isDarkMode,
                setIsDarkMode,
                rationItems,
                setRationItems,
                onPurchaseRation,
                quickActions,
                setQuickActions,
                goals,
                setGoals,
                bills,
                setBills,
                onRestoreSuccess,
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function renderModalContent({
  modal,
  onClose,
  onAddTransaction,
  onSetBudget,
  profile,
  onUpdateProfile,
  editingTransaction,
  transactions,
  setTransactions,
  isDarkMode,
  setIsDarkMode,
  rationItems,
  setRationItems,
  onPurchaseRation,
  quickActions,
  setQuickActions,
  goals,
  setGoals,
  bills,
  setBills,
  onRestoreSuccess,
}: any) {
  switch (modal) {
    case "AddExpense":
      return (
        <AddTransactionForm
          type="Expense"
          onClose={onClose}
          onAddTransaction={onAddTransaction}
          initialData={editingTransaction}
        />
      );
    case "AddIncome":
      return (
        <AddTransactionForm
          type="Income"
          onClose={onClose}
          onAddTransaction={onAddTransaction}
          initialData={editingTransaction}
        />
      );
    case "AddInvestment":
      return (
        <AddTransactionForm
          type="Investment"
          onClose={onClose}
          onAddTransaction={onAddTransaction}
          initialData={editingTransaction}
        />
      );
    case "SetBudget":
      return <SetBudgetForm onClose={onClose} onSetBudget={onSetBudget} />;
    case "ScanBill":
      return <ScanBillMock onClose={onClose} />;
    case "VoiceEntry":
      return (
        <VoiceEntryMock onClose={onClose} onAddTransaction={onAddTransaction} />
      );
    case "SplitBill":
      return <SplitBillMock onClose={onClose} />;
    case "Search":
      return <SearchMock onClose={onClose} transactions={transactions} />;
    case "ChatNow":
    case "AIInsights":
      return <ChatMock onClose={onClose} profile={profile} />;
    case "Goals":
      return <GoalsMock onClose={onClose} goals={goals} setGoals={setGoals} />;
    case "Bills":
      return (
        <BillsMock
          onClose={onClose}
          bills={bills}
          setBills={setBills}
          onAddTransaction={onAddTransaction}
        />
      );
    case "FamilySync":
      return (
        <FamilySyncMock
          onClose={onClose}
          profile={profile}
          onUpdateProfile={onUpdateProfile}
        />
      );
    case "ReceiptScanner":
      return (
        <ReceiptScannerMock
          onClose={onClose}
          onAddTransaction={onAddTransaction}
        />
      );
    case "RationPredictor":
      return (
        <RationPredictorMock
          onClose={onClose}
          rationItems={rationItems}
          setRationItems={setRationItems}
        />
      );
    case "Profile":
      return (
        <ProfileMock
          onClose={onClose}
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          transactions={transactions}
          setTransactions={setTransactions}
          rationItems={rationItems}
          setRationItems={setRationItems}
          goals={goals}
          setGoals={setGoals}
          bills={bills}
          setBills={setBills}
          onRestoreSuccess={onRestoreSuccess}
        />
      );
    case "ViewDetails":
    case "TotalBalanceDetails":
      return <ViewDetailsMock onClose={onClose} />;
    case "Settings":
      return (
        <SettingsMock
          onClose={onClose}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      );
    case "SecurityPrivacy":
      return <SecurityPrivacyMock onClose={onClose} />;
    case "Notifications":
      return <NotificationsMock onClose={onClose} />;
    case "HelpSupport":
      return <HelpSupportMock onClose={onClose} />;
    case "Logout":
      return <LogoutMock onClose={onClose} />;
    case "ExportData":
      return <ExportDataMock onClose={onClose} transactions={transactions} />;
    case "BackupRestore":
      return (
        <BackupRestoreMock
          onClose={onClose}
          transactions={transactions}
          setTransactions={setTransactions}
          profile={profile}
          onUpdateProfile={onUpdateProfile}
        />
      );
    case "RationList":
      return (
        <RationListMock
          onClose={onClose}
          rationItems={rationItems}
          setRationItems={setRationItems}
          onPurchaseRation={onPurchaseRation}
        />
      );
    case "EditQuickActions":
      return (
        <EditQuickActionsMock
          onClose={onClose}
          quickActions={quickActions}
          setQuickActions={setQuickActions}
        />
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🚧</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Coming Soon</h3>
          <p className="text-slate-500 text-sm">
            This feature is currently under development.
          </p>
        </div>
      );
  }
}

function SettingsMock({
  onClose,
  isDarkMode,
  setIsDarkMode,
}: {
  onClose: () => void;
  isDarkMode?: boolean;
  setIsDarkMode?: any;
}) {
  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer"
        onClick={() => setIsDarkMode?.(!isDarkMode)}
      >
        <div>
          <h4 className="font-bold text-slate-800">Dark Mode</h4>
          <p className="text-xs text-slate-500">Switch to dark theme</p>
        </div>
        <div
          className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? "bg-[#5c40e8]" : "bg-slate-200"}`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${isDarkMode ? "left-[calc(100%-22px)]" : "left-0.5"}`}
          ></div>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div>
          <h4 className="font-bold text-slate-800">Currency</h4>
          <p className="text-xs text-slate-500">INR (₹)</p>
        </div>
        <button className="text-indigo-600 text-sm font-bold">Change</button>
      </div>
      <button
        onClick={onClose}
        className="w-full py-4 mt-4 bg-[#5c40e8] text-white font-bold rounded-xl active:scale-[0.98]"
      >
        Save Changes
      </button>
    </div>
  );
}

function SecurityPrivacyMock({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div>
          <h4 className="font-bold text-slate-800">Biometric Lock</h4>
          <p className="text-xs text-slate-500">
            Require Face ID / Fingerprint
          </p>
        </div>
        <div className="w-12 h-6 bg-[#5c40e8] rounded-full relative">
          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
        </div>
      </div>
      <button className="w-full text-left p-4 bg-slate-50 rounded-xl border border-slate-100 font-bold text-slate-800">
        Change App PIN
      </button>
      <button
        onClick={onClose}
        className="w-full py-4 mt-4 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
      >
        Close
      </button>
    </div>
  );
}

function NotificationsMock({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-3">
      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 shrink-0"></div>
        <div>
          <h4 className="font-bold text-indigo-900 text-sm">Budget Alert</h4>
          <p className="text-xs text-indigo-700 mt-0.5">
            You have spent 80% of your Food budget this month.
          </p>
          <span className="text-[10px] font-bold text-indigo-400 mt-2 block">
            2 hours ago
          </span>
        </div>
      </div>
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
        <div className="w-2 h-2 bg-slate-300 rounded-full mt-1.5 shrink-0"></div>
        <div>
          <h4 className="font-bold text-slate-700 text-sm">System Update</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            GharManager Pro v2.4.1 is now installed with new features.
          </p>
          <span className="text-[10px] font-bold text-slate-400 mt-2 block">
            1 day ago
          </span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-full py-3 mt-2 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
      >
        Mark all as read
      </button>
    </div>
  );
}

function HelpSupportMock({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"faq" | "contact">("faq");

  return (
    <div className="space-y-4">
      <div className="flex bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("faq")}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === "faq" ? "bg-white text-[#5c40e8] shadow-sm" : "text-slate-500"}`}
        >
          FAQs
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === "contact" ? "bg-white text-[#5c40e8] shadow-sm" : "text-slate-500"}`}
        >
          Contact Us
        </button>
      </div>

      {activeTab === "faq" ? (
        <div className="space-y-3 max-h-[300px] overflow-y-auto hide-scrollbar">
          {[
            {
              q: "How do I add a new expense?",
              a: 'Tap the "Add Expense" quick action on the home screen or use the floating + button at the bottom.',
            },
            {
              q: "Can I export my data?",
              a: "Yes, go to More > Export Data to download a CSV file of all your transactions.",
            },
            {
              q: "Is my data secure?",
              a: "Absolutely. We use industry-standard encryption to keep your financial data safe and private.",
            },
            {
              q: "How to use Voice Entry?",
              a: 'Tap "Voice Entry" and say something like "Spent 500 on groceries today". Our AI will auto-categorize it.',
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-slate-50 p-3 rounded-xl border border-slate-100"
            >
              <h4 className="font-bold text-slate-800 text-sm mb-1">
                Q: {faq.q}
              </h4>
              <p className="text-xs text-slate-500">A: {faq.a}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900 text-sm">
                Live Chat Support
              </h4>
              <p className="text-xs text-indigo-700">
                Usually replies in 5 mins
              </p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Email Support
            </h4>
            <p className="text-sm text-slate-500">support@gharmanager.com</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Call Us (Toll Free)
            </h4>
            <p className="text-sm text-slate-500">+91 1800-123-4567</p>
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full py-3 mt-2 bg-[#5c40e8] text-white font-bold rounded-xl active:scale-[0.98]"
      >
        Close
      </button>
    </div>
  );
}

function LogoutMock({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center space-y-6 pt-4">
      <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2">
        <span className="text-2xl">👋</span>
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Log out of GharManager?
        </h3>
        <p className="text-slate-500 text-sm">
          You will need to sign back in to access your financial data.
        </p>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onClose}
          className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 py-4 bg-rose-500 text-white font-bold rounded-xl active:scale-[0.98]"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

function EditQuickActionsMock({
  onClose,
  quickActions,
  setQuickActions,
}: {
  onClose: () => void;
  quickActions?: any[];
  setQuickActions?: any;
}) {
  const toggleAction = (id: string) => {
    setQuickActions?.((prev: any[]) =>
      prev.map((a) => (a.id === id ? { ...a, visible: !a.visible } : a)),
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 mb-4">
        Tap to hide or show quick actions from your home screen.
      </p>
      {quickActions?.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">{item.label}</span>
          </div>
          <div
            className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${item.visible ? "bg-[#5c40e8]" : "bg-slate-200"}`}
            onClick={() => toggleAction(item.id)}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${item.visible ? "left-[calc(100%-22px)]" : "left-0.5"}`}
            ></div>
          </div>
        </div>
      ))}
      <button
        onClick={onClose}
        className="w-full py-4 mt-4 bg-[#5c40e8] text-white font-bold rounded-xl active:scale-[0.98]"
      >
        Save Settings
      </button>
    </div>
  );
}

function AddTransactionForm({
  type,
  onClose,
  onAddTransaction,
  initialData,
}: {
  type: "Expense" | "Income" | "Investment";
  onClose: () => void;
  onAddTransaction: (tx: any) => void;
  initialData?: any;
}) {
  const [amount, setAmount] = useState(
    initialData ? initialData.amount.toString() : "",
  );
  const [category, setCategory] = useState(
    initialData
      ? initialData.category
      : type === "Expense"
        ? "Food & Dining"
        : type === "Investment"
          ? "Stocks"
          : "Salary",
  );
  const [note, setNote] = useState(initialData ? initialData.note : "");

  const handleSave = () => {
    if (!amount || isNaN(Number(amount))) return;
    onAddTransaction({
      type,
      amount: Number(amount),
      category,
      note,
    });
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <p className="text-slate-500 text-sm font-semibold mb-2">Amount</p>
        <div className="flex items-center justify-center text-4xl font-black text-slate-900">
          <span className="text-slate-400 mr-1">₹</span>
          <input
            type="number"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full max-w-[150px] bg-transparent outline-none text-center placeholder:text-slate-300"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-semibold outline-none focus:border-[#5c40e8]"
        >
          {type === "Expense" ? (
            <>
              <option>Food & Dining</option>
              <option>Shopping</option>
              <option>Transport</option>
              <option>Bills & Utilities</option>
              <option>Entertainment</option>
              <option>Other</option>
            </>
          ) : type === "Investment" ? (
            <>
              <option>Stocks</option>
              <option>Mutual Funds</option>
              <option>Fixed Deposit</option>
              <option>Crypto</option>
              <option>Other</option>
            </>
          ) : (
            <>
              <option>Salary</option>
              <option>Freelance</option>
              <option>Investment Return</option>
              <option>Gift</option>
              <option>Other</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
          Note (Optional)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was this for?"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-semibold outline-none focus:border-[#5c40e8]"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full py-4 mt-4 bg-[#5c40e8] text-white font-bold rounded-xl active:scale-[0.98] transition-transform disabled:opacity-50"
        disabled={!amount}
      >
        Save {type}
      </button>
    </div>
  );
}

function ScanBillMock({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-full h-48 bg-slate-900 rounded-2xl relative overflow-hidden mb-6 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-[#5c40e8]/50 m-4 rounded-xl border-dashed"></div>
        <div className="w-full h-1 bg-[#5c40e8] absolute top-1/2 -translate-y-1/2 shadow-[0_0_15px_#5c40e8] animate-[scan_2s_ease-in-out_infinite]"></div>
        <Camera className="w-10 h-10 text-white/50" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Position bill in frame
      </h3>
      <p className="text-sm text-slate-500 mb-6">
        Scanning will happen automatically
      </p>

      <button
        onClick={onClose}
        className="px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
      >
        Cancel
      </button>
      <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>
    </div>
  );
}

function VoiceEntryMock({
  onClose,
  onAddTransaction,
}: {
  onClose: () => void;
  onAddTransaction?: (t: any) => void;
}) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [transcript, setTranscript] = React.useState<string>("");
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          setIsProcessing(true);
          try {
            const base64Audio = reader.result as string;
            const res = await fetch("/api/voice-command", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                audioBase64: base64Audio,
                mimeType: "audio/webm",
              }),
            });
            const data = await res.json();

            if (
              data.action === "ADD_TRANSACTION" &&
              data.data &&
              onAddTransaction
            ) {
              setTranscript(data.transcript || "Transaction added!");
              onAddTransaction({
                id: Math.random().toString(36).substr(2, 9),
                name: data.data.note || "Voice Transaction",
                amount: Number(data.data.amount) || 0,
                type: data.data.type || "Expense",
                category: data.data.category || "General",
                date: new Date().toISOString(),
              });
              setTimeout(() => {
                onClose();
              }, 2000);
            } else {
              setTranscript(
                data.transcript || "Could not understand the command.",
              );
              setTimeout(() => {
                setIsProcessing(false);
              }, 2000);
            }
          } catch (err) {
            console.error(err);
            setTranscript("Error processing audio.");
            setTimeout(() => setIsProcessing(false), 2000);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscript("");
    } catch (err) {
      console.error("Microphone access denied:", err);
      setTranscript("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center py-6">
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 relative shadow-lg shadow-indigo-200 transition-colors ${isRecording ? "bg-rose-500" : "bg-[#5c40e8]"}`}
      >
        {isRecording && (
          <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-30"></div>
        )}
        {isProcessing && (
          <div className="absolute inset-0 border-4 border-t-white border-white/20 rounded-full animate-spin"></div>
        )}
        <Mic className="w-10 h-10 text-white" />
      </div>

      <h3 className="text-2xl font-black text-slate-900 mb-2">
        {isProcessing
          ? "Processing..."
          : isRecording
            ? "Listening..."
            : "Voice Assistant"}
      </h3>

      <p className="text-slate-500 font-medium h-12 flex items-center justify-center px-4">
        {transcript
          ? `"${transcript}"`
          : isRecording
            ? "Speak now (e.g. 'spent 500 on lunch')"
            : "Tap below to start speaking in any language"}
      </p>

      <div className="mt-8 flex gap-4 w-full px-4">
        {!isRecording && !isProcessing ? (
          <button
            onClick={startRecording}
            className="flex-1 py-3.5 bg-[#5c40e8] text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            disabled={isProcessing}
            className="flex-1 py-3.5 bg-rose-50 text-rose-500 font-bold rounded-xl active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
          >
            {isProcessing ? "Please Wait..." : "Stop Recording"}
          </button>
        )}
        {!isRecording && !isProcessing && (
          <button
            onClick={onClose}
            className="py-3.5 px-6 bg-slate-100 text-slate-600 font-bold rounded-xl active:scale-[0.98] transition-transform"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function SplitBillMock({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <p className="text-slate-500 text-sm font-semibold mb-1">
          Total Bill Amount
        </p>
        <div className="text-3xl font-black text-slate-900">₹ 0</div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 mb-3">Split with</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {["Rahul", "Priya", "Amit", "Neha"].map((name, i) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm relative">
                {name[0]}
                {i < 2 && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {name}
              </span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-slate-50 text-slate-400 border border-slate-200 border-dashed rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Add</span>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-4 bg-[#5c40e8] text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
      >
        Send Request (₹ 0/each)
      </button>
    </div>
  );
}

function ChatMock({
  onClose,
  profile,
}: {
  onClose: () => void;
  profile?: UserProfile;
}) {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: `Hi ${profile?.name || "there"}! Welcome to GharManager Pro. I'm your AI Financial Assistant. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const currentInput = input;
    setInput("");

    setTimeout(() => {
      let reply =
        "I'm still learning! Right now I can't fully process that, but I'm getting smarter every day.";
      if (currentInput.toLowerCase().includes("budget")) {
        reply =
          "To manage your budget, use the 'Set Budget' option on the home dashboard. I'll help you track your expenses against it!";
      } else if (currentInput.toLowerCase().includes("expense")) {
        reply =
          "You can add an expense by tapping the '+' button below. Want me to categorize it for you next time?";
      } else if (currentInput.toLowerCase().includes("invest")) {
        reply =
          "Investing is a great way to grow wealth. Soon, I'll be able to recommend investment options based on your savings!";
      }
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 hide-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            {msg.role === "ai" ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4e89ff] to-[#5c40e8] flex items-center justify-center text-white shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            ) : (
              <img
                src={profile?.avatarUrl}
                alt="User"
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
              />
            )}
            <div
              className={`p-3 rounded-2xl text-[13px] font-medium leading-relaxed ${msg.role === "user" ? "bg-[#5c40e8] text-white rounded-tr-none" : "bg-slate-100 text-slate-700 rounded-tl-none"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything about your finances..."
          className="flex-1 bg-transparent px-2 text-sm outline-none font-medium text-slate-700"
        />
        <button
          onClick={handleSend}
          className="w-10 h-10 bg-[#5c40e8] text-white rounded-lg flex items-center justify-center hover:bg-[#4b28e3] transition-colors shrink-0 disabled:opacity-50"
          disabled={!input.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ProfileMock({
  onClose,
  profile,
  onUpdateProfile,
  transactions = [],
  setTransactions,
  rationItems = [],
  setRationItems,
  goals = [],
  setGoals,
  bills = [],
  setBills,
  onRestoreSuccess,
}: {
  onClose: () => void;
  profile?: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
  transactions?: any[];
  setTransactions?: any;
  rationItems?: any[];
  setRationItems?: any;
  goals?: any[];
  setGoals?: any;
  bills?: any[];
  setBills?: any;
  onRestoreSuccess?: (uid: string) => Promise<boolean>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [imageUrl, setImageUrl] = useState(profile?.avatarUrl || "");
  const [showAuthForm, setShowAuthForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalTransactions = transactions.length;
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  const handleSave = () => {
    onUpdateProfile?.({
      name,
      avatarUrl: imageUrl,
      email,
      joinedDate: profile?.joinedDate || new Date().toISOString(),
    });
    setIsEditing(false);
  };

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

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={
                imageUrl ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#5c40e8] text-white shadow-md border-2 border-white rounded-full flex items-center justify-center hover:bg-[#4b28e3]"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Tap icon to change photo
          </p>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-semibold outline-none focus:border-[#5c40e8]"
          />
        </div>
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-semibold outline-none focus:border-[#5c40e8]"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-[#5c40e8] text-white font-bold rounded-xl active:scale-[0.98]"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  const user = auth.currentUser;
  const isUserLoggedIn = user && !user.isAnonymous;

  return (
    <div className="text-center">
      <div className="relative inline-block mb-4">
        <img
          src={
            profile?.avatarUrl ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto"
        />
        <button
          onClick={() => setIsEditing(true)}
          className="absolute bottom-1 right-1 w-8 h-8 bg-white text-slate-700 shadow-md border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-50"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
      <h2 className="text-xl font-black text-slate-900">
        {profile?.name || "User"}
      </h2>
      {profile?.email && (
        <p className="text-slate-500 font-medium text-sm mb-1">
          {profile.email}
        </p>
      )}
      <p className="text-slate-400 font-medium text-xs mb-6">
        Joined{" "}
        {profile?.joinedDate
          ? new Date(profile.joinedDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : "Today"}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
            Total Balance
          </p>
          <p
            className={`font-black text-lg ${currentBalance >= 0 ? "text-emerald-600" : "text-rose-500"}`}
          >
            ₹{currentBalance.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
            Transactions
          </p>
          <p className="font-black text-lg text-slate-700">
            {totalTransactions}
          </p>
        </div>
      </div>

      {/* Cloud Sync Status / Registration Block */}
      {isUserLoggedIn ? (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-6 text-left flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0 mt-0.5 animate-pulse">
            <Cloud className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-emerald-800 text-sm">
              Cloud Backup Active
            </h4>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              Your data is linked to <strong>{user.email}</strong>. Live backup
              and cross-device sync is running.
            </p>
            <button
              onClick={async () => {
                await signOut(auth);
                onUpdateProfile?.({ ...profile, email: "" } as any);
              }}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-extrabold rounded-lg transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out from Backup
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          {showAuthForm ? (
            <div className="border border-indigo-100 bg-indigo-50/20 p-4 rounded-3xl text-left">
              <EmailAuthForm
                onSuccess={async (uid) => {
                  if (onRestoreSuccess) {
                    await onRestoreSuccess(uid);
                  }
                  setShowAuthForm(false);
                }}
                currentLocalData={{
                  transactions,
                  rationItems,
                  goals,
                  bills,
                  budget: null,
                  profile,
                  quickActions: [],
                }}
                onClose={() => setShowAuthForm(false)}
              />
            </div>
          ) : (
            <div className="bg-[#5c40e8]/5 border border-[#5c40e8]/10 p-4 rounded-2xl text-left flex items-start gap-3">
              <div className="p-2 bg-[#5c40e8]/10 text-[#5c40e8] rounded-xl shrink-0 mt-0.5">
                <Cloud className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-[#5c40e8] text-sm">
                  Backup Data in Cloud
                </h4>
                <p className="text-slate-500 text-xs font-bold mt-0.5 leading-relaxed">
                  Secure your data with an email account to restore all your
                  budget settings, bills, and history if you reset or change
                  devices.
                </p>
                <button
                  onClick={() => setShowAuthForm(true)}
                  className="mt-3 px-4 py-2 bg-[#5c40e8] hover:bg-[#4b28e3] text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                >
                  Set up Email Backup
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl active:scale-[0.98] transition-colors"
      >
        Close Profile
      </button>
    </div>
  );
}

function ViewDetailsMock({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-slate-100 pb-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">
            Available Balance
          </p>
          <h2 className="text-3xl font-black text-slate-900">₹ 0</h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-400">₹ 0 this week</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 mb-3">Bank Accounts</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
          <p className="text-[14px] font-bold text-slate-700">
            No linked accounts
          </p>
          <p className="text-[12px] text-slate-500 mt-1">
            Link your bank account to sync balances
          </p>
          <button className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-lg shadow-sm">
            Link Account
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-4 mt-2 bg-[#5c40e8] text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
      >
        Done
      </button>
    </div>
  );
}

function SetBudgetForm({
  onClose,
  onSetBudget,
}: {
  onClose: () => void;
  onSetBudget?: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");

  const handleSave = () => {
    if (!amount || isNaN(Number(amount))) return;
    onSetBudget?.(Number(amount));
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <p className="text-slate-500 text-sm font-semibold mb-2">
          Monthly Budget
        </p>
        <div className="flex items-center justify-center text-4xl font-black text-slate-900">
          <span className="text-slate-400 mr-1">₹</span>
          <input
            type="number"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full max-w-[150px] bg-transparent outline-none text-center placeholder:text-slate-300"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-4 mt-4 bg-[#5c40e8] text-white font-bold rounded-xl active:scale-[0.98] transition-transform disabled:opacity-50"
        disabled={!amount}
      >
        Set Budget
      </button>
    </div>
  );
}

function ExportDataMock({
  onClose,
  transactions = [],
}: {
  onClose: () => void;
  transactions?: any[];
}) {
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert("No data to export!");
      return;
    }
    const headers = ["Date", "Type", "Category", "Amount", "Note"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          new Date(t.date).toLocaleDateString(),
          t.type,
          t.category,
          t.amount,
          `"${(t.note || "").replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "GharManager_Transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleExportPDF = () => {
    if (transactions.length === 0) {
      alert("No data to export!");
      return;
    }
    const doc = new jsPDF();
    doc.text("GharManager Transactions Report", 14, 15);

    const tableColumn = ["Date", "Type", "Category", "Amount", "Note"];
    const tableRows: any[] = [];

    transactions.forEach((t) => {
      const row = [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.category,
        t.amount,
        t.note || "",
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("GharManager_Transactions.pdf");
    onClose();
  };

  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
        <Send className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Export Data</h3>
        <p className="text-slate-500 text-sm">
          Download a CSV or PDF file of all your transactions.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={handleExportCSV}
          className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" /> CSV
        </button>
        <button
          onClick={handleExportPDF}
          className="w-full py-4 bg-[#5c40e8] text-white font-bold rounded-xl active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" /> PDF
        </button>
      </div>
      <button
        onClick={onClose}
        className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
      >
        Cancel
      </button>
    </div>
  );
}

function RationListMock({
  onClose,
  rationItems = [],
  setRationItems,
  onPurchaseRation,
}: {
  onClose: () => void;
  rationItems?: RationItem[];
  setRationItems?: any;
  onPurchaseRation?: (item: RationItem, actualAmount: number) => void;
}) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [purchasingItemId, setPurchasingItemId] = useState<string | null>(null);
  const [actualAmount, setActualAmount] = useState<string>("");

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemAmount || isNaN(Number(newItemAmount)))
      return;
    const newItem: RationItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: newItemName.trim(),
      estimatedAmount: Number(newItemAmount),
      isPurchased: false,
    };
    setRationItems?.((prev: RationItem[]) => [newItem, ...prev]);
    setNewItemName("");
    setNewItemAmount("");
  };

  const startPurchase = (item: RationItem) => {
    setPurchasingItemId(item.id);
    setActualAmount(item.estimatedAmount.toString());
  };

  const confirmPurchase = (item: RationItem) => {
    onPurchaseRation?.(item, Number(actualAmount) || item.estimatedAmount);
    setPurchasingItemId(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-2">Add New Item</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Item name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5c40e8]"
          />
          <input
            type="number"
            placeholder="Est. ₹"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            className="w-20 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5c40e8]"
          />
          <button
            onClick={handleAddItem}
            className="bg-[#5c40e8] text-white p-2 rounded-lg"
            disabled={!newItemName || !newItemAmount}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto hide-scrollbar pb-2">
        {rationItems.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-4">
            Your list is empty. Add items above.
          </p>
        ) : (
          rationItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col p-3 border border-slate-100 rounded-xl bg-white shadow-sm gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded border-2 border-slate-300 flex items-center justify-center cursor-pointer text-white hover:border-indigo-500 transition-colors"
                    onClick={() => startPurchase(item)}
                  >
                    <Check className="w-4 h-4 text-transparent hover:text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Est: ₹{item.estimatedAmount}
                    </p>
                  </div>
                </div>
                {purchasingItemId !== item.id && (
                  <button
                    onClick={() => startPurchase(item)}
                    className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                  >
                    Buy
                  </button>
                )}
              </div>

              {purchasingItemId === item.id && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50">
                  <span className="text-xs font-bold text-slate-500">
                    Actual ₹:
                  </span>
                  <input
                    type="number"
                    value={actualAmount}
                    onChange={(e) => setActualAmount(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-[#5c40e8]"
                  />
                  <button
                    onClick={() => confirmPurchase(item)}
                    className="bg-[#10b981] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setPurchasingItemId(null)}
                    className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full py-4 mt-2 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  );
}

function BackupRestoreMock({
  onClose,
  transactions,
  setTransactions,
  profile,
  onUpdateProfile,
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    const data = {
      transactions,
      profile,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GharManager_Backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.transactions) setTransactions(data.transactions);
        if (data.profile) onUpdateProfile(data.profile);
        alert("Restore successful!");
        onClose();
      } catch (err) {
        alert("Invalid backup file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="text-center space-y-4">
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
        <h4 className="font-bold text-slate-800">Backup Data</h4>
        <p className="text-sm text-slate-500 mb-3">
          Save your data to a secure file
        </p>
        <button
          onClick={handleBackup}
          className="w-full py-2 bg-indigo-50 text-[#5c40e8] font-bold rounded-lg active:scale-95 transition-transform"
        >
          Download Backup
        </button>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <h4 className="font-bold text-slate-800">Restore Data</h4>
        <p className="text-sm text-slate-500 mb-3">
          Restore from a previous backup file
        </p>
        <input
          type="file"
          accept=".json"
          className="hidden"
          ref={fileInputRef}
          onChange={handleRestore}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2 bg-indigo-50 text-[#5c40e8] font-bold rounded-lg active:scale-95 transition-transform"
        >
          Upload Backup File
        </button>
      </div>

      <button
        onClick={onClose}
        className="w-full py-4 mt-2 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
      >
        Cancel
      </button>
    </div>
  );
}

function SearchMock({
  onClose,
  transactions = [],
}: {
  onClose: () => void;
  transactions?: any[];
}) {
  const [query, setQuery] = useState("");

  const filtered = transactions.filter(
    (t) =>
      t.category.toLowerCase().includes(query.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="flex flex-col h-[60vh] space-y-4">
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          autoFocus
          type="text"
          placeholder="Search transactions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent border-none outline-none flex-1 text-slate-700 font-medium"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar">
        {query.length > 0 && filtered.length === 0 ? (
          <p className="text-center text-slate-500 mt-10 font-medium">
            No results found for "{query}"
          </p>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
            >
              <div>
                <h4 className="font-extrabold text-slate-900 text-[15px]">
                  {tx.category}
                </h4>
                <p className="text-[12px] text-slate-500 font-medium">
                  {new Date(tx.date).toLocaleDateString()}{" "}
                  {tx.note ? `• ${tx.note}` : ""}
                </p>
              </div>
              <h4
                className={`font-extrabold text-[15px] ${tx.type === "Expense" ? "text-rose-500" : "text-emerald-500"}`}
              >
                {tx.type === "Expense" ? "-" : "+"}₹
                {tx.amount.toLocaleString("en-IN")}
              </h4>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full py-4 mt-2 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98] shrink-0"
      >
        Close Search
      </button>
    </div>
  );
}

function GoalsMock({ onClose, goals = [], setGoals }: any) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const handleAddGoal = () => {
    if (!name || !target) return;
    setGoals((prev: any) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        targetAmount: Number(target),
        currentAmount: 0,
      },
    ]);
    setName("");
    setTarget("");
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800">Savings Goals</h3>
      <div className="flex gap-2">
        <input
          placeholder="Goal Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5c40e8]"
        />
        <input
          placeholder="Target ₹"
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5c40e8]"
        />
        <button
          onClick={handleAddGoal}
          className="bg-[#5c40e8] text-white px-3 py-2 rounded-lg font-bold"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto hide-scrollbar">
        {goals.map((g: any) => (
          <div
            key={g.id}
            className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
          >
            <div className="flex justify-between mb-2">
              <span className="font-bold text-slate-800 text-sm">{g.name}</span>
              <span className="font-bold text-[#5c40e8] text-sm">
                ₹{g.currentAmount} / ₹{g.targetAmount}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5c40e8]"
                style={{
                  width: `${Math.min((g.currentAmount / g.targetAmount) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="w-full py-3 mt-2 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
      >
        Close
      </button>
    </div>
  );
}

function BillsMock({ onClose, bills = [], setBills, onAddTransaction }: any) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<"weekly" | "monthly" | "annually">(
    "monthly",
  );

  const handleAddBill = () => {
    if (!name || !amount || !date) return;
    setBills((prev: any) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        amount: Number(amount),
        dueDate: date,
        isPaid: false,
        isRecurring,
        frequency: isRecurring ? frequency : undefined,
      },
    ]);
    setName("");
    setAmount("");
    setDate("");
    setIsRecurring(false);
    setFrequency("monthly");
  };

  const togglePaid = (id: string) => {
    setBills((prev: any) => {
      const currentBills = [...prev];
      const billIndex = currentBills.findIndex((b: any) => b.id === id);
      if (billIndex === -1) return prev;

      const bill = currentBills[billIndex];
      const newIsPaid = !bill.isPaid;

      // Update current bill
      currentBills[billIndex] = { ...bill, isPaid: newIsPaid };

      // If marking as paid and it's recurring, generate the next bill
      if (newIsPaid && bill.isRecurring && bill.frequency) {
        const currentDate = new Date(bill.dueDate);
        const nextDate = new Date(currentDate);

        if (bill.frequency === "weekly") {
          nextDate.setDate(currentDate.getDate() + 7);
        } else if (bill.frequency === "monthly") {
          nextDate.setMonth(currentDate.getMonth() + 1);
        } else if (bill.frequency === "annually") {
          nextDate.setFullYear(currentDate.getFullYear() + 1);
        }

        // Add new bill if it doesn't already exist for this date
        const nextDateString = nextDate.toISOString().split("T")[0];
        const nextBillExists = currentBills.some(
          (b: any) => b.name === bill.name && b.dueDate === nextDateString,
        );

        if (!nextBillExists) {
          currentBills.push({
            id: Date.now().toString() + "-recurring",
            name: bill.name,
            amount: bill.amount,
            dueDate: nextDateString,
            isPaid: false,
            isRecurring: true,
            frequency: bill.frequency,
          });
        }
      }

      return currentBills;
    });
  };

  const handleQuickPay = (bill: any) => {
    if (!bill.isPaid) {
      togglePaid(bill.id);
      if (onAddTransaction) {
        onAddTransaction({
          type: "Expense",
          amount: bill.amount,
          category: bill.category || "Bills",
          note: bill.name,
          date: new Date(),
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800">Upcoming Bills</h3>
      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="Bill Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5c40e8]"
        />
        <input
          placeholder="Amount ₹"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="col-span-2 sm:col-span-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5c40e8]"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="col-span-2 sm:col-span-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5c40e8]"
        />

        <div className="col-span-2 flex items-center gap-2 mb-1">
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#5c40e8] focus:ring-[#5c40e8]"
            />
            Recurring Bill
          </label>
        </div>

        {isRecurring && (
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as any)}
            className="col-span-2 sm:col-span-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5c40e8]"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        )}

        <div
          className={`col-span-2 ${isRecurring ? "sm:col-span-1" : ""} flex gap-2`}
        >
          <button
            onClick={handleAddBill}
            className="w-full bg-[#5c40e8] text-white px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Bill
          </button>
        </div>
      </div>
      <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto hide-scrollbar">
        {bills
          .sort(
            (a: any, b: any) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
          )
          .map((b: any) => (
            <div
              key={b.id}
              className={`p-3 border rounded-xl flex items-center justify-between ${b.isPaid ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-rose-100 shadow-sm"}`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePaid(b.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${b.isPaid ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300"}`}
                >
                  {b.isPaid && <Check className="w-3 h-3" />}
                </button>
                <div>
                  <span
                    className={`font-bold text-sm flex items-center gap-2 ${b.isPaid ? "text-slate-500 line-through" : "text-slate-800"}`}
                  >
                    {b.name}
                    {b.isRecurring && (
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 normal-case no-underline">
                        {b.frequency}
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-semibold text-rose-500">
                    {new Date(b.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800 text-sm">
                  ₹{b.amount}
                </span>
                {!b.isPaid && (
                  <button
                    onClick={() => handleQuickPay(b)}
                    className="px-2 py-1 text-xs font-bold bg-[#5c40e8] text-white rounded-md active:scale-95 transition-transform"
                  >
                    Quick Pay
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
      <button
        onClick={onClose}
        className="w-full py-3 mt-2 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
      >
        Close
      </button>
    </div>
  );
}

function FamilySyncMock({
  onClose,
  profile,
  onUpdateProfile,
}: {
  onClose: () => void;
  profile?: UserProfile;
  onUpdateProfile?: any;
}) {
  const [joinCode, setJoinCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateFamily = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Generate random 6 character code
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      onUpdateProfile?.({ ...profile, householdId: newCode });
      setIsGenerating(false);
    }, 1000);
  };

  const handleJoinFamily = () => {
    if (joinCode.length >= 6) {
      onUpdateProfile?.({ ...profile, householdId: joinCode.toUpperCase() });
    }
  };

  const handleLeaveFamily = () => {
    if (
      confirm(
        "Are you sure you want to leave this family group? Your local data will stop syncing.",
      )
    ) {
      onUpdateProfile?.({ ...profile, householdId: "" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
        <Users className="w-8 h-8" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Family Sync</h3>
        <p className="text-slate-500 text-sm mb-4">
          Share your expenses and budget with family members in real-time using
          Firebase.
        </p>
      </div>

      {profile?.householdId ? (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-center space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Your Family Code
            </p>
            <h4 className="font-extrabold text-3xl tracking-widest text-[#5c40e8]">
              {profile.householdId}
            </h4>
          </div>
          <p className="text-sm text-slate-600">
            Share this code with your family members so they can sync expenses
            with you. Data sync is active.
          </p>
          <button
            onClick={handleLeaveFamily}
            className="w-full mt-4 py-3 bg-rose-50 text-rose-500 font-bold rounded-xl active:scale-[0.98]"
          >
            Leave Family Group
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              placeholder="Enter 6-digit Code"
              value={joinCode}
              maxLength={6}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5c40e8] uppercase font-bold tracking-widest"
            />
            <button
              onClick={handleJoinFamily}
              disabled={joinCode.length < 6}
              className="bg-[#5c40e8] text-white px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              Join
            </button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-slate-400 font-bold uppercase">
                OR
              </span>
            </div>
          </div>

          <button
            onClick={handleCreateFamily}
            disabled={isGenerating}
            className="w-full py-4 bg-slate-50 text-[#5c40e8] border border-slate-200 font-bold rounded-xl active:scale-[0.98] disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Create New Family Group"}
          </button>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full py-4 mt-2 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98]"
      >
        Close
      </button>
    </div>
  );
}

function ReceiptScannerMock({
  onClose,
  onAddTransaction,
}: {
  onClose: () => void;
  onAddTransaction: any;
}) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        setImagePreview(base64data);

        const response = await fetch("/api/scan-receipt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64: base64data }),
        });

        if (!response.ok) {
          throw new Error("Failed to parse receipt");
        }

        const data = await response.json();

        onAddTransaction({
          type: "Expense",
          amount: data.amount || 0,
          category: data.category || "Shopping",
          note: data.note || "Scanned Receipt",
        });

        setScanning(false);
        onClose();
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setError("Could not read receipt. Please try again.");
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4 text-center">
      {!imagePreview ? (
        <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 relative">
          <ScanLine
            className={`w-12 h-12 ${scanning ? "animate-pulse" : ""}`}
          />
          {scanning && (
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
          )}
        </div>
      ) : (
        <div className="relative w-32 h-40 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-orange-500">
          <img
            src={imagePreview}
            alt="Receipt preview"
            className="w-full h-full object-cover"
          />
          {scanning && (
            <div className="absolute inset-0 bg-orange-500/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          AI Receipt Scanner
        </h3>
        <p className="text-slate-500 text-sm">
          Upload or capture a receipt to automatically log the expense using
          Gemini AI.
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl">
          {error}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {!scanning ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" /> Capture / Upload Receipt
        </button>
      ) : (
        <div className="py-4 text-orange-500 font-bold animate-pulse flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" /> Analyzing Receipt with AI...
        </div>
      )}

      <button
        onClick={onClose}
        disabled={scanning}
        className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98] disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}

function RationPredictorMock({
  onClose,
  rationItems,
  setRationItems,
}: {
  onClose: () => void;
  rationItems: any[];
  setRationItems: any;
}) {
  const [analyzing, setAnalyzing] = useState(false);

  const handlePredict = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setRationItems([
        ...rationItems,
        {
          id: Date.now().toString() + "1",
          name: "Rice (5kg) - AI Suggestion",
          estimatedAmount: 350,
          isPurchased: false,
        },
        {
          id: Date.now().toString() + "2",
          name: "Cooking Oil (2L) - AI Suggestion",
          estimatedAmount: 280,
          isPurchased: false,
        },
      ]);
      onClose();
    }, 2000);
  };

  return (
    <div className="space-y-4 text-center">
      <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 relative">
        <Sparkles className={`w-10 h-10 ${analyzing ? "animate-spin" : ""}`} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Smart Ration Predictor
        </h3>
        <p className="text-slate-500 text-sm">
          Based on your past purchases and family size, GharManager can predict
          what you might need this month.
        </p>
      </div>

      {!analyzing ? (
        <button
          onClick={handlePredict}
          className="w-full py-4 bg-[#8b5cf6] text-white font-bold rounded-xl active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Bot className="w-5 h-5" /> Run AI Analysis
        </button>
      ) : (
        <div className="py-4 text-[#8b5cf6] font-bold animate-pulse">
          Analyzing Purchase History...
        </div>
      )}

      <button
        onClick={onClose}
        disabled={analyzing}
        className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-[0.98] disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
