
import React, { useState } from 'react';
import { Expense } from '../types';
import { ArrowDownCircle, Plus, ShoppingBag, Lightbulb, Home } from 'lucide-react';

interface ExpenseTrackerProps {
  expenses: Expense[];
  onAddExpense: (e: Omit<Expense, 'id'>) => void;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ expenses, onAddExpense }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Supplies');

  const handleAdd = () => {
    if (!title || !amount) return;
    onAddExpense({
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString()
    });
    setTitle('');
    setAmount('');
  };

  const getIcon = (cat: string) => {
    if (cat === 'Rent') return <Home size={18} />;
    if (cat === 'Bills') return <Lightbulb size={18} />;
    return <ShoppingBag size={18} />;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ArrowDownCircle className="text-rose-500" /> Record Expense
        </h2>
        <div className="space-y-4">
          <input 
            placeholder="What did you pay for?"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-rose-500/20"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input 
              type="number"
              placeholder="Amount ₹"
              className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-rose-500/20"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <select 
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option>Supplies</option>
              <option>Rent</option>
              <option>Bills</option>
              <option>Salary</option>
            </select>
          </div>
          <button 
            onClick={handleAdd}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Plus size={20} /> ADD EXPENSE
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 px-2">Expense History</h3>
        {expenses.map(e => (
          <div key={e.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-50 rounded-2xl text-rose-500">
                {getIcon(e.category)}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{e.title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{e.category} • {new Date(e.date).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="font-bold text-rose-600">-₹{e.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTracker;
