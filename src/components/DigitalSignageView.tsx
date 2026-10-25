import React, { useState, useEffect } from 'react';
import { X, Zap, Clock, Phone, Sparkles, Flame, Volume2, VolumeX } from 'lucide-react';
import { usePriceSync } from '../context/PriceSyncContext';
import { formatBRL } from '../utils/priceCalculator';

export const DigitalSignageView: React.FC = () => {
  const { products, isSignageOpen, setIsSignageOpen, updatedProductId } = usePriceSync();
  const [currentTime, setCurrentTime] = useState<string>('');

  // Clock ticker
  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR'));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isSignageOpen) return null;

  // Filter offers for the TV screen
  const offers = products.filter((p) => p.isOffer || p.isFromStoreFrontPhoto);

  return (
    <div className="fixed inset-0 z-50 bg-[#0c1636] text-white flex flex-col overflow-y-auto animate-fade-in p-4 sm:p-6 select-none">
      
      {/* TV Header Bar */}
      <div className="flex items-center justify-between border-b-2 border-red-600 pb-4 mb-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border-4 border-red-600 shadow-xl flex flex-col items-center justify-center">
            <div className="flex items-center font-black text-[#182b68] text-2xl sm:text-3xl tracking-tight leading-none">
              <span>ALI RA</span>
              <Zap className="w-7 h-7 fill-red-600 text-red-600 animate-bounce mx-0.5" />
              <span>O DO SOL</span>
            </div>
            <span className="text-[11px] tracking-[0.4em] font-black text-slate-900 uppercase">
              SUPERMERCADO & AÇOUGUE
            </span>
          </div>

          <div className="hidden md:block">
            <div className="text-amber-400 font-black text-lg tracking-wide uppercase flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500 fill-red-500" />
              <span>TABELA DIGITAL DE PREÇOS AO VIVO</span>
            </div>
            <div className="text-xs text-slate-300">
              Preços atualizados em tempo real diretamente do açougue
            </div>
          </div>
        </div>

        {/* Live Info & Close */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-[#182b68] px-3.5 py-2 rounded-xl border border-white/20">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm font-bold text-amber-300">{currentTime}</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-700/80 px-3.5 py-2 rounded-xl border border-emerald-400/40">
            <Phone className="w-4 h-4 text-emerald-300" />
            <span className="font-bold text-xs sm:text-sm text-emerald-100">(11) 97242-8422</span>
          </div>

          <button
            type="button"
            onClick={() => setIsSignageOpen(false)}
            className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition shadow-lg"
            aria-label="Sair do Modo TV"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Grid of Big Yellow Price Cards (Digital Poster Board) */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 my-auto">
        {offers.map((item) => {
          const isJustUpdated = updatedProductId === item.id;
          const priceWhole = Math.floor(item.price);
          const priceCents = Math.round((item.price - priceWhole) * 100).toString().padStart(2, '0');

          return (
            <div
              key={item.id}
              className={`relative bg-[#fef08a] text-slate-950 rounded-2xl border-4 p-3 flex flex-col justify-between shadow-2xl transition-all duration-500 ${
                isJustUpdated
                  ? 'border-emerald-400 scale-105 ring-8 ring-emerald-400/50 bg-amber-200'
                  : 'border-red-600'
              }`}
            >
              {/* Header Ribbon */}
              <div className="bg-red-600 text-white font-black text-center text-xs sm:text-sm tracking-widest uppercase py-1 rounded-md shadow-xs">
                ★ OFERTA DO DIA ★
              </div>

              {/* Product Name */}
              <div className="my-auto py-2 text-center min-h-[50px] flex items-center justify-center">
                <h3 className="font-black text-sm sm:text-base md:text-lg leading-tight uppercase font-['Oswald',sans-serif]">
                  {item.name}
                </h3>
              </div>

              {/* Huge Price Digits */}
              <div className="bg-white/90 rounded-xl py-2 px-1 text-center border-2 border-red-500 shadow-inner">
                <div className="flex items-baseline justify-center leading-none">
                  <span className="text-xs sm:text-sm font-black text-red-600 mr-0.5">R$</span>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-700 font-['Anton',sans-serif] tracking-tighter">
                    {priceWhole}
                  </span>
                  <span className="text-lg sm:text-xl lg:text-2xl font-black text-red-700 font-['Anton',sans-serif]">
                    ,{priceCents}
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs font-black text-slate-900 uppercase mt-0.5">
                  POR {item.unit.toUpperCase()}
                </div>
              </div>

              {/* Flash badge */}
              {isJustUpdated && (
                <div className="absolute -top-3 -right-2 bg-emerald-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-lg animate-bounce flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>PREÇO ATUALIZADO!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ticker at the bottom */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Sincronização em Tempo Real ativada • Preços válidos para compras hoje na loja e delivery</span>
        </div>
        <div>
          Faça seu pedido pelo WhatsApp: <strong className="text-emerald-400 font-bold">(11) 97242-8422</strong>
        </div>
      </div>

    </div>
  );
};
