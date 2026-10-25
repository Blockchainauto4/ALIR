import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBRL,
  calculateDiscountPercent,
  calculateItemSubtotal,
  calculateCartTotals,
  applyBulkAdjustment,
  formatWhatsAppMessage,
} from './priceCalculator';
import { CartItem, OrderDetails } from '../types/supermarket';

test('formatBRL formats Brazilian currency correctly', () => {
  const formatted = formatBRL(19.98);
  assert.ok(formatted.includes('19,98') || formatted.includes('19.98'));
  assert.ok(formatted.includes('R$'));
  assert.equal(formatBRL(0).includes('0,00'), true);
});

test('calculateDiscountPercent returns correct rounded percentage', () => {
  // original: 20, current: 15 -> 25% discount
  assert.equal(calculateDiscountPercent(20, 15), 25);
  // original: 45.98, current: 38.98 -> ~15%
  assert.equal(calculateDiscountPercent(45.98, 38.98), 15);
  // no discount if current >= original
  assert.equal(calculateDiscountPercent(20, 25), 0);
  assert.equal(calculateDiscountPercent(0, 10), 0);
});

test('calculateItemSubtotal supports fractional quantities (e.g. 1.5kg)', () => {
  // 1.5 kg of meat at R$ 20.00/kg
  assert.equal(calculateItemSubtotal(20, 1.5), 30);
  // 0.8 kg at R$ 38.98/kg = 31.184 -> 31.18
  assert.equal(calculateItemSubtotal(38.98, 0.8), 31.18);
  // invalid quantity returns 0
  assert.equal(calculateItemSubtotal(10, 0), 0);
});

test('calculateCartTotals calculates subtotals, delivery fee and free delivery thresholds', () => {
  const dummyItems: CartItem[] = [
    {
      product: {
        id: '1',
        name: 'Bife de Pernil',
        category: 'acougue',
        price: 19.98,
        unit: 'kg',
        isOffer: true,
        stockStatus: 'in_stock',
        updatedAt: new Date().toISOString(),
      },
      quantity: 2, // 39.96
    },
    {
      product: {
        id: '2',
        name: 'Toddy',
        category: 'mercearia',
        price: 10.90,
        unit: 'un',
        isOffer: true,
        stockStatus: 'in_stock',
        updatedAt: new Date().toISOString(),
      },
      quantity: 1, // 10.90
    },
  ];

  // Subtotal: 39.96 + 10.90 = 50.86 (< 80.00 threshold)
  const deliveryResult = calculateCartTotals(dummyItems, 'delivery', 80, 7.00);
  assert.equal(deliveryResult.subtotal, 50.86);
  assert.equal(deliveryResult.deliveryFee, 7.00);
  assert.equal(deliveryResult.total, 57.86);
  assert.equal(deliveryResult.isFreeDelivery, false);
  assert.equal(deliveryResult.remainingForFreeDelivery, 29.14);

  // Pickup should have no delivery fee
  const pickupResult = calculateCartTotals(dummyItems, 'pickup', 80, 7.00);
  assert.equal(pickupResult.deliveryFee, 0);
  assert.equal(pickupResult.total, 50.86);

  // Over threshold should have free delivery
  const bigOrderItems: CartItem[] = [
    {
      product: {
        id: '1',
        name: 'Picanha',
        category: 'acougue',
        price: 90.00,
        unit: 'kg',
        isOffer: false,
        stockStatus: 'in_stock',
        updatedAt: new Date().toISOString(),
      },
      quantity: 1,
    },
  ];
  const freeResult = calculateCartTotals(bigOrderItems, 'delivery', 80, 7.00);
  assert.equal(freeResult.isFreeDelivery, true);
  assert.equal(freeResult.deliveryFee, 0);
  assert.equal(freeResult.total, 90.00);
});

test('applyBulkAdjustment modifies prices percentage-wise', () => {
  // +10% on 20 -> 22
  assert.equal(applyBulkAdjustment(20, 10), 22);
  // -10% on 20 -> 18
  assert.equal(applyBulkAdjustment(20, -10), 18);
  // minimum floor of 0.1
  assert.ok(applyBulkAdjustment(0.05, -90) >= 0.1);
});

test('formatWhatsAppMessage builds complete order text', () => {
  const sampleOrder: OrderDetails = {
    customerName: 'Carlos Silva',
    customerPhone: '(11) 98765-4321',
    deliveryType: 'delivery',
    address: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    paymentMethod: 'pix',
    items: [
      {
        product: {
          id: '1',
          name: 'Filé de Frango',
          category: 'acougue',
          price: 21.98,
          unit: 'kg',
          isOffer: true,
          stockStatus: 'in_stock',
          updatedAt: new Date().toISOString(),
        },
        quantity: 2,
      },
    ],
    subtotal: 43.96,
    deliveryFee: 7.0,
    total: 50.96,
  };

  const message = formatWhatsAppMessage(sampleOrder);
  assert.ok(message.includes('SUPERMERCADO ALI RAIO DO SOL'));
  assert.ok(message.includes('Carlos Silva'));
  assert.ok(message.includes('Filé de Frango'));
  assert.ok(message.includes('Pix'));
});
