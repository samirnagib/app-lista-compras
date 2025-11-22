'use client';

import { Product } from '@/lib/types';
import { categorizeProduct } from '@/lib/productSearch';

interface ProductsBySectionProps {
  products: Product[];
  supermarketName: string;
}

interface Section {
  name: string;
  products: Product[];
  icon: string;
}

export function ProductsBySection({ products, supermarketName }: ProductsBySectionProps) {
  // Organizar produtos por seção
  const sections: Section[] = [];
  const sectionMap = new Map<string, Product[]>();

  products.forEach(product => {
    const category = product.category || categorizeProduct(product.name);
    
    if (!sectionMap.has(category)) {
      sectionMap.set(category, []);
    }
    sectionMap.get(category)!.push(product);
  });

  // Converter para array e ordenar
  const sectionOrder = [
    'Hortifrúti',
    'Açougue',
    'Laticínios',
    'Padaria',
    'Mercearia',
    'Bebidas',
    'Limpeza',
    'Higiene',
    'Outros',
  ];

  sectionOrder.forEach(sectionName => {
    const sectionProducts = sectionMap.get(sectionName);
    if (sectionProducts && sectionProducts.length > 0) {
      sections.push({
        name: sectionName,
        products: sectionProducts,
        icon: getSectionIcon(sectionName),
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
          📍 {supermarketName}
        </h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Produtos organizados por seção do supermercado
        </p>
      </div>

      {sections.map(section => (
        <div key={section.name} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-2xl">{section.icon}</span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {section.name}
            </h3>
            <span className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              {section.products.length} {section.products.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          <div className="space-y-2">
            {section.products.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qtd: {product.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    R$ {product.unitPrice.toFixed(2)} un.
                  </p>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                    R$ {(product.quantity * product.unitPrice).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function getSectionIcon(sectionName: string): string {
  const icons: Record<string, string> = {
    'Hortifrúti': '🥬',
    'Açougue': '🥩',
    'Laticínios': '🥛',
    'Padaria': '🍞',
    'Mercearia': '🛒',
    'Bebidas': '🥤',
    'Limpeza': '🧹',
    'Higiene': '🧴',
    'Outros': '📦',
  };
  
  return icons[sectionName] || '📦';
}
