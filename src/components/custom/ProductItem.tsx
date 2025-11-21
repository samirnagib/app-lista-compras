'use client';

import { Product } from '@/lib/types';
import { Pencil, Trash2, Check } from 'lucide-react';
import { useState } from 'react';

interface ProductItemProps {
  product: Product;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductItem({ product, onUpdate, onDelete }: ProductItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const handleSave = () => {
    onUpdate(editedProduct);
    setIsEditing(false);
  };

  const toggleChecked = () => {
    onUpdate({ ...product, checked: !product.checked });
  };

  const total = product.quantity * product.unitPrice;

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-3">
          <input
            type="text"
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Nome do produto"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Quantidade</label>
              <input
                type="number"
                min="1"
                value={editedProduct.quantity}
                onChange={(e) => setEditedProduct({ ...editedProduct, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Preço Unit.</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editedProduct.unitPrice}
                onChange={(e) => setEditedProduct({ ...editedProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-all ${product.checked ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={toggleChecked}
          className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
            product.checked 
              ? 'bg-emerald-500 border-emerald-500' 
              : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
          }`}
        >
          {product.checked && <Check className="w-4 h-4 text-white" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-gray-900 dark:text-gray-100 ${product.checked ? 'line-through' : ''}`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <span>Qtd: {product.quantity}</span>
            <span>•</span>
            <span>R$ {product.unitPrice.toFixed(2)}</span>
          </div>
          <div className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            R$ {total.toFixed(2)}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
