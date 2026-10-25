import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Product, CartItem, PriceUpdateLog, ProductCategory } from '../types/supermarket';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { applyBulkAdjustment } from '../utils/priceCalculator';

interface PriceSyncContextType {
  products: Product[];
  cart: CartItem[];
  notifications: Array<{ id: string; text: string; type: 'drop' | 'increase' | 'offer' | 'info'; timestamp: number }>;
  recentLogs: PriceUpdateLog[];
  updatedProductId: string | null;
  isSyncConnected: boolean;
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Price actions
  updateProductPrice: (productId: string, newPrice: number, isOffer?: boolean) => void;
  toggleOffer: (productId: string) => void;
  toggleFlashSale: (productId: string, hours?: number) => void;
  addProduct: (newProduct: Omit<Product, 'id' | 'updatedAt'>) => void;
  deleteProduct: (productId: string) => void;
  resetToPhotoDefaults: () => void;
  simulateLivePriceDrop: () => void;
  applyBulkCategoryAdjustment: (category: ProductCategory, percentChange: number) => void;
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  // Modals & views
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedPosterProduct: Product | null;
  setSelectedPosterProduct: (p: Product | null) => void;
  isManagerOpen: boolean;
  setIsManagerOpen: (open: boolean) => void;
  isSignageOpen: boolean;
  setIsSignageOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'ali_raio_do_sol_products_v1';
const CART_STORAGE_KEY = 'ali_raio_do_sol_cart_v1';
const CHANNEL_NAME = 'ali_raio_do_sol_price_channel';

const PriceSyncContext = createContext<PriceSyncContextType | undefined>(undefined);

export const PriceSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [recentLogs, setRecentLogs] = useState<PriceUpdateLog[]>([]);
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; type: 'drop' | 'increase' | 'offer' | 'info'; timestamp: number }>>([]);
  const [updatedProductId, setUpdatedProductId] = useState<string | null>(null);
  const [isSyncConnected, setIsSyncConnected] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedPosterProduct, setSelectedPosterProduct] = useState<Product | null>(null);
  const [isManagerOpen, setIsManagerOpen] = useState<boolean>(false);
  const [isSignageOpen, setIsSignageOpen] = useState<boolean>(false);

  const channelRef = useRef<BroadcastChannel | null>(null);

  // Helper to push notification
  const addNotification = useCallback((text: string, type: 'drop' | 'increase' | 'offer' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [{ id, text, type, timestamp: Date.now() }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  }, []);

  // Broadcast channel setup
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channelRef.current = channel;

        channel.onmessage = (event) => {
          const { type, payload } = event.data || {};
          if (type === 'PRICE_UPDATE') {
            const { updatedProducts, log, message } = payload;
            setProducts(updatedProducts);
            if (log) {
              setRecentLogs((prev) => [log, ...prev.slice(0, 9)]);
              setUpdatedProductId(log.productId);
              setTimeout(() => setUpdatedProductId(null), 2500);
            }
            if (message) {
              addNotification(message, log?.newPrice < log?.oldPrice ? 'drop' : 'increase');
            }
          } else if (type === 'CATALOG_SYNC') {
            setProducts(payload.products);
          }
        };
      }
    } catch {
      setIsSyncConnected(false);
    }

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, [addNotification]);

  // Persist products to localStorage and update cart item prices if products change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // storage quota or error
    }

    // Keep cart item prices synchronized with updated product prices
    setCart((prevCart) => {
      return prevCart.map((item) => {
        const currentProd = products.find((p) => p.id === item.product.id);
        if (currentProd && currentProd.price !== item.product.price) {
          return {
            ...item,
            product: currentProd,
          };
        }
        return item;
      });
    });
  }, [products]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // fallback
    }
  }, [cart]);

  // Broadcast helper
  const broadcastChange = useCallback((newProducts: Product[], log?: PriceUpdateLog, message?: string) => {
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({
          type: 'PRICE_UPDATE',
          payload: { updatedProducts: newProducts, log, message },
        });
      } catch {
        // ignore broadcast errors
      }
    }
  }, []);

  // Update a single product price
  const updateProductPrice = useCallback((productId: string, newPrice: number, isOffer?: boolean) => {
    setProducts((prev) => {
      const target = prev.find((p) => p.id === productId);
      if (!target) return prev;

      const oldPrice = target.price;
      const roundedPrice = Math.max(0.1, Math.round(newPrice * 100) / 100);

      const log: PriceUpdateLog = {
        id: Math.random().toString(36).substring(2, 9),
        productId,
        productName: target.name,
        oldPrice,
        newPrice: roundedPrice,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
      };

      const updated = prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            price: roundedPrice,
            originalPrice: p.originalPrice || oldPrice,
            isOffer: isOffer !== undefined ? isOffer : (roundedPrice < oldPrice ? true : p.isOffer),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      setRecentLogs((l) => [log, ...l.slice(0, 9)]);
      setUpdatedProductId(productId);
      setTimeout(() => setUpdatedProductId(null), 2500);

      const isDrop = roundedPrice < oldPrice;
      const msg = `⚡ Preço de "${target.name}" atualizado: R$ ${roundedPrice.toFixed(2).replace('.', ',')} (${isDrop ? 'Baixou!' : 'Novo preço'})`;
      addNotification(msg, isDrop ? 'drop' : 'increase');

      broadcastChange(updated, log, msg);
      return updated;
    });
  }, [addNotification, broadcastChange]);

  // Toggle Offer
  const toggleOffer = useCallback((productId: string) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === productId ? { ...p, isOffer: !p.isOffer, updatedAt: new Date().toISOString() } : p));
      broadcastChange(updated);
      return updated;
    });
  }, [broadcastChange]);

  // Toggle Flash Sale
  const toggleFlashSale = useCallback((productId: string, hours: number = 2) => {
    setProducts((prev) => {
      const target = prev.find((p) => p.id === productId);
      if (!target) return prev;
      const isActivating = !target.isFlashSale;
      const updated = prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            isFlashSale: isActivating,
            isOffer: true,
            flashEndsAt: isActivating ? new Date(Date.now() + hours * 3600 * 1000).toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      if (isActivating) {
        addNotification(`🔥 Oferta Relâmpago ativada para "${target.name}"!`, 'offer');
      }
      broadcastChange(updated);
      return updated;
    });
  }, [addNotification, broadcastChange]);

  // Add Product
  const addProduct = useCallback((newProduct: Omit<Product, 'id' | 'updatedAt'>) => {
    const id = 'prod-custom-' + Date.now();
    const product: Product = {
      ...newProduct,
      id,
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => {
      const updated = [product, ...prev];
      broadcastChange(updated);
      return updated;
    });
    addNotification(`✅ Novo produto cadastrado: ${product.name}`, 'info');
  }, [addNotification, broadcastChange]);

  // Delete Product
  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      broadcastChange(updated);
      return updated;
    });
    addNotification('Item removido do catálogo.', 'info');
  }, [addNotification, broadcastChange]);

  // Reset to photo defaults
  const resetToPhotoDefaults = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    broadcastChange(INITIAL_PRODUCTS);
    addNotification('🔄 Preços restaurados para os valores originais da foto da loja!', 'info');
  }, [addNotification, broadcastChange]);

  // Simulate live price drop
  const simulateLivePriceDrop = useCallback(() => {
    const meatOrOffers = products.filter((p) => p.category === 'acougue' || p.isOffer);
    if (meatOrOffers.length === 0) return;
    const randomItem = meatOrOffers[Math.floor(Math.random() * meatOrOffers.length)];
    // drop price by 5% to 15%
    const discountPercent = (Math.floor(Math.random() * 3) + 1) * 5;
    const newPrice = Math.max(1, Math.round(randomItem.price * (1 - discountPercent / 100) * 100) / 100);
    updateProductPrice(randomItem.id, newPrice, true);
  }, [products, updateProductPrice]);

  // Apply bulk category adjustment
  const applyBulkCategoryAdjustment = useCallback((category: ProductCategory, percentChange: number) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (category === 'todos' || p.category === category) {
          const newPrice = applyBulkAdjustment(p.price, percentChange);
          return {
            ...p,
            originalPrice: p.originalPrice || p.price,
            price: newPrice,
            isOffer: percentChange < 0 ? true : p.isOffer,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      broadcastChange(updated);
      addNotification(`Ajuste de ${percentChange > 0 ? '+' : ''}${percentChange}% aplicado em ${category.toUpperCase()}`, 'info');
      return updated;
    });
  }, [addNotification, broadcastChange]);

  // Cart operations
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.round((item.quantity + quantity) * 100) / 100 }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addNotification(`🛒 "${product.name}" adicionado ao carrinho!`, 'info');
  }, [addNotification]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.round(quantity * 100) / 100 } : item
      );
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + (item.product.unit === 'kg' ? 1 : item.quantity), 0);

  return (
    <PriceSyncContext.Provider
      value={{
        products,
        cart,
        notifications,
        recentLogs,
        updatedProductId,
        isSyncConnected,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        updateProductPrice,
        toggleOffer,
        toggleFlashSale,
        addProduct,
        deleteProduct,
        resetToPhotoDefaults,
        simulateLivePriceDrop,
        applyBulkCategoryAdjustment,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        selectedPosterProduct,
        setSelectedPosterProduct,
        isManagerOpen,
        setIsManagerOpen,
        isSignageOpen,
        setIsSignageOpen,
      }}
    >
      {children}
    </PriceSyncContext.Provider>
  );
};

export const usePriceSync = () => {
  const context = useContext(PriceSyncContext);
  if (!context) {
    throw new Error('usePriceSync must be used within a PriceSyncProvider');
  }
  return context;
};
