import React from 'react';
import { 
  Zap, 
  ShoppingCart, 
  SlidersHorizontal, 
  Tv, 
  Phone, 
  Search, 
  Clock, 
  MapPin, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { usePriceSync } from '../context/PriceSyncContext';
import { ProductCategory } from '../types/supermarket';

export const Header: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    setIsManagerOpen,
    setIsSignageOpen,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    isSyncConnected,
    simulateLivePriceDrop,
  } = usePriceSync();

  const categories: { id: ProductCategory; label: string; icon: string }[] = [
    { id: 'todos', label: 'Todos os Produtos', icon: '🏪' },
    { id: 'acougue', label: 'Açougue & Carnes', icon: '🥩' },
    { id: 'mercearia', label: 'Mercearia & Matinais', icon: '🌾' },
    { id: 'hortifruti', label: 'Hortifrúti Fresco', icon: '🥬' },
    { id: 'bebidas', label: 'Bebidas & Cervejas', icon: '🍺' },
    { id: 'padaria', label: 'Padaria', icon: '🥖' },
    { id: 'limpeza', label: 'Limpeza & Bazar', icon: '🧼' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-100">
      {/* Top Banner with Store Hours and WhatsApp */}
      <div className="bg-[#0f1f4b] text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Zap className="w-3.5 h-3.5 fill-amber-300" />
              Preços atualizados em tempo real diretamente do balcão!
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3" />
              Seg a Sáb: 07h às 20h30 | Dom e Feriados: 07h às 14h
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3" />
              Atendimento no balcão e delivery no bairro
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{isSyncConnected ? 'Ao Vivo (Sincronizado)' : 'Offline Local'}</span>
            </div>

            <a
              href="https://wa.me/5511972428422?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido%20no%20Supermercado%20Ali%20Raio%20do%20Sol."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors font-bold"
              aria-label="Contato WhatsApp 11 97242-8422"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>(11) 97242-8422</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Brand Bar */}
      <div className="bg-[#182b68] text-white py-3.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Authentic Store Logo from storefront photo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveCategory('todos')}>
            <div className="bg-white px-3 py-1.5 rounded-lg border-2 border-red-600 shadow-md flex flex-col items-center justify-center">
              <div className="flex items-center font-extrabold text-[#182b68] text-2xl tracking-tight leading-none">
                <span>ALI RA</span>
                <span className="text-red-600 flex items-center justify-center mx-0.5">
                  <Zap className="w-6 h-6 fill-red-600 text-red-600 animate-pulse" />
                </span>
                <span>O DO SOL</span>
              </div>
              <span className="text-[10px] tracking-[0.3em] font-black text-slate-800 uppercase mt-0.5">
                SUPERMERCADO
              </span>
            </div>

            <div className="hidden sm:block">
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                Tradição & Qualidade no Açougue
              </span>
              <span className="text-xs text-slate-200">
                Ofertas diárias e carnes frescas fatiadas na hora
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="w-full md:max-w-md relative">
            <label htmlFor="search-products" className="sr-only">Buscar carnes, ofertas e produtos</label>
            <div className="relative">
              <input
                id="search-products"
                type="text"
                placeholder="Buscar carne moída, ovos, picanha, café..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-900 placeholder:text-gray-400 pl-10 pr-9 py-2 rounded-xl text-sm font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center"
                  aria-label="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {/* Live simulation test button */}
            <button
              type="button"
              onClick={simulateLivePriceDrop}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
              title="Testar atualização de preço ao vivo (simulação)"
              aria-label="Simular queda de preço ao vivo"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Testar Queda ao Vivo</span>
              <span className="xl:hidden">Ao Vivo</span>
            </button>

            {/* TV / Cartaz digital Mode */}
            <button
              type="button"
              onClick={() => setIsSignageOpen(true)}
              className="flex items-center gap-1.5 bg-[#253d88] hover:bg-[#2d49a3] text-white px-3 py-2 rounded-xl text-xs font-semibold transition border border-white/10 shadow-sm"
              aria-label="Abrir modo TV cartazes de ofertas"
            >
              <Tv className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Modo TV Ofertas</span>
            </button>

            {/* Admin / Manager Panel */}
            <button
              type="button"
              onClick={() => setIsManagerOpen(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm"
              aria-label="Abrir painel do gerente para atualizar preços"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Painel Gerente</span>
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-sm font-bold transition shadow-md"
              aria-label={`Abrir carrinho com ${cartCount} itens`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-1.5 py-0.2 rounded-full min-w-5 text-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-1.5 min-w-max">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#182b68] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#182b68]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.id === 'acougue' && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded uppercase ml-0.5">
                    Fresco
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
