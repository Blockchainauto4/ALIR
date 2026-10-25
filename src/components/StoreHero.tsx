import React from 'react';
import { Phone, ShieldCheck, Truck, Zap, ShoppingBag, Eye, Store, Flame } from 'lucide-react';
import { usePriceSync } from '../context/PriceSyncContext';
import { formatBRL } from '../utils/priceCalculator';

export const StoreHero: React.FC = () => {
  const { products, updatedProductId, setIsManagerOpen, setIsSignageOpen } = usePriceSync();

  // Filter items specifically from the storefront banner photo
  const photoOffers = products.filter((p) => p.isFromStoreFrontPhoto);

  return (
    <section className="bg-gradient-to-b from-[#182b68] via-[#1e357d] to-slate-900 text-white pt-4 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Real-time Ticker of Photo Banner Prices */}
        <div className="mb-6 bg-amber-400 text-slate-950 rounded-xl px-3 py-2 shadow-lg overflow-hidden flex items-center border border-amber-300">
          <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider bg-red-600 text-white px-2.5 py-1 rounded-md shrink-0 shadow-sm mr-3">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>OFERTAS DO DIA</span>
          </div>

          <div className="overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-4 text-xs font-bold">
            {photoOffers.map((item) => {
              const isJustUpdated = updatedProductId === item.id;
              return (
                <div
                  key={item.id}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded transition-all duration-300 ${
                    isJustUpdated ? 'bg-red-600 text-white scale-110 shadow' : 'hover:bg-amber-300/80'
                  }`}
                >
                  <span className="font-extrabold">{item.name.split('(')[0]}:</span>
                  <span className="text-red-700 bg-white px-1.5 py-0.2 rounded font-black text-sm">
                    {formatBRL(item.price)}
                    <span className="text-[10px] font-normal text-gray-700 ml-0.5">/{item.unit}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Visual facade + Store highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left info column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Açougue & Supermercado Completo</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Preços Baixos no Açougue e Mercearia com{' '}
              <span className="text-amber-400 underline decoration-red-500 underline-offset-4">
                Atualização em Tempo Real
              </span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl">
              Consulte nossos preços direto da balança do açougue e das gôndolas. 
              Peça carnes fatiadas na hora, faça suas compras de mercearia e receba no seu endereço ou retire no balcão pelo WhatsApp!
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/5511972428422?text=Olá!%20Vi%20as%20ofertas%20no%20site%20do%20Supermercado%20Ali%20Raio%20do%20Sol%20e%20gostaria%20de%20fazer%20um%20pedido."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-xl text-sm transition shadow-lg hover:shadow-emerald-500/20"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Pedir no WhatsApp (11) 97242-8422</span>
              </a>

              <button
                type="button"
                onClick={() => setIsSignageOpen(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-xl text-sm border border-white/20 transition backdrop-blur-sm"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Ver Cartazes Grandes da Fachada</span>
              </button>

              <button
                type="button"
                onClick={() => setIsManagerOpen(true)}
                className="flex items-center gap-2 bg-red-600/80 hover:bg-red-600 text-white font-bold px-4 py-3 rounded-xl text-sm transition"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Gerenciar Preços da Loja</span>
              </button>
            </div>

            {/* Value propositions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Carnes frescas com corte no balcão</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Entrega rápida no seu bairro</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShoppingBag className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Pague com Pix, Dinheiro ou Cartão</span>
              </div>
            </div>
          </div>

          {/* Right column: Actual storefront photo showcasing the establishment */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-black group">
              <img
                src="/assets/aistudio/IMG_20261025_070850_7ba96680.jpg"
                alt="Fachada do Supermercado Ali Raio do Sol com cartazes de ofertas e balcão de açougue"
                className="w-full h-72 sm:h-80 md:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4">
                <div className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded w-fit mb-1.5 uppercase flex items-center gap-1 shadow">
                  <Store className="w-3.5 h-3.5" />
                  <span>Nossa Loja Física</span>
                </div>
                <h2 className="text-white font-extrabold text-base sm:text-lg leading-tight drop-shadow">
                  Fachada Oficial do Supermercado Ali Raio do Sol
                </h2>
                <p className="text-slate-300 text-xs mt-1">
                  Os mesmos preços das faixas amarelas de ofertas atualizados instantaneamente aqui no site!
                </p>
              </div>

              {/* Live badge */}
              <div className="absolute top-3 right-3 bg-[#0f2154]/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Preços Sincronizados</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
