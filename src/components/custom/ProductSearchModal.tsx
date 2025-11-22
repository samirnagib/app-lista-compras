'use client';

import { useState } from 'react';
import { Search, Image as ImageIcon, X, Check } from 'lucide-react';
import { searchProduct, ProductSearchResult } from '@/lib/productSearch';

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: ProductSearchResult) => void;
  initialProductName: string;
}

export function ProductSearchModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialProductName 
}: ProductSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialProductName);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<ProductSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editedName, setEditedName] = useState(initialProductName);
  const [manualImageUrl, setManualImageUrl] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    
    try {
      const result = await searchProduct(searchQuery);
      
      if (result) {
        setSearchResult(result);
        setEditedName(result.suggestedName);
      } else {
        setError('Produto não encontrado. Você pode adicionar manualmente.');
      }
    } catch (err) {
      setError('Erro ao buscar produto. Tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = () => {
    if (searchResult) {
      onConfirm({
        ...searchResult,
        name: editedName,
        suggestedName: editedName,
        imageUrl: manualImageUrl || searchResult.imageUrl,
      });
    } else {
      // Adicionar manualmente
      onConfirm({
        name: editedName,
        suggestedName: editedName,
        imageUrl: manualImageUrl,
        category: undefined,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Buscar Produto
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Digite o nome do produto..."
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
            </div>
          )}

          {/* Search Result */}
          {searchResult && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                {searchResult.imageUrl && (
                  <img
                    src={searchResult.imageUrl}
                    alt={searchResult.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome do Produto
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {searchResult.category && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Categoria: {searchResult.category}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Manual Input */}
          {(error || !searchResult) && (
            <div className="space-y-4">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Ou adicione manualmente:
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ex: Arroz Integral 1kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL da Imagem (opcional)
                    </label>
                    <input
                      type="url"
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  {manualImageUrl && (
                    <img
                      src={manualImageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!editedName.trim()}
            className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
