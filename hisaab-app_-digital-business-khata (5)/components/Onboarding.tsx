
import React from 'react';
import { NotebookTabs, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col p-8 max-w-md mx-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50 rounded-full -ml-24 -mb-24 -z-10"></div>

      <div className="mt-20 mb-auto space-y-8">
        <div className="bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 animate-bounce">
          <NotebookTabs size={40} />
        </div>
        
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            Digital India ka <br />
            <span className="text-blue-600">Digital Hisaab</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-medium">
            Manage your shop's sales, expenses, and credit (Khata) in one powerful app.
          </p>
        </div>

        <div className="space-y-5 pt-4">
          <FeatureItem icon={ShieldCheck} text="100% Safe and Secure Data" />
          <FeatureItem icon={CheckCircle2} text="Daily Profit Tracking" />
          <FeatureItem icon={Sparkles} text="Premium Business Reports" />
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <button 
          onClick={onComplete}
          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group active:scale-95 transition-all"
        >
          START MY BUSINESS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Trusted by 10,000+ Shop Owners
        </p>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-4 group">
    <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      <Icon size={18} />
    </div>
    <span className="font-bold text-slate-700">{text}</span>
  </div>
);

export default Onboarding;
