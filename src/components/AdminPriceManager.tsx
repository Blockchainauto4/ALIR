import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Check, 
  RefreshCw, 
  Plus, 
  Percent, 
  Flame, 
  TrendingDown, 
  TrendingUp, 
  Search, 
  Printer, 
  Trash2,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { usePriceSync } from '../context/PriceSyncContext';
import { Product, ProductCategory, ProductUnit } from '../types/supermarket';
import { formatBRL } from '../utils/priceCalculator';

export const AdminPriceManager: React.FC = () => {
  const {
    products,
    updateProductPrice,
    toggleOffer,
    toggleFlashSale,
    addProduct,
    deleteProduct,
    resetToPhotoDefaults,
    simulateLivePriceDrop,
    applyBulkCategoryAdjustment,
    recentLogs,
    isSyncConnected,
    isManagerOpen,
    setIsManagerOpen,
    setSelectedPosterProduct,
  } = usePriceSync();

  const [search, setSearch] = useState<string>('');
  const [filterCat, setFilterCat] = useState<ProductCategory>('todos');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New product form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('acougue');
  const [newCutType, setNewCutType] = useState<Product['cutType']>('bovino');
  const [newPrice, setNewPrice] = useState('');
  const [newUnit, setNewUnit] = useState<ProductUnit>('kg');
  const [newIsOffer, setNewIsOffer] = useState(true);

  if (!isManagerOpen) return null;

  const filtered = products.filter((p) => {
    const matchesCat = filterCat === 'todos' || p.category === filterCat;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice.replace(',', '.'));
    if (!newName.trim() || isNaN(priceNum) || priceNum <= 0) return;

    addProduct({
      name: newName.trim(),
      category: newCategory,
      cutType: newCategory === 'acougue' ? newCutType : undefined,
      price: priceNum,
      originalPrice: priceNum * 1.15,
      unit: newUnit,
      isOffer: newIsOffer,
      stockStatus: 'in_stock',
      description: `Produto fresco de qualidade - ${newCategory}.`,
      imageUrl: newCategory === 'acougue' 
        ? 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    });

    setNewName('');
    setNewPrice('');
    setShowAddModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Modal Header */}
        <div className="bg-[#182b68] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2.5 rounded-2xl shadow-sm text-white">
              <Zap className="w-6 h-6 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Painel de Atualização de Preços em Tempo Real
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Canal Ao Vivo Ativo
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Altere os preços aqui e veja a atualização instantânea em todas as telas, no carrinho e no modo TV!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetToPhotoDefaults}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 transition"
              title="Restaurar preços originais da foto da fachada"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Restaurar Foto Original</span>
            </button>

            <button
              type="button"
              onClick={() => setIsManagerOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Fechar painel do gerente"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Bulk Adjustments & Actions Bar */}
        <div className="bg-slate-100 p-3 sm:p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-[#182b68]" />
              Ajustes em Massa:
            </span>

            <button
              type="button"
              onClick={() => applyBulkCategoryAdjustment('acougue', -5)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              -5% no Açougue
            </button>

            <button
              type="button"
              onClick={() => applyBulkCategoryAdjustment('acougue', -10)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              -10% no Açougue
            </button>

            <button
              type="button"
              onClick={() => applyBulkCategoryAdjustment('todos', +5)}
              className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              +5% Geral
            </button>

            <button
              type="button"
              onClick={simulateLivePriceDrop}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Simular Oscilação ao Vivo
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Cadastrar Novo Corte / Produto
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por nome do corte ou produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#182b68]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {(['todos', 'acougue', 'mercearia', 'hortifruti', 'bebidas'] as ProductCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition ${
                  filterCat === cat
                    ? 'bg-[#182b68] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-gray-50 text-gray-700 uppercase font-black tracking-wider text-[11px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3">Produto</th>
                  <th className="py-3 px-3">Categoria</th>
                  <th className="py-3 px-3">Preço Atual (R$)</th>
                  <th className="py-3 px-3">Ajuste Rápido</th>
                  <th className="py-3 px-3 text-center">Cartaz Amarelo</th>
                  <th className="py-3 px-3 text-center">Relâmpago</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-amber-50/50 transition">
                      {/* Product Name & Photo */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-gray-900 text-xs">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                              <span>Unidade: /{item.unit}</span>
                              {item.isFromStoreFrontPhoto && (
                                <span className="text-red-600 font-bold">• Foto da Loja</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-3">
                        <span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                          {item.category}
                        </span>
                      </td>

                      {/* Current Editable Price */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-500">R$</span>
                          <input
                            type="number"
                            step="0.01"
                            defaultValue={item.price}
                            key={item.price}
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val > 0 && val !== item.price) {
                                updateProductPrice(item.id, val);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className="w-20 font-black text-sm text-[#182b68] bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-right"
                          />
                          <span className="text-[11px] text-gray-500">/{item.unit}</span>
                        </div>
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateProductPrice(item.id, Math.max(0.1, item.price - 1))}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded text-[11px] font-bold"
                            title="Diminuir R$ 1,00"
                          >
                            -1,00
                          </button>
                          <button
                            type="button"
                            onClick={() => updateProductPrice(item.id, Math.round(item.price * 0.95 * 100) / 100)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded text-[11px] font-bold"
                            title="Desconto de 5%"
                          >
                            -5%
                          </button>
                          <button
                            type="button"
                            onClick={() => updateProductPrice(item.id, item.price + 1)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.5 rounded text-[11px] font-bold"
                            title="Aumentar R$ 1,00"
                          >
                            +1,00
                          </button>
                        </div>
                      </td>

                      {/* Yellow Poster Toggle */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleOffer(item.id)}
                          className={`px-2 py-1 rounded-md text-[11px] font-black uppercase transition ${
                            item.isOffer
                              ? 'bg-amber-400 text-slate-950 shadow-xs'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {item.isOffer ? '★ ATIVO' : 'Desativado'}
                        </button>
                      </td>

                      {/* Flash Sale Toggle */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFlashSale(item.id)}
                          className={`px-2 py-1 rounded-md text-[11px] font-black transition ${
                            item.isFlashSale
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {item.isFlashSale ? '🔥 RELÂMPAGO' : 'Normal'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedPosterProduct(item)}
                            className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition"
                            title="Gerar e Imprimir Cartaz Amarelo"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(item.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition"
                            title="Remover produto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Audit Log of Recent Price Changes */}
          {recentLogs.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-extrabold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>Histórico Recente de Alterações em Tempo Real:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {recentLogs.map((log) => {
                  const isDrop = log.newPrice < log.oldPrice;
                  return (
                    <div
                      key={log.id}
                      className="bg-gray-50 border border-gray-200 p-2 rounded-xl text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{log.productName}</div>
                        <div className="text-[10px] text-gray-500">Horário: {log.timestamp}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 line-through text-[10px] block">
                          {formatBRL(log.oldPrice)}
                        </span>
                        <span
                          className={`font-black text-xs ${
                            isDrop ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {formatBRL(log.newPrice)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Total de {products.length} itens cadastrados no supermercado
          </span>
          <button
            type="button"
            onClick={() => setIsManagerOpen(false)}
            className="bg-[#182b68] hover:bg-[#122255] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            Concluir & Fechar Painel
          </button>
        </div>

      </div>

      {/* Nested Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <form
            onSubmit={handleCreateProduct}
            className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-black text-base text-gray-900">
                Cadastrar Novo Item no Açougue ou Mercado
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Nome do Produto ou Corte de Carne:
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Alcatra com Maminha, Frango Caipira..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-xs font-medium p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#182b68]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Categoria:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs font-medium p-2 border border-gray-300 rounded-lg"
                >
                  <option value="acougue">Açougue</option>
                  <option value="mercearia">Mercearia</option>
                  <option value="hortifruti">Hortifrúti</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="padaria">Padaria</option>
                  <option value="limpeza">Limpeza</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Unidade:</label>
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value as any)}
                  className="w-full text-xs font-medium p-2 border border-gray-300 rounded-lg"
                >
                  <option value="kg">kg (Quilo)</option>
                  <option value="un">un (Unidade)</option>
                  <option value="bandeja">bandeja</option>
                  <option value="pacote">pacote</option>
                  <option value="saco">saco</option>
                </select>
              </div>
            </div>

            {newCategory === 'acougue' && (
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Tipo de Carne:</label>
                <select
                  value={newCutType}
                  onChange={(e) => setNewCutType(e.target.value as any)}
                  className="w-full text-xs font-medium p-2 border border-gray-300 rounded-lg"
                >
                  <option value="bovino">Bovino</option>
                  <option value="suino">Suíno</option>
                  <option value="aves">Aves</option>
                  <option value="embutidos">Embutidos / Linguiças</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Preço Inicial (R$):</label>
              <input
                type="text"
                required
                placeholder="Ex: 29.90"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full text-xs font-bold p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isOfferCheckbox"
                checked={newIsOffer}
                onChange={(e) => setNewIsOffer(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
              />
              <label htmlFor="isOfferCheckbox" className="text-xs font-bold text-gray-700">
                Destacar como Oferta no Cartaz Amarelo
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Salvar Produto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
