import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

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

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] bg-slate-800 border border-emerald-500/50 shadow-2xl p-4 rounded-2xl flex items-center gap-4 animate-bounce">
      <p className="text-white text-sm font-medium">Updated Version Available!</p>
      <button
        onClick={() => updateServiceWorker(true)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl transition-colors font-bold"
      >
        Update Now
      </button>
    </div>
  );
};

export default PwaUpdater;