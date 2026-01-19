
import React, { useState, useEffect } from 'react';
import { BulkOffer } from '../types';
import { getBulkMarketOffers, getBulkProfitProjection } from '../services/geminiService';
import { 
  ShoppingCart, 
  MapPin, 
  TrendingDown, 
  Tag, 
  Sparkles, 
  Search, 
  Loader2, 
  ArrowRight, 
  X, 
  Minus, 
  Plus, 
  MessageCircle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Phone,
  Verified
} from 'lucide-react';

const Marketplace: React.FC = () => {
  const [offers, setOffers] = useState<BulkOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  
  // Selection State
  const [selectedOffer, setSelectedOffer] = useState<BulkOffer | null>(null);
  const [qty, setQty] = useState(1);
  const [projection, setProjection] = useState('');
  const [projecting, setProjecting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    const data = await getBulkMarketOffers();
    setOffers(data);
    setLoading(false);
  };

  const handleSelectOffer = async (offer: BulkOffer) => {
    setSelectedOffer(offer);
    setQty(offer.minQty);
    setOrderSuccess(false);
    setProjecting(true);
    const text = await getBulkProfitProjection(offer, offer.minQty);
    setProjection(text);
    setProjecting(false);
  };

  const updateQty = async (newQty: number) => {
    if (selectedOffer && newQty >= selectedOffer.minQty) {
      setQty(newQty);
      setProjecting(true);
      const text = await getBulkProfitProjection(selectedOffer, newQty);
      setProjection(text);
      setProjecting(false);
    }
  };

  const handlePlaceOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setSelectedOffer(null);
      setOrderSuccess(false);
    }, 3000);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (offer: BulkOffer, quantity: number) => {
    const text = `Namaste! Main Hisaab App se baat kar raha hoon. Mujhe aapka deal pasand aaya: ${offer.name} (${quantity} units). Kya ye abhi stock mein available hai?`;
    window.open(`https://wa.me/91${offer.sellerPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const categories = ['All', 'Grains', 'Oil', 'Snacks', 'Spices'];

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-slate-900">Wholesale Mandi</h1>
          <div className="bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={12} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Bulk Deals</span>
          </div>
        </div>
        <p className="text-slate-500 text-xs font-bold flex items-center gap-1">
          <MapPin size={12} /> Near Okhla Phase III, Delhi
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Search wholesale items..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-600/5 transition-all font-medium"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                filter === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Searching Nearby Mandis...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {offers.map(offer => (
            <button 
              key={offer.id} 
              onClick={() => handleSelectOffer(offer)}
              className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col gap-4 relative overflow-hidden group text-left transition-all active:scale-[0.98]"
            >
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-bl-3xl font-black text-[10px] tracking-tighter">
                {Math.round((offer.savings / offer.mrp) * 100)}% OFF
              </div>

              <div className="flex gap-4">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-200 transition-colors">
                  <Tag size={32} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{offer.category}</p>
                  <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">{offer.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-bold text-slate-400">{offer.unit} • Min: {offer.minQty}</span>
                    <Verified size={10} className="text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Bulk Price</p>
                  <p className="text-xl font-black text-slate-900">₹{offer.bulkPrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-emerald-500 uppercase">You Save</p>
                  <p className="text-xl font-black text-emerald-600">₹{offer.savings}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Checkout Sheet / Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-20 duration-300 relative">
            {orderSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Order Placed!</h2>
                <p className="text-slate-500 font-medium px-4">Aapka order vendor ko bhej diya gaya hai. Vo aapse jaldi contact karenge.</p>
              </div>
            ) : (
              <>
                <button onClick={() => setSelectedOffer(null)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
                
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{selectedOffer.category}</p>
                  <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Verified size={8} /> VERIFIED SELLER
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedOffer.name}</h2>
                <p className="text-slate-400 font-bold text-xs mt-1">Vendor: Balaji Mandi (+91 {selectedOffer.sellerPhone})</p>

                <div className="mt-8 space-y-6">
                  {/* Qty Selector */}
                  <div className="bg-slate-50 p-6 rounded-3xl flex items-center justify-between border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Quantity</p>
                      <p className="font-black text-slate-900 text-lg">{qty} x {selectedOffer.unit}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => updateQty(qty - 1)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-slate-900 font-black shadow-sm active:scale-90">
                        <Minus size={18} />
                      </button>
                      <span className="font-black text-xl w-6 text-center">{qty}</span>
                      <button onClick={() => updateQty(qty + 1)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-slate-900 font-black shadow-sm active:scale-90">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* AI Profit Insight */}
                  <div className="bg-indigo-600 rounded-3xl p-5 text-white flex items-start gap-4 shadow-lg shadow-indigo-100">
                    <div className="bg-white/20 p-2 rounded-xl mt-1">
                      <BrainCircuit size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mb-1">AI Profit Projection</p>
                      <p className={`text-sm font-bold leading-snug transition-opacity ${projecting ? 'opacity-30' : 'opacity-100'}`}>
                        {projecting ? "Hisaab laga rahe hain..." : `"${projection}"`}
                      </p>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleCall(selectedOffer.sellerPhone)}
                      className="bg-slate-100 text-slate-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Phone size={18} /> CALL NOW
                    </button>
                    <button 
                      onClick={() => handleWhatsApp(selectedOffer, qty)}
                      className="bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-100"
                    >
                      <MessageCircle size={18} /> WHATSAPP
                    </button>
                  </div>

                  <button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    PLACE ORDER <ArrowRight size={20} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Market Insight Bottom */}
      {!selectedOffer && (
        <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm">
            <TrendingDown className="text-blue-600" size={24} />
          </div>
          <div>
            <h4 className="font-black text-blue-900 text-sm">Market Intelligence</h4>
            <p className="text-xs text-blue-700/80 leading-relaxed mt-1">
              Bulk prices for <b>Grains</b> are down by 4% this week. This is a great time to restock your pantry items!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
