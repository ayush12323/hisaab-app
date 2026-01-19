
import React, { useState } from 'react';
import { Udhaar } from '../types';
import { UserPlus, Search, Phone, CheckCircle } from 'lucide-react';

interface KhataBookProps {
  khata: Udhaar[];
  onAddUdhaar: (u: Omit<Udhaar, 'id'>) => void;
  onSettle: (id: string) => void;
}

const KhataBook: React.FC<KhataBookProps> = ({ khata, onAddUdhaar, onSettle }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [search, setSearch] = useState('');

  const handleAdd = () => {
    if (!name || !amount) return;
    onAddUdhaar({
      customerName: name,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      status: 'pending'
    });
    setName('');
    setAmount('');
  };

  const filtered = khata.filter(u => u.customerName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <UserPlus size={20} /> Add Udhaar Entry
        </h2>
        <div className="space-y-3">
          <input 
            placeholder="Customer Name"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/60 outline-none"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div className="flex gap-2">
            <input 
              type="number"
              placeholder="Amount (₹)"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/60 outline-none"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button 
              onClick={handleAdd}
              className="bg-white text-indigo-600 font-bold px-6 rounded-xl active:scale-95 transition-transform"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          placeholder="Search Customer..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filtered.map(u => (
          <div key={u.id} className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${
            u.status === 'settled' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                u.status === 'settled' ? 'bg-slate-200 text-slate-500' : 'bg-rose-100 text-rose-600'
              }`}>
                {u.customerName[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-800">{u.customerName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(u.date).toDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-black text-lg ${u.status === 'settled' ? 'text-slate-400 line-through' : 'text-rose-600'}`}>
                ₹{u.amount}
              </p>
              {u.status === 'pending' && (
                <button 
                  onClick={() => onSettle(u.id)}
                  className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 ml-auto"
                >
                  <CheckCircle size={12} /> MARK PAID
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KhataBook;
