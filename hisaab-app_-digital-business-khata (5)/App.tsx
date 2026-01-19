
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  NotebookTabs, 
  Package, 
  Plus, 
  Bell, 
  Heart, 
  ArrowDownCircle, 
  UserCircle, 
  QrCode,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { Sale, Product, Expense, Udhaar, ViewMode, ShopDetails, User } from './types';
import Dashboard from './components/Dashboard';
import SalesForm from './components/SalesForm';
import Inventory from './components/Inventory';
import ExpenseTracker from './components/ExpenseTracker';
import KhataBook from './components/KhataBook';
import Profile from './components/Profile';
import Onboarding from './components/Onboarding';
import Splash from './components/Splash';
import AIInsights from './components/AIInsights';
import Auth from './components/Auth';
import Marketplace from './components/Marketplace';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Chai Patti 250g', category: 'Grocery', price: 120 },
  { id: '2', name: 'Milk 1L Packet', category: 'Dairy', price: 66 },
  { id: '3', name: 'Bread Big', category: 'Bakery', price: 50 },
];

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hisaab_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<ViewMode>(() => {
    return localStorage.getItem('hisaab_onboarded') ? 'dashboard' : 'onboarding';
  });
  
  const [shop, setShop] = useState<ShopDetails>(() => {
    const saved = localStorage.getItem('hisaab_shop');
    return saved ? JSON.parse(saved) : { name: 'Apni Dukaan', owner: 'Ayush Thakur', phone: '9876543210' };
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('hisaab_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hisaab_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('hisaab_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [khata, setKhata] = useState<Udhaar[]>(() => {
    const saved = localStorage.getItem('hisaab_khata');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('hisaab_sales', JSON.stringify(sales));
    localStorage.setItem('hisaab_products', JSON.stringify(products));
    localStorage.setItem('hisaab_expenses', JSON.stringify(expenses));
    localStorage.setItem('hisaab_khata', JSON.stringify(khata));
    localStorage.setItem('hisaab_shop', JSON.stringify(shop));
    if (user) {
      localStorage.setItem('hisaab_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hisaab_user');
    }
  }, [sales, products, expenses, khata, shop, user]);

  const handleAuthComplete = (newUser: User) => setUser(newUser);
  const handleLogout = () => { setUser(null); localStorage.removeItem('hisaab_onboarded'); setView('onboarding'); };
  const completeOnboarding = () => { localStorage.setItem('hisaab_onboarded', 'true'); setView('dashboard'); };
  const addSale = (sale: Omit<Sale, 'id'>) => { setSales([{ ...sale, id: Date.now().toString() }, ...sales]); setView('dashboard'); };
  const addExpense = (exp: Omit<Expense, 'id'>) => setExpenses([{ ...exp, id: Date.now().toString() }, ...expenses]);
  const addUdhaar = (u: Omit<Udhaar, 'id'>) => setKhata([{ ...u, id: Date.now().toString() }, ...khata]);
  const settleUdhaar = (id: string) => setKhata(khata.map(u => u.id === id ? { ...u, status: 'settled' } : u));

  const NavItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: ViewMode }) => (
    <button
      onClick={() => setView(id)}
      className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
        view === id ? 'text-blue-600 scale-110' : 'text-slate-400'
      }`}
    >
      <Icon size={20} strokeWidth={view === id ? 2.5 : 2} />
      <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
    </button>
  );

  if (showSplash) return <Splash />;
  if (!user) return <Auth onAuthComplete={handleAuthComplete} />;
  if (view === 'onboarding') return <Onboarding onComplete={completeOnboarding} />;

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200">
      <header className="bg-white px-5 py-4 flex justify-between items-center sticky top-0 z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <button onClick={() => setView('profile')} className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200 overflow-hidden">
            {user.name ? user.name[0] : 'U'}
          </button>
          <div>
            <h1 className="font-bold text-slate-900 text-sm leading-none flex items-center gap-1">
              {shop.name} <ArrowRight size={10} className="text-slate-300" />
            </h1>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Premium Business</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('profile')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <QrCode size={20} />
          </button>
          <button className="p-2 text-slate-400 relative">
            <Bell size={20} />
            {khata.filter(u => u.status === 'pending').length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28 px-4 pt-4 space-y-6 scroll-smooth no-scrollbar">
        {view === 'dashboard' && <Dashboard sales={sales} expenses={expenses} khata={khata} setView={setView} shop={shop} />}
        {view === 'sales' && <SalesForm products={products} onAddSale={addSale} sales={sales} />}
        {view === 'expenses' && <ExpenseTracker expenses={expenses} onAddExpense={addExpense} />}
        {view === 'khata' && <KhataBook khata={khata} onAddUdhaar={addUdhaar} onSettle={settleUdhaar} />}
        {view === 'inventory' && <Inventory products={products} sales={sales} onAddProduct={(p) => setProducts([...products, { ...p, id: Date.now().toString() }])} />}
        {view === 'profile' && <Profile shop={shop} setShop={setShop} salesCount={sales.length} onLogout={handleLogout} user={user} />}
        {view === 'reports' && <AIInsights sales={sales} inventory={products} expenses={expenses} />}
        {view === 'market' && <Marketplace />}

        <div className="pt-10 pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8 bg-slate-200"></div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Hisaab App v2.0</p>
            <div className="h-px w-8 bg-slate-200"></div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center justify-center gap-1">
            Made with <Heart size={10} className="text-rose-400 fill-rose-400" /> by <span className="text-slate-700">Ayush Thakur</span>
          </p>
        </div>
      </main>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <button onClick={() => setView('sales')} className="bg-blue-600 text-white p-4 rounded-2xl shadow-[0_8px_25px_rgba(37,99,235,0.4)] active:scale-90 transition-all group flex items-center gap-2">
          <Plus size={24} className="group-active:rotate-90 transition-transform" />
          <span className="font-bold text-sm pr-1">SALE</span>
        </button>
      </div>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 bottom-nav-blur border-t border-slate-100 flex items-center px-4 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <NavItem icon={LayoutDashboard} label="Home" id="dashboard" />
        <NavItem icon={ShoppingBag} label="Market" id="market" />
        <div className="w-20"></div>
        <NavItem icon={Package} label="Stock" id="inventory" />
        <NavItem icon={UserCircle} label="Me" id="profile" />
      </nav>
    </div>
  );
};

export default App;
