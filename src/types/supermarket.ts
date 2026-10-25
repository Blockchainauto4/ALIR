export type ProductCategory = 
  | 'todos'
  | 'acougue'
  | 'mercearia'
  | 'hortifruti'
  | 'bebidas'
  | 'padaria'
  | 'limpeza';

export type ProductUnit = 'kg' | 'un' | 'bandeja' | 'pacote' | 'saco';

export interface Product {
  id: string;
  name: string;
  category: 'acougue' | 'mercearia' | 'hortifruti' | 'bebidas' | 'padaria' | 'limpeza';
  price: number;
  originalPrice?: number;
  unit: ProductUnit;
  isOffer: boolean;
  isFromStoreFrontPhoto?: boolean; // From the store banner photo
  isFlashSale?: boolean;
  flashEndsAt?: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  description?: string;
  imageUrl?: string;
  updatedAt: string;
  cutType?: 'bovino' | 'suino' | 'aves' | 'embutidos' | 'outros';
}

export interface CartItem {
  product: Product;
  quantity: number; // e.g. 1.5 kg or 2 units
}

export interface PriceUpdateLog {
  id: string;
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  timestamp: string;
}

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  neighborhood?: string;
  paymentMethod: 'pix' | 'cartao' | 'dinheiro';
  changeFor?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}
