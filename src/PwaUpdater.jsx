import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, ArrowUpCircle } from 'lucide-react';

const PwaUpdater = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // প্রতি ১ ঘণ্টা পর পর আপডেটের জন্য চেক করবে
      r && setInterval(() => { r.update() }, 60 * 60 * 1000);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  // যদি আপডেট না থাকে, তবে কিছুই দেখাবে না
  if (!needRefresh) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-800 border border-emerald-500/30 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl shadow-emerald-900/20 transform transition-all scale-100 animate-slideUp">
        
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ArrowUpCircle className="w-8 h-8 text-emerald-400 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Update Available!</h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          অ্যাপটির নতুন ভার্সন পেতে এখনই আপডেট করুন। 
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => updateServiceWorker(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Update Now
          </button>
          
          <button 
            onClick={() => setNeedRefresh(false)}
            className="text-slate-400 text-xs hover:text-white transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PwaUpdater;