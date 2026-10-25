import React, { useState, useMemo } from 'react';
import { PriceSyncProvider, usePriceSync } from './context/PriceSyncContext';
import { Header } from './components/Header';
import { StoreHero } from './components/StoreHero';
import { OfferBannersStrip } from './components/OfferBannersStrip';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AdminPriceManager } from './components/AdminPriceManager';
import { PrintableOfferPosterModal } from './components/PrintableOfferPosterModal';
import { DigitalSignageView } from './components/DigitalSignageView';
import { NotificationToastList } from './components/NotificationToastList';
import { Footer } from './components/Footer';
import { 
  Sparkles, 
  Flame, 
  ArrowUpDown, 
  SlidersHorizontal, 
  CheckCircle2, 
  Search,
  Store
} from 'lucide-react';
import { ProductCategory } from './types/supermarket';

const MainContent: React.FC = () => {
  const { 
    products, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery,
    setIsManagerOpen 
  } = usePriceSync();

  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'discount'>('featured');
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (activeCategory !== 'todos') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.cutType && p.cutType.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Filter by Only Offers
    if (onlyOffers) {
      list = list.filter((p) => p.isOffer || p.isFromStoreFrontPhoto);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'discount') {
        const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      }
      // 'featured'
      if (a.isFromStoreFrontPhoto && !b.isFromStoreFrontPhoto) return -1;
      if (!a.isFromStoreFrontPhoto && b.isFromStoreFrontPhoto) return 1;
      if (a.isOffer && !b.isOffer) return -1;
      if (!a.isOffer && b.isOffer) return 1;
      return 0;
    });

    return list;
  }, [products, activeCategory, searchQuery, onlyOffers, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-gray-900 font-sans">
      <Header />
      <StoreHero />
      <OfferBannersStrip />

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 py-10 w-full flex-1">
        
        {/* Controls Bar: Title, Count, Filters, Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#182b68] tracking-tight">
                {activeCategory === 'todos'
                  ? 'Catálogo Completo do Supermercado'
                  : activeCategory === 'acougue'
                  ? 'Cortes Selecionados de Açougue'
                  : `Seção de ${activeCategory.toUpperCase()}`}
              </h2>
              <span className="bg-gray-200 text-gray-700 font-black text-xs px-2.5 py-0.5 rounded-full">
                {filteredProducts.length} itens
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
              Clique em "+ Pedir" para montar sua sacola com corte desejado e enviar para o balcão.
            </p>
          </div>

          {/* Quick Filters & Sorting */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Toggle Only Offers */}
            <button
              type="button"
              onClick={() => setOnlyOffers(!onlyOffers)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                onlyOffers
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Apenas Ofertas</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <label htmlFor="sort-select" className="sr-only">Ordenar produtos</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-gray-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="featured">Destaques da Fachada</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="discount">Maior Desconto (%)</option>
              </select>
            </div>

            {/* Admin shortcut */}
            <button
              type="button"
              onClick={() => setIsManagerOpen(true)}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#182b68] hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Editar Preços</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-800">Nenhum produto encontrado</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Não encontramos resultados para a sua busca atual. Tente buscar outro corte ou limpe os filtros.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('todos');
                setSearchQuery('');
                setOnlyOffers(false);
              }}
              className="mt-4 bg-[#182b68] text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Limpar Filtros e Ver Tudo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Trust Badges Bar */}
        <div className="mt-14 bg-gradient-to-r from-blue-900 to-[#182b68] text-white p-6 sm:p-8 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-3.5">
            <div className="bg-amber-400 text-slate-950 p-3 rounded-2xl font-black">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">Loja Física Tradicional</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Visite nosso balcão ou compre online com a mesma confiança e garantia de peso exato.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="bg-red-500 text-white p-3 rounded-2xl font-black">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">Preço na Balança Sincronizado</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Atualização em tempo real para você sempre pagar o preço justo e atualizado do dia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="bg-emerald-500 text-white p-3 rounded-2xl font-black">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">WhatsApp Ágil</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Envie sua lista pronta e tire dúvidas de cortes especiais pelo telefone (11) 97242-8422.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />

      {/* Global Modals & Overlays */}
      <CartDrawer />
      <AdminPriceManager />
      <PrintableOfferPosterModal />
      <DigitalSignageView />
      <NotificationToastList />
    </div>
  );
};

export default function App() {
  return (
    <PriceSyncProvider>
      <MainContent />
    </PriceSyncProvider>
  );
}
