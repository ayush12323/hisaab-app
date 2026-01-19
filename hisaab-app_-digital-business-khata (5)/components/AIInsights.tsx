
import React, { useState } from 'react';
import { Sale, Product, Expense, BusinessInsight } from '../types';
import { getBusinessInsights } from '../services/geminiService';
import { Sparkles, BrainCircuit, RefreshCw, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AIInsightsProps {
  sales: Sale[];
  inventory: Product[];
  expenses: Expense[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ sales, inventory, expenses }) => {
  const [insight, setInsight] = useState<BusinessInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (sales.length === 0) return;
    setLoading(true);
    try {
      const result = await getBusinessInsights(sales, inventory, expenses);
      setInsight(result);
    } finally {
      setLoading(false);
    }
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-emerald-500" />;
      case 'down': return <TrendingDown className="text-rose-500" />;
      default: return <Minus className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-600 rounded-3xl mb-2">
          <BrainCircuit size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight px-4">Samajhdaar Advice (AI)</h1>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Aapke dhande ko badhane ke liye Gemini AI ki madad lein.
        </p>
        
        <button
          onClick={generateReport}
          disabled={loading || sales.length === 0}
          className="bg-indigo-600 text-white w-full max-w-xs py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-indigo-100 disabled:bg-slate-300"
        >
          {loading ? (
            <RefreshCw className="animate-spin" size={20} />
          ) : (
            <Sparkles size={20} />
          )}
          {loading ? "Hisab Kar Rahe Hain..." : "Get Smart Tips"}
        </button>
      </div>

      {insight && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-indigo-100/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendIcon trend={insight.trend} />
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Kaisa Hai Dhanda?</h2>
              </div>
            </div>

            <p className="text-md text-slate-700 leading-relaxed font-medium">
              "{insight.summary}"
            </p>

            <div className="space-y-4">
              <h3 className="font-black text-[10px] text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={14} /> Top Advice for You
              </h3>
              <div className="space-y-3">
                {insight.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="bg-white text-indigo-600 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border border-slate-100 shadow-sm">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 text-sm font-semibold">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Analysis updated just now</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
