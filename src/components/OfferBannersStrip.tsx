import React from 'react';
import { Flame, Printer, Plus, ShoppingCart, Sparkles } from 'lucide-react';
import { usePriceSync } from '../context/PriceSyncContext';
import { Product } from '../types/supermarket';
import { formatBRL } from '../utils/priceCalculator';

export const OfferBannersStrip: React.FC = () => {
  const { products, addToCart, setSelectedPosterProduct, updatedProductId } = usePriceSync();

  // Focus on the items with isOffer or from photo
  const featuredOffers = products.filter((p) => p.isOffer || p.isFromStoreFrontPhoto);

  return (
    <section className="py-8 px-4 bg-slate-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-red-600 font-extrabold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-red-600" />
              <span>Direto da Fachada da Loja</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-0.5">
              Cartazes Amarelos de Ofertas do Dia
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              As mesmas ofertas penduradas no nosso mercado com atualização de valor em tempo real.
            </p>
          </div>

          <div className="text-xs text-gray-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Preços conferidos na balança hoje</span>
          </div>
        </div>

        {/* Horizontal Scrollable or Grid of Brazilian Yellow Supermarket Posters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {featuredOffers.slice(0, 12).map((item) => {
            const isJustUpdated = updatedProductId === item.id;
            const priceWhole = Math.floor(item.price);
            const priceCents = Math.round((item.price - priceWhole) * 100).toString().padStart(2, '0');

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between bg-[#fffb8f] border-2 rounded-xl p-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isJustUpdated 
                    ? 'border-red-600 ring-4 ring-red-400 bg-amber-200 scale-105' 
                    : 'border-red-500 hover:border-red-600'
                }`}
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                {/* Yellow paper pin holes / header ribbon */}
                <div className="w-full bg-red-600 text-white font-black text-center text-xs tracking-wider uppercase py-0.5 px-2 rounded-sm mb-2 shadow-xs flex items-center justify-center gap-1">
                  <span>★ OFERTA ★</span>
                </div>

                {/* Live update ping */}
                {isJustUpdated && (
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-bounce flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>ATUALIZOU!</span>
                  </div>
                )}

                {/* Product Name in authentic heavy supermarket poster style */}
                <div className="text-center my-auto min-h-[46px] flex items-center justify-center">
                  <h3 className="font-black text-gray-950 text-sm leading-tight uppercase font-['Oswald',sans-serif] tracking-tight">
                    {item.name}
                  </h3>
                </div>

                {/* Huge Price in red/black market lettering */}
                <div className="text-center my-2 bg-white/70 py-1.5 px-1 rounded-lg border border-red-300">
                  <span className="text-[11px] font-extrabold text-red-600 mr-1">R$</span>
                  <span className="text-3xl font-black text-red-700 tracking-tighter font-['Anton',sans-serif]">
                    {priceWhole}
                  </span>
                  <span className="text-base font-black text-red-700 font-['Anton',sans-serif]">
                    ,{priceCents}
                  </span>
                  <span className="text-[11px] font-bold text-gray-800 ml-0.5">
                    /{item.unit}
                  </span>
                  
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="text-[10px] text-gray-600 line-through mt-0.5">
                      De {formatBRL(item.originalPrice)}
                    </div>
                  )}
                </div>

                {/* Quick Actions: Add to Cart and Print Poster */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => addToCart(item, 1)}
                    className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1 shadow-xs transition"
                    title={`Adicionar 1 ${item.unit} ao carrinho`}
                    aria-label={`Comprar ${item.name}`}
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Pedir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPosterProduct(item)}
                    className="bg-white hover:bg-gray-100 text-gray-700 p-1.5 rounded-lg border border-gray-300 shadow-xs transition"
                    title="Imprimir cartaz amarelo deste produto"
                    aria-label={`Imprimir cartaz de ${item.name}`}
                  >
                    <Printer className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
