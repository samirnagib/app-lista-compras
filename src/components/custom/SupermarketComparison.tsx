'use client';

import { useState, useEffect } from 'react';
import { MapPin, Store, TrendingDown, X, ChevronRight } from 'lucide-react';
import { Supermarket } from '@/lib/types';
import { getUserLocation, findNearbySupermarkets, fetchProductPrices } from '@/lib/geolocation';
import { Product } from '@/lib/types';

interface SupermarketComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectSupermarket: (supermarket: Supermarket) => void;
}

export function SupermarketComparison({ 
  isOpen, 
  onClose, 
  products,
  onSelectSupermarket 
}: SupermarketComparisonProps) {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productPrices, setProductPrices] = useState<Map<string, Map<string, number>>>(new Map());

  useEffect(() => {
    if (isOpen) {
      loadSupermarkets();
    }
  }, [isOpen]);

  const loadSupermarkets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await getUserLocation();
      
      if (!location) {
        setError('Não foi possível obter sua localização. Verifique as permissões do navegador.');
        setIsLoading(false);
        return;
      }

      const nearby = await findNearbySupermarkets(location);
      setSupermarkets(nearby);

      // Buscar preços para cada produto em cada supermercado
      const pricesMap = new Map<string, Map<string, number>>();
      
      for (const product of products) {
        const prices = await fetchProductPrices(
          product.name,
          nearby.map(s => s.id)
        );
        pricesMap.set(product.id, prices);
      }

      setProductPrices(pricesMap);
    } catch (err) {
      setError('Erro ao buscar supermercados próximos.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalForSupermarket = (supermarketId: string): number => {
    let total = 0;
    
    for (const product of products) {
      const prices = productPrices.get(product.id);
      const price = prices?.get(supermarketId) || product.unitPrice;
      total += price * product.quantity;
    }
    
    return total;
  };

  const findCheapestSupermarket = (): string | null => {
    if (supermarkets.length === 0) return null;
    
    let cheapestId = supermarkets[0].id;
    let cheapestTotal = calculateTotalForSupermarket(cheapestId);
    
    for (const market of supermarkets.slice(1)) {
      const total = calculateTotalForSupermarket(market.id);
      if (total < cheapestTotal) {
        cheapestTotal = total;
        cheapestId = market.id;
      }
    }
    
    return cheapestId;
  };

  if (!isOpen) return null;

  const cheapestId = findCheapestSupermarket();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Comparar Preços
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Buscando supermercados próximos...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={loadSupermarkets}
                className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!isLoading && !error && supermarkets.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Nenhum supermercado encontrado próximo a você.
              </p>
            </div>
          )}

          {!isLoading && !error && supermarkets.length > 0 && (
            <div className="space-y-3">
              {supermarkets.map(market => {
                const total = calculateTotalForSupermarket(market.id);
                const isCheapest = market.id === cheapestId;
                
                return (
                  <button
                    key={market.id}
                    onClick={() => {
                      onSelectSupermarket(market);
                      onClose();
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      isCheapest
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {market.name}
                          </h3>
                          {isCheapest && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                              <TrendingDown className="w-3 h-3" />
                              Mais barato
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {market.address}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            {market.distance.toFixed(1)} km
                          </span>
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            R$ {total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && !error && supermarkets.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              💡 Os preços são estimados e podem variar. Selecione um supermercado para registrar os preços reais.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
