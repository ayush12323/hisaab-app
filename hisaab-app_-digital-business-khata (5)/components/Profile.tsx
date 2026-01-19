
import React, { useState } from 'react';
import { ShopDetails, User as UserType } from '../types';
import { 
  User, 
  Phone, 
  Store, 
  Settings, 
  LogOut, 
  ChevronRight, 
  QrCode, 
  Share2,
  HelpCircle,
  FileText,
  ArrowLeft,
  Save,
  Mail,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ProfileProps {
  shop: ShopDetails;
  setShop: (s: ShopDetails) => void;
  salesCount: number;
  onLogout: () => void;
  user: UserType;
}

type SubView = 'main' | 'shopSettings' | 'support' | 'billing' | 'faq';

const Profile: React.FC<ProfileProps> = ({ shop, setShop, salesCount, onLogout, user }) => {
  const [subView, setSubView] = useState<SubView>('main');

  // Shop Settings State
  const [tempShop, setTempShop] = useState<ShopDetails>(shop);

  const handleSaveShop = (e: React.FormEvent) => {
    e.preventDefault();
    setShop(tempShop);
    setSubView('main');
  };

  const renderMain = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Business Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden text-center">
        <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black mx-auto mb-4 shadow-lg shadow-blue-100">
          {user.name ? user.name[0] : 'U'}
        </div>
        <h2 className="text-2xl font-black text-slate-900">{shop.name}</h2>
        <p className="text-slate-500 font-bold text-xs mt-1">{user.email}</p>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center justify-center gap-2">
          <Store size={12} /> {shop.owner}
        </p>
        
        <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-[9px] font-black text-slate-400 uppercase">Total Deals</p>
            <p className="text-xl font-black text-slate-900">{salesCount}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl">
            <p className="text-[9px] font-black text-blue-400 uppercase">Plan Type</p>
            <p className="text-xl font-black text-blue-600">PREMIUM</p>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-slate-900 rounded-[2rem] p-6 text-white text-center space-y-4 shadow-xl">
        <div className="bg-white p-4 rounded-2xl inline-block shadow-lg">
          <QrCode size={120} className="text-slate-900" />
        </div>
        <div>
          <h3 className="font-bold">My Business QR</h3>
          <p className="text-xs text-slate-400">Share this to receive direct payments</p>
        </div>
        <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors active:scale-95">
          <Share2 size={16} /> SHARE QR CODE
        </button>
      </div>

      {/* Settings Options */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Account Settings</h3>
        <ProfileOption icon={Settings} label="Shop Settings" onClick={() => setSubView('shopSettings')} />
        <ProfileOption icon={Phone} label="Contact Support" onClick={() => setSubView('support')} />
        <ProfileOption icon={FileText} label="Billing History" onClick={() => setSubView('billing')} />
        <ProfileOption icon={HelpCircle} label="FAQs & Help" onClick={() => setSubView('faq')} />
        <ProfileOption icon={LogOut} label="Log Out" color="text-rose-500" onClick={onLogout} />
      </div>
    </div>
  );

  const renderShopSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setSubView('main')} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-slate-900">Shop Settings</h2>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30">
        <form onSubmit={handleSaveShop} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
            <input 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all font-bold"
              value={tempShop.name}
              onChange={e => setTempShop({...tempShop, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Owner Name</label>
            <input 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all font-bold"
              value={tempShop.owner}
              onChange={e => setTempShop({...tempShop, owner: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
            <input 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all font-bold"
              value={tempShop.phone}
              onChange={e => setTempShop({...tempShop, phone: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
          >
            <Save size={20} /> SAVE CHANGES
          </button>
        </form>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setSubView('main')} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-slate-900">Contact Support</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
            <MessageCircle size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900">We're here to help!</h3>
          <p className="text-slate-500 text-sm mt-2">Our team is available 24/7 for your business needs.</p>
        </div>

        <div className="space-y-3">
          <SupportItem icon={Mail} label="Email Support" value="support@hisaabapp.in" />
          <SupportItem icon={Phone} label="Call Support" value="+91 98765-43210" />
          <SupportItem icon={MessageCircle} label="WhatsApp Business" value="+91 88776-65544" />
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setSubView('main')} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-slate-900">Billing History</h2>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Subscription</p>
          <div className="flex justify-between items-center mt-2">
            <h3 className="text-xl font-black text-blue-600">Premium Plan</h3>
            <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Active</span>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mt-2">Recent Invoices</h4>
          <div className="space-y-3">
             <InvoiceItem date="15 Aug 2024" amount="₹499" id="#HS-9821" />
             <InvoiceItem date="15 July 2024" amount="₹499" id="#HS-9712" />
             <InvoiceItem date="15 June 2024" amount="₹499" id="#HS-9601" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setSubView('main')} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-slate-900">FAQs & Help</h2>
      </div>

      <div className="space-y-3">
        <FAQItem 
          question="How do I backup my data?" 
          answer="Hisaab App automatically backs up your data to your secure cloud account every time you open the app. You don't need to do anything manually!" 
        />
        <FAQItem 
          question="Can I use this on multiple devices?" 
          answer="Yes! Simply log in with your same Email ID on any other Android device to sync all your shop records instantly." 
        />
        <FAQItem 
          question="Is my customer data private?" 
          answer="Absolutely. We use banking-grade encryption to ensure your business and customer details stay between you and your shop." 
        />
        <FAQItem 
          question="How to export reports?" 
          answer="Go to the Reports section and click on the 'Share' icon to download your monthly statements in PDF format." 
        />
      </div>
    </div>
  );

  return (
    <div className="pb-10 min-h-[60vh]">
      {subView === 'main' && renderMain()}
      {subView === 'shopSettings' && renderShopSettings()}
      {subView === 'support' && renderSupport()}
      {subView === 'billing' && renderBilling()}
      {subView === 'faq' && renderFAQ()}
    </div>
  );
};

const ProfileOption = ({ icon: Icon, label, color = "text-slate-700", onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between group active:bg-slate-50 transition-all shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-inner">
        <Icon size={20} className={color} />
      </div>
      <span className={`font-bold ${color}`}>{label}</span>
    </div>
    <ChevronRight size={18} className="text-slate-300" />
  </button>
);

const SupportItem = ({ icon: Icon, label, value }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
    <ExternalLink size={14} className="text-slate-300" />
  </div>
);

const InvoiceItem = ({ date, amount, id }: any) => (
  <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between group hover:bg-blue-50/50 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm">
        <FileText size={16} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800">{date}</p>
        <p className="text-[10px] font-black text-slate-400">{id}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-slate-900">{amount}</p>
      <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">Receipt</button>
    </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left transition-colors hover:bg-slate-50"
      >
        <span className="font-bold text-slate-800 pr-4">{question}</span>
        {isOpen ? <ChevronUp size={18} className="text-blue-600" /> : <ChevronDown size={18} className="text-slate-300" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 animate-fade-in">
          <div className="h-px bg-slate-50 mb-4"></div>
          <p className="text-sm text-slate-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
