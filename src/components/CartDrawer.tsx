import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  ShoppingBag, 
  Truck, 
  Store, 
  CreditCard, 
  Banknote, 
  QrCode,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { usePriceSync } from '../context/PriceSyncContext';
import { 
  formatBRL, 
  calculateCartTotals, 
  calculateItemSubtotal, 
  formatWhatsAppMessage 
} from '../utils/priceCalculator';
import { OrderDetails } from '../types/supermarket';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart 
  } = usePriceSync();

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');
  const [changeFor, setChangeFor] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  if (!isCartOpen) return null;

  const totals = calculateCartTotals(cart, deliveryType, 80, 7.00);

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setFormError('Seu carrinho está vazio.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Por favor, informe seu nome.');
      return;
    }
    if (!customerPhone.trim()) {
      setFormError('Por favor, informe seu telefone ou WhatsApp para contato.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setFormError('Por favor, informe o endereço completo para entrega.');
      return;
    }

    setFormError('');

    const order: OrderDetails = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryType,
      address: deliveryType === 'delivery' ? address.trim() : undefined,
      neighborhood: deliveryType === 'delivery' ? neighborhood.trim() : undefined,
      paymentMethod,
      changeFor: paymentMethod === 'dinheiro' && changeFor ? changeFor.trim() : undefined,
      notes: notes.trim() || undefined,
      items: cart,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
    };

    const message = formatWhatsAppMessage(order);
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511972428422?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="bg-[#182b68] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-400 p-2 rounded-xl text-slate-950 font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Sua Sacola de Compras</h2>
              <p className="text-xs text-slate-300">Supermercado Ali Raio do Sol</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-rose-300 hover:text-rose-100 underline font-medium mr-2"
              >
                Limpar
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 font-medium flex items-center justify-between">
          {totals.isFreeDelivery ? (
            <span className="font-bold flex items-center gap-1.5 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Parabéns! Você ganhou Entrega Grátis!
            </span>
          ) : (
            <span>
              Faltam apenas <strong className="font-black text-amber-950">{formatBRL(totals.remainingForFreeDelivery)}</strong> para Frete Grátis (acima de R$ 80)
            </span>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-800">Seu carrinho está vazio</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Explore nossas carnes frescas e ofertas nos cartazes amarelos para começar suas compras!
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-4 bg-[#182b68] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Ver Ofertas da Loja
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const subtotal = calculateItemSubtotal(item.product.price, item.quantity);
              const isKg = item.product.unit === 'kg';
              const step = isKg ? 0.5 : 1;

              return (
                <div
                  key={item.product.id}
                  className="bg-gray-50 rounded-2xl p-3 border border-gray-200 flex items-center gap-3 relative"
                >
                  <img
                    src={item.product.imageUrl}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-gray-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {formatBRL(item.product.price)} /{item.product.unit}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border border-gray-300">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, Math.max(0, item.quantity - step))}
                          className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-black font-bold text-xs"
                          aria-label="Diminuir"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1 text-gray-800">
                          {item.quantity} {item.product.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + step)}
                          className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-black font-bold text-xs"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="font-black text-sm text-[#182b68]">
                        {formatBRL(subtotal)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 transition self-start"
                    title="Remover"
                    aria-label={`Remover ${item.product.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Order Details & Checkout Form */}
        {cart.length > 0 && (
          <form onSubmit={handleSendWhatsAppOrder} className="border-t border-gray-200 bg-slate-50 p-4 space-y-3">
            
            {/* Delivery or Pickup Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-gray-200 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  deliveryType === 'delivery'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Entrega no Bairro</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  deliveryType === 'pickup'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-blue-600" />
                <span>Retirar no Balcão</span>
              </button>
            </div>

            {/* Customer Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Seu Nome:</label>
                <input
                  type="text"
                  required
                  placeholder="Nome e Sobrenome"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs font-medium p-1.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#182b68]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-600 block mb-0.5">WhatsApp para contato:</label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs font-medium p-1.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#182b68]"
                />
              </div>
            </div>

            {/* Address fields if delivery */}
            {deliveryType === 'delivery' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Endereço e Número:</label>
                  <input
                    type="text"
                    required
                    placeholder="Rua, número, apto..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs font-medium p-1.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#182b68]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Bairro:</label>
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full text-xs font-medium p-1.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#182b68]"
                  />
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="text-[10px] font-bold text-gray-600 block mb-1">Forma de Pagamento:</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pix</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cartao')}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition ${
                    paymentMethod === 'cartao'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cartão</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('dinheiro')}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition ${
                    paymentMethod === 'dinheiro'
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dinheiro</span>
                </button>
              </div>

              {paymentMethod === 'dinheiro' && (
                <div className="mt-1.5">
                  <input
                    type="text"
                    placeholder="Precisa de troco para quanto? (Ex: R$ 50,00)"
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                    className="w-full text-xs font-medium p-1.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Notes for butcher / groceries */}
            <div>
              <label className="text-[10px] font-bold text-gray-600 block mb-0.5">
                Instruções para o Açougueiro / Observações:
              </label>
              <input
                type="text"
                placeholder="Ex: Bifes finos, moer carne 2x, frango em pedaços..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs font-medium p-1.5 bg-white border border-gray-300 rounded-lg"
              />
            </div>

            {formError && (
              <div className="text-xs text-rose-600 font-bold flex items-center gap-1 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Summary Lines */}
            <div className="pt-2 border-t border-gray-200 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal dos Itens:</span>
                <span className="font-bold">{formatBRL(totals.subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Taxa de Entrega:</span>
                <span className="font-bold">
                  {totals.deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-black">GRÁTIS</span>
                  ) : (
                    formatBRL(totals.deliveryFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-gray-900 pt-1 border-t border-gray-200">
                <span>Total a Pagar:</span>
                <span className="text-[#182b68] text-lg">{formatBRL(totals.total)}</span>
              </div>
            </div>

            {/* Send to WhatsApp button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-black text-sm bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>Enviar Pedido pelo WhatsApp</span>
            </button>

            <p className="text-[10px] text-gray-500 text-center">
              Ao clicar, seu pedido será enviado pronto para o WhatsApp do Ali Raio do Sol <strong>(11) 97242-8422</strong> para confirmação imediata.
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
