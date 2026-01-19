
import React, { useState, useEffect } from 'react';
import { Sale, Expense, Udhaar, ShopDetails, ViewMode } from '../types';
import { 
  TrendingUp, 
  TrendingDown,
  Wallet, 
  ArrowDownCircle, 
  ShoppingCart, 
  ArrowRight, 
  ChevronRight,
  Calculator,
  History,
  Store,
  CreditCard,
  Sparkles,
  Zap,
  Lightbulb,
  RefreshCw,
  Stars,
  ShoppingBag,
  Info
} from 'lucide-react';
import { getRandomBusinessTip } from '../services/geminiService';

interface DashboardProps {
  sales: Sale[];
  expenses: Expense[];
  khata: Udhaar[];
  shop: ShopDetails;
  setView: (v: ViewMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sales, expenses, khata, shop, setView }) => {
  const [aiTip, setAiTip] = useState('Thinking of a tip for you...');
  const [loadingTip, setLoadingTip] = useState(true);
  const [showMarketAlert, setShowMarketAlert] = useState(false);

  const fetchNewTip = async () => {
    setLoadingTip(true);
    const tip = await getRandomBusinessTip();
    setAiTip(tip);
    setLoadingTip(false);
  };

  useEffect(() => {
    fetchNewTip();
    // Randomly show market alert (30% chance)
    setShowMarketAlert(Math.random() > 0.7);
  }, []);

  const totalSales = sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalUdhaar = khata.filter(u => u.status === 'pending').reduce((sum, u) => sum + u.amount, 0);
  const netBalance = totalSales - totalExpenses;

  const services = [
    { label: 'Record Sale', icon: Calculator, color: 'bg-blue-50 text-blue-600', view: 'sales' as ViewMode },
    { label: 'Add Expense', icon: ArrowDownCircle, color: 'bg-rose-50 text-rose-600', view: 'expenses' as ViewMode },
    { label: 'Bulk Market', icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600', view: 'market' as ViewMode },
    { label: 'Khata Book', icon: Store, color: 'bg-amber-50 text-amber-600', view: 'khata' as ViewMode },
  ];

  return (
    <div className="space-y-6">
      {/* Live AI Coach Card */}
      <div className="bg-indigo-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-100 animate-fade-in group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <Stars size={80} className="text-white" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Zap size={18} className="text-amber-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">AI Business Coach</span>
          </div>
          <button onClick={fetchNewTip} disabled={loadingTip} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <RefreshCw size={14} className={`${loadingTip ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className={`text-lg font-bold leading-tight min-h-[3rem] transition-all ${loadingTip ? 'opacity-50 blur-sm' : 'opacity-100'}`}>"{aiTip}"</p>
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
          <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Random Tip of the Hour</p>
          <button onClick={() => setView('reports')} className="text-[9px] font-black bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all">SEE FULL ANALYSIS</button>
        </div>
      </div>

      {/* Market Hot Deal Alert - Randomly appearing */}
      {showMarketAlert && (
        <button 
          onClick={() => setView('market')}
          className="w-full bg-emerald-600 rounded-3xl p-5 text-white flex items-center justify-between shadow-lg shadow-emerald-100 animate-bounce transition-transform active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-2xl">
              <TrendingDown size={24} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black text-emerald-200 uppercase tracking-widest">Hot Bulk Deal Nearby</p>
              <h4 className="text-sm font-black">Spices 20% Cheaper Today!</h4>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-50" />
        </button>
      )}

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2.5rem] p-7 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-[0.2em]">Current Net Balance</p>
            <h2 className="text-4xl font-black mt-1">₹{netBalance.toLocaleString('en-IN')}</h2>
          </div>
          <div className="bg-white/20 p-2 rounded-xl"><Wallet size={20} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
          <div><p className="text-[9px] text-blue-200 font-bold uppercase">Total Sales</p><p className="text-lg font-bold">₹{totalSales.toLocaleString('en-IN')}</p></div>
          <div className="border-l border-white/10 pl-4"><p className="text-[9px] text-blue-200 font-bold uppercase">Expenses</p><p className="text-lg font-bold">₹{totalExpenses.toLocaleString('en-IN')}</p></div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-5 px-1">Quick Services</h3>
        <div className="grid grid-cols-4 gap-4">
          {services.map((item, idx) => (
            <button key={idx} onClick={() => setView(item.view)} className="flex flex-col items-center gap-2 group">
              <div className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-active:scale-90 shadow-sm border border-white/50`}><item.icon size={22} /></div>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity Mini List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Recent Sales</h3>
          <button onClick={() => setView('sales')} className="text-[10px] font-bold text-blue-600 flex items-center gap-1">VIEW ALL <ArrowRight size={10} /></button>
        </div>
        <div className="space-y-3">
          {sales.length === 0 ? (
            <div className="bg-white p-8 rounded-[2rem] text-center border border-dashed border-slate-200"><p className="text-slate-400 text-xs font-medium">No sales recorded yet.</p></div>
          ) : (
            sales.slice(0, 4).map(sale => (
              <div key={sale.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-50 shadow-sm hover:border-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold">{sale.productName[0]}</div>
                  <div><p className="font-bold text-slate-800 text-sm">{sale.productName}</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • QTY {sale.quantity}</p></div>
                </div>
                <p className="font-black text-blue-600">+₹{sale.totalPrice}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
