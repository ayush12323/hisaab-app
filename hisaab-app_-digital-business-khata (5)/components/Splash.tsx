
import React from 'react';
import { NotebookTabs } from 'lucide-react';

const Splash: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        {/* Animated Background Ring */}
        <div className="absolute inset-0 bg-blue-100 rounded-[2.5rem] blur-2xl animate-pulse scale-150 opacity-50"></div>
        
        {/* Logo Container */}
        <div className="relative bg-blue-600 w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
          <NotebookTabs size={48} strokeWidth={2.5} />
        </div>
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Hisaab<span className="text-blue-600">App</span>
        </h1>
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1">
          Premium Business Utility
        </p>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 text-center">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          DIGITAL INDIA • SAFE & SECURE
        </p>
        <p className="text-[10px] font-bold text-slate-700 mt-2">
          Made by <span className="font-black">Ayush Thakur</span>
        </p>
      </div>
      
      {/* Loading Indicator */}
      <div className="absolute bottom-24 flex gap-1">
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default Splash;
