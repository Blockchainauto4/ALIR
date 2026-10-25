import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Sparkles, 
  Scale, 
  Zap, 
  Tag, 
  Flame, 
  Edit3,
  Check
} from 'lucide-react';
import { Product } from '../types/supermarket';
import { usePriceSync } from '../context/PriceSyncContext';
import { formatBRL, calculateDiscountPercent } from '../utils/priceCalculator';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    updatedProductId, 
    updateProductPrice, 
    setSelectedPosterProduct 
  } = usePriceSync();

  const isJustUpdated = updatedProductId === product.id;
  const isKg = product.unit === 'kg';
  
  // Default quantity for KG items is 1kg; for units is 1
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [isQuickEditing, setIsQuickEditing] = useState<boolean>(false);
  const [tempPrice, setTempPrice] = useState<string>(product.price.toString());
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const discountPercent = product.originalPrice 
    ? calculateDiscountPercent(product.originalPrice, product.price) 
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedQty);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1500);
  };

  const handleSaveQuickPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempPrice.replace(',', '.'));
    if (!isNaN(val) && val > 0) {
      updateProductPrice(product.id, val);
      setIsQuickEditing(false);
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isJustUpdated
          ? 'border-emerald-500 ring-4 ring-emerald-300 shadow-xl scale-[1.02]'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
    >
      {/* Visual Header / Badges */}
      <div className="relative w-full h-44 sm:h-48 bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isFromStoreFrontPhoto && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wide flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>Cartaz da Fachada</span>
            </span>
          )}

          {product.isOffer && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wide flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Oferta do Dia</span>
            </span>
          )}

          {discountPercent > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Live sync pulse on card */}
        {isJustUpdated && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Preço Atualizado!</span>
          </div>
        )}

        {/* Quick Edit Price Button for manager */}
        <button
          type="button"
          onClick={() => {
            setTempPrice(product.price.toString());
            setIsQuickEditing(!isQuickEditing);
          }}
          className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-800 p-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-semibold flex items-center gap-1 transition opacity-90 hover:opacity-100"
          title="Editar preço rapidamente"
          aria-label={`Editar preço de ${product.name}`}
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px] hidden sm:inline">Preço</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category / Cut info */}
          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            {product.cutType && (
              <>
                <span>•</span>
                <span className="text-red-700 font-bold">{product.cutType}</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-gray-900 font-bold text-base leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Product Description */}
          {product.description && (
            <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing Area */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          {/* Quick inline price edit form */}
          {isQuickEditing ? (
            <form onSubmit={handleSaveQuickPrice} className="bg-amber-50 p-2.5 rounded-xl border border-amber-300 mb-2">
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Novo Preço (R$ /{product.unit}):
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="w-full bg-white px-2 py-1 rounded text-sm font-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded text-xs font-bold shadow-xs"
                  title="Salvar"
                  aria-label="Salvar novo preço"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsQuickEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs font-bold"
                  aria-label="Cancelar edição de preço"
                >
                  ✕
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-baseline justify-between gap-1 mb-2">
              <div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through block font-medium">
                    {formatBRL(product.originalPrice)}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#182b68] tracking-tight">
                    {formatBRL(product.price)}
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    /{product.unit}
                  </span>
                </div>
              </div>

              {/* Status indicator */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Disponível
                </span>
              </div>
            </div>
          )}

          {/* Quantity Controls (Supports fractions like 0.5kg or full units) */}
          <div className="flex items-center justify-between gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 mb-3">
            <span className="text-xs font-bold text-gray-600 pl-1 flex items-center gap-1">
              {isKg ? <Scale className="w-3.5 h-3.5 text-gray-500" /> : null}
              <span>Qtd:</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (isKg) {
                    setSelectedQty((q) => Math.max(0.5, Math.round((q - 0.5) * 10) / 10));
                  } else {
                    setSelectedQty((q) => Math.max(1, q - 1));
                  }
                }}
                className="w-7 h-7 bg-white hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center font-bold text-sm border border-gray-200 shadow-xs active:scale-95 transition"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-3 h-3" />
              </button>

              <span className="text-xs font-black text-gray-900 w-12 text-center">
                {selectedQty} {product.unit}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (isKg) {
                    setSelectedQty((q) => Math.round((q + 0.5) * 10) / 10);
                  } else {
                    setSelectedQty((q) => q + 1);
                  }
                }}
                className="w-7 h-7 bg-white hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center font-bold text-sm border border-gray-200 shadow-xs active:scale-95 transition"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Cartaz */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                addedToast
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                  : 'bg-[#182b68] hover:bg-[#122255] text-white active:scale-98'
              }`}
              aria-label={`Adicionar ${selectedQty} ${product.unit} de ${product.name} ao carrinho`}
            >
              {addedToast ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Adicionado!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Colocar na Sacola</span>
                </>
              )}
            </button>

            {product.isOffer && (
              <button
                type="button"
                onClick={() => setSelectedPosterProduct(product)}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 p-2.5 rounded-xl border border-amber-300 shadow-xs transition"
                title="Ver e Imprimir Cartaz Amarelo"
                aria-label={`Ver cartaz de ${product.name}`}
              >
                <Tag className="w-4 h-4 text-amber-800" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
