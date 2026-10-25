import React from 'react';
import { Sparkles, TrendingDown, TrendingUp, Tag, Info } from 'lucide-react';
import { usePriceSync } from '../context/PriceSyncContext';

export const NotificationToastList: React.FC = () => {
  const { notifications } = usePriceSync();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((item) => {
        const isDrop = item.type === 'drop';
        const isOffer = item.type === 'offer';

        return (
          <div
            key={item.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-3 transition-all transform translate-y-0 opacity-100 ${
              isDrop
                ? 'bg-emerald-900/95 text-emerald-100 border-emerald-500 shadow-emerald-950/40'
                : isOffer
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-950/30'
                : 'bg-slate-900/95 text-white border-slate-700 shadow-black/50'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl shrink-0 ${
                isDrop
                  ? 'bg-emerald-600 text-white'
                  : isOffer
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {isDrop ? (
                <TrendingDown className="w-4 h-4" />
              ) : isOffer ? (
                <Tag className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 leading-snug">
              <span>{item.text}</span>
              <div className="text-[10px] opacity-75 font-normal mt-0.5">
                Transmissão em tempo real
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
