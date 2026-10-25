import { CartItem, OrderDetails } from '../types/supermarket';

/**
 * Format a numeric value into Brazilian Real currency string (e.g., "R$ 19,98")
 */
export function formatBRL(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate the discount percentage between original price and promotional price
 */
export function calculateDiscountPercent(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= 0 || currentPrice >= originalPrice) {
    return 0;
  }
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Calculate subtotal for an item given unit price and quantity (supports kg decimals like 1.5kg)
 */
export function calculateItemSubtotal(price: number, quantity: number): number {
  if (price <= 0 || quantity <= 0) return 0;
  // Round to 2 decimal places to avoid IEEE 754 precision issues
  return Math.round(price * quantity * 100) / 100;
}

/**
 * Calculate total for a cart including delivery rules
 */
export function calculateCartTotals(
  items: CartItem[],
  deliveryType: 'delivery' | 'pickup' = 'delivery',
  freeDeliveryThreshold: number = 80,
  baseDeliveryFee: number = 7.00
): {
  subtotal: number;
  deliveryFee: number;
  total: number;
  isFreeDelivery: boolean;
  remainingForFreeDelivery: number;
} {
  const subtotal = items.reduce((sum, item) => {
    return sum + calculateItemSubtotal(item.product.price, item.quantity);
  }, 0);

  const roundedSubtotal = Math.round(subtotal * 100) / 100;

  if (deliveryType === 'pickup') {
    return {
      subtotal: roundedSubtotal,
      deliveryFee: 0,
      total: roundedSubtotal,
      isFreeDelivery: true,
      remainingForFreeDelivery: 0,
    };
  }

  const isFreeDelivery = roundedSubtotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : baseDeliveryFee;
  const total = Math.round((roundedSubtotal + deliveryFee) * 100) / 100;
  const remainingForFreeDelivery = Math.max(0, Math.round((freeDeliveryThreshold - roundedSubtotal) * 100) / 100);

  return {
    subtotal: roundedSubtotal,
    deliveryFee,
    total,
    isFreeDelivery,
    remainingForFreeDelivery,
  };
}

/**
 * Apply bulk adjustment percentage to a price, rounded to 2 decimal places
 */
export function applyBulkAdjustment(price: number, percentChange: number): number {
  const adjusted = price * (1 + percentChange / 100);
  return Math.max(0.1, Math.round(adjusted * 100) / 100);
}

/**
 * Format a complete order into a professional WhatsApp text message ready to be sent
 */
export function formatWhatsAppMessage(order: OrderDetails): string {
  const storeName = "SUPERMERCADO ALI RAIO DO SOL";
  const dateStr = new Date().toLocaleDateString('pt-BR');
  const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const itemsList = order.items
    .map((item, index) => {
      const unitLabel = item.product.unit === 'kg' ? 'kg' : item.product.unit;
      const subtotal = calculateItemSubtotal(item.product.price, item.quantity);
      return `${index + 1}. *${item.product.name}*\n   Qtd: ${item.quantity} ${unitLabel} x ${formatBRL(item.product.price)} = *${formatBRL(subtotal)}*`;
    })
    .join('\n');

  const deliveryText = order.deliveryType === 'delivery'
    ? `🛵 *ENTREGA EM DOMICÍLIO*\n📍 Endereço: ${order.address || 'Não informado'}\n🏘️ Bairro: ${order.neighborhood || 'Local'}\nTaxa de Entrega: ${order.deliveryFee === 0 ? 'GRÁTIS' : formatBRL(order.deliveryFee)}`
    : `🏪 *RETIRADA NO BALCÃO DO MERCADO*\n(Sem taxa de entrega)`;

  const paymentText = {
    pix: '💠 Pix (solicitar chave Pix)',
    cartao: '💳 Cartão (Débito/Crédito na maquininha)',
    dinheiro: order.changeFor ? `💵 Dinheiro (Troco para ${formatBRL(Number(order.changeFor))})` : '💵 Dinheiro (Sem troco)',
  }[order.paymentMethod];

  const notesText = order.notes ? `\n📝 *Observações do Açougue / Pedido:* ${order.notes}` : '';

  return `🛒 *NOVO PEDIDO - ${storeName}*
📅 ${dateStr} às ${timeStr}
----------------------------------
👤 *Cliente:* ${order.customerName}
📱 *Telefone/WhatsApp:* ${order.customerPhone}

📋 *ITENS DO PEDIDO:*
${itemsList}

----------------------------------
${deliveryText}
💰 *Subtotal:* ${formatBRL(order.subtotal)}
💳 *Forma de Pagamento:* ${paymentText}
${notesText}
----------------------------------
⭐ *VALOR TOTAL: ${formatBRL(order.total)}*

Aguardando confirmação do estabelecimento! ⚡`;
}
