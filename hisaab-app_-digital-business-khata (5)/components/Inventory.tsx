
import React, { useState, useRef, useEffect } from 'react';
import { Product, Sale } from '../types';
import { 
  Package, 
  Tag, 
  Plus, 
  Sparkles, 
  BrainCircuit, 
  RefreshCw, 
  X, 
  Camera, 
  Scan, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getProductAdvice, analyzeScannedProduct } from '../services/geminiService';

interface InventoryProps {
  products: Product[];
  sales: Sale[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, sales, onAddProduct }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  
  const [activeAdvice, setActiveAdvice] = useState<{id: string, text: string} | null>(null);
  const [loadingAdviceId, setLoadingAdviceId] = useState<string | null>(null);

  // Scanner States
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [scanError, setScanError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isScanning) {
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          setScanError('Camera access denied. Please check permissions.');
          setIsScanning(false);
        }
      };
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanning]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsProcessingImage(true);
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    
    const result = await analyzeScannedProduct(base64);
    
    if (result) {
      setName(result.name);
      setPrice(result.price.toString());
      setCategory(result.category);
      setIsScanning(false);
    } else {
      setScanError('Could not identify item. Try again with better lighting.');
    }
    setIsProcessingImage(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    onAddProduct({
      name,
      price: parseFloat(price),
      category: category || 'General'
    });
    setName('');
    setPrice('');
    setCategory('');
  };

  const fetchAdvice = async (product: Product) => {
    setLoadingAdviceId(product.id);
    const count = sales.filter(s => s.productId === product.id).length;
    const advice = await getProductAdvice(product, count);
    setActiveAdvice({ id: product.id, text: advice });
    setLoadingAdviceId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Shop Catalog</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage Inventory</p>
        </div>
        <div className="bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-indigo-100">
          <Sparkles size={12} className="text-indigo-600" />
          <span className="text-[10px] font-black text-indigo-600 uppercase">AI Vision enabled</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Tag className="text-blue-600" size={18} /> Add New Item
          </h2>
          <button 
            onClick={() => setIsScanning(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-blue-100"
          >
            <Scan size={14} /> AI SCANNER
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Item Name (e.g. Kurkure Large)"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all font-bold"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="0.01"
              required
              placeholder="Price (₹)"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all font-bold"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Category"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all font-bold"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> ADD TO CATALOG
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-24">
        {products.map(product => (
          <div key={product.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-3 relative group hover:border-blue-100 transition-all">
            <div className="absolute top-3 right-3">
              <button 
                onClick={() => fetchAdvice(product)}
                disabled={loadingAdviceId === product.id}
                className={`p-2 rounded-xl border transition-all ${
                  loadingAdviceId === product.id ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                {loadingAdviceId === product.id ? <RefreshCw size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
              </button>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-blue-50 transition-colors">
              <Package className="text-slate-400 group-hover:text-blue-500" size={24} />
            </div>
            
            <div className="w-full">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{product.category}</p>
              <h3 className="font-bold text-slate-800 text-sm truncate mt-1">{product.name}</h3>
              <p className="text-lg font-black text-blue-600 mt-1">₹{product.price}</p>
            </div>

            {activeAdvice?.id === product.id && (
              <div className="absolute inset-0 bg-indigo-600/95 rounded-[2rem] p-4 flex flex-col items-center justify-center text-white z-10 animate-fade-in overflow-hidden text-center">
                <button 
                  onClick={() => setActiveAdvice(null)}
                  className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full"
                >
                  <X size={16} />
                </button>
                <Sparkles size={20} className="mb-2 text-indigo-200" />
                <p className="text-[10px] font-bold italic leading-tight px-1">
                  "{activeAdvice.text}"
                </p>
                <button 
                  onClick={() => setActiveAdvice(null)}
                  className="mt-3 text-[9px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full"
                >
                  Got it
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Scanner Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col">
          <div className="p-6 flex justify-between items-center text-white">
            <button onClick={() => setIsScanning(false)} className="p-2 bg-white/10 rounded-full">
              <X size={24} />
            </button>
            <h2 className="font-black text-sm uppercase tracking-[0.2em]">AI Vision Scanner</h2>
            <div className="w-10"></div>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            {isProcessingImage && (
              <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-white" size={48} />
                <p className="text-white font-black text-xs uppercase tracking-widest">Identifying Item...</p>
              </div>
            )}
            
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            
            {/* Scan Frame */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/50 rounded-3xl flex items-center justify-center pointer-events-none">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
              
              <div className="w-full h-0.5 bg-blue-500/50 absolute top-1/2 animate-pulse"></div>
            </div>

            {scanError && (
              <div className="absolute bottom-32 left-8 right-8 bg-rose-500 text-white p-4 rounded-2xl flex items-center gap-3 animate-bounce">
                <AlertCircle size={20} />
                <p className="text-[10px] font-black uppercase tracking-widest">{scanError}</p>
              </div>
            )}
          </div>

          <div className="p-10 bg-slate-900 flex flex-col items-center gap-6">
            <p className="text-slate-400 text-xs font-bold text-center">Place the product inside the square frame<br/>and make sure it is clearly visible.</p>
            <button 
              onClick={handleCapture}
              disabled={isProcessingImage}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center active:scale-90 transition-all border-4 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Camera size={28} />
              </div>
            </button>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Click to Capture</p>
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

export default Inventory;
