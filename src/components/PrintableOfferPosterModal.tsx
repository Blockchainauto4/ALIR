import React from 'react';
import { X, Printer, Download, Sparkles, Zap } from 'lucide-react';
import { usePriceSync } from '../context/PriceSyncContext';
import { formatBRL } from '../utils/priceCalculator';

export const PrintableOfferPosterModal: React.FC = () => {
  const { selectedPosterProduct, setSelectedPosterProduct } = usePriceSync();

  if (!selectedPosterProduct) return null;

  const priceWhole = Math.floor(selectedPosterProduct.price);
  const priceCents = Math.round((selectedPosterProduct.price - priceWhole) * 100).toString().padStart(2, '0');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-gray-200 flex flex-col items-center print:shadow-none print:border-none print:max-w-none print:w-full print:p-0">
        
        {/* Controls - Hidden on print */}
        <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded">
              CARTAZ DE PREÇO
            </span>
            <span className="text-xs text-gray-500 font-semibold">
              Estilo Fachada Ali Raio do Sol
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Cartaz</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPosterProduct(null)}
              className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              aria-label="Fechar cartaz"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Authentic Brazilian Supermarket Yellow Offer Signboard */}
        <div 
          id="printable-poster"
          className="w-full bg-[#fde047] border-8 border-red-600 rounded-2xl p-6 sm:p-8 text-center shadow-2xl flex flex-col justify-between items-center relative overflow-hidden print:border-8 print:w-full print:h-screen print:rounded-none"
          style={{ minHeight: '480px' }}
        >
          {/* Top Hanging Flag Style */}
          <div className="w-full bg-red-600 text-white py-2 px-4 rounded-lg shadow-md mb-4 flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-widest uppercase font-['Anton',sans-serif]">
              ★ OFERTA ★
            </span>
          </div>

          {/* Supermarket Brand Small Header */}
          <div className="flex items-center gap-1 font-black text-slate-900 text-xs sm:text-sm uppercase tracking-wider mb-2">
            <span>ALI RA</span>
            <Zap className="w-4 h-4 fill-red-600 text-red-600 inline" />
            <span>O DO SOL SUPERMERCADO</span>
          </div>

          {/* Product Name in bold black market marker style */}
          <div className="my-auto py-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 uppercase font-['Oswald',sans-serif] leading-tight tracking-tight drop-shadow-xs">
              {selectedPosterProduct.name}
            </h1>
            {selectedPosterProduct.cutType && (
              <span className="text-sm font-bold text-red-700 uppercase tracking-widest mt-1 block">
                {selectedPosterProduct.cutType}
              </span>
            )}
          </div>

          {/* Big Hand-Lettered Price Box */}
          <div className="my-4 bg-white/90 w-full py-4 px-2 rounded-2xl border-4 border-red-500 shadow-inner flex flex-col items-center justify-center">
            {selectedPosterProduct.originalPrice && selectedPosterProduct.originalPrice > selectedPosterProduct.price && (
              <div className="text-sm sm:text-base text-gray-600 font-extrabold line-through mb-1">
                DE {formatBRL(selectedPosterProduct.originalPrice)}
              </div>
            )}

            <div className="flex items-baseline justify-center leading-none">
              <span className="text-3xl sm:text-4xl font-black text-red-600 mr-2 font-['Anton',sans-serif]">
                R$
              </span>
              <span className="text-7xl sm:text-8xl md:text-9xl font-black text-red-700 font-['Anton',sans-serif] tracking-tighter">
                {priceWhole}
              </span>
              <div className="flex flex-col items-start ml-1 text-left">
                <span className="text-4xl sm:text-5xl md:text-6xl font-black text-red-700 font-['Anton',sans-serif] leading-none">
                  ,{priceCents}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 uppercase font-['Oswald',sans-serif]">
                  /{selectedPosterProduct.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-800 border-t-2 border-red-400 pt-2">
            <span>WhatsApp: (11) 97242-8422</span>
            <span>Preço Válido Enquanto Durar o Estoque</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center print:hidden">
          Dica: Você pode imprimir este cartaz para colar no balcão do açougue ou tirar print para divulgar no status do WhatsApp!
        </p>

      </div>
    </div>
  );
};
