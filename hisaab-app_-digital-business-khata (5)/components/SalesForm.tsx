
import React, { useState } from 'react';
import { Sale, Product } from '../types';
import { Plus, Search, Trash2 } from 'lucide-react';

interface SalesFormProps {
  products: Product[];
  sales: Sale[];
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
}

const SalesForm: React.FC<SalesFormProps> = ({ products, sales, onAddSale }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    onAddSale({
      productId: product.id,
      productName: product.name,
      quantity,
      totalPrice: product.price * quantity,
      date: new Date().toISOString()
    });

    setSelectedProductId('');
    setQuantity(1);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Plus className="text-indigo-600" /> New Transaction
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search product..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
            {filteredProducts.slice(0, 10).map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProductId(p.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl border transition-all ${
                  selectedProductId === p.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white font-bold' 
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {p.name}
                <div className="text-[10px] opacity-70">₹{p.price}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
            <span className="text-sm font-bold text-slate-600 uppercase">Quantity</span>
            <div className="flex items-center gap-4 ml-auto">
              <button 
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 font-bold"
              >–</button>
              <span className="font-bold text-lg w-6 text-center">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 font-bold"
              >+</button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedProductId}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 disabled:bg-slate-300 active:scale-95 transition-all"
          >
            RECORD SALE
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 px-2">Daily History</h3>
        {sales.slice(0, 10).map((sale) => (
          <div key={sale.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-100 shadow-sm">
            <div>
              <p className="font-bold text-slate-800">{sale.productName}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{sale.quantity} items • {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <p className="font-black text-indigo-600">₹{sale.totalPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesForm;
