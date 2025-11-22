// API de busca de produtos com imagens
// Utiliza múltiplas fontes para buscar imagens de produtos

export interface ProductSearchResult {
  name: string;
  imageUrl: string;
  suggestedName: string;
  category?: string;
}

// Imagens de fallback por categoria
const FALLBACK_IMAGES: Record<string, string> = {
  'Mercearia': 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&h=400&fit=crop',
  'Laticínios': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop',
  'Açougue': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop',
  'Hortifrúti': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&h=400&fit=crop',
  'Padaria': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
  'Bebidas': 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400&h=400&fit=crop',
  'Limpeza': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop',
  'Higiene': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
  'Outros': 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=400&h=400&fit=crop',
};

export async function searchProduct(productName: string): Promise<ProductSearchResult | null> {
  try {
    const category = categorizeProduct(productName);
    
    // Tentar buscar imagem do Unsplash (sem autenticação, usando source.unsplash.com)
    // Esta é uma URL pública que não requer API key
    const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(productName + ' food grocery')}`;
    
    // Verificar se a imagem está acessível
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.ok) {
        return {
          name: productName,
          imageUrl: imageUrl,
          suggestedName: productName,
          category: category,
        };
      }
    } catch (error) {
      // Se falhar, usar imagem de fallback
      console.log('Usando imagem de fallback para:', productName);
    }

    // Usar imagem de fallback baseada na categoria
    return {
      name: productName,
      imageUrl: FALLBACK_IMAGES[category] || FALLBACK_IMAGES['Outros'],
      suggestedName: productName,
      category: category,
    };
  } catch (error) {
    console.error('Erro na busca de produto:', error);
    
    // Retornar resultado com imagem de fallback mesmo em caso de erro
    const category = categorizeProduct(productName);
    return {
      name: productName,
      imageUrl: FALLBACK_IMAGES[category] || FALLBACK_IMAGES['Outros'],
      suggestedName: productName,
      category: category,
    };
  }
}

// Categorizar produto baseado no nome
export function categorizeProduct(productName: string): string {
  const name = productName.toLowerCase();
  
  if (name.match(/arroz|feijão|macarrão|farinha|açúcar|sal|óleo|azeite|vinagre|tempero|molho/)) {
    return 'Mercearia';
  }
  if (name.match(/leite|queijo|iogurte|manteiga|requeijão|creme de leite|nata/)) {
    return 'Laticínios';
  }
  if (name.match(/carne|frango|peixe|linguiça|bacon|salsicha|costela|picanha/)) {
    return 'Açougue';
  }
  if (name.match(/alface|tomate|cebola|batata|cenoura|frutas|banana|maçã|laranja|limão|abacaxi|mamão|uva|morango|verdura|legume/)) {
    return 'Hortifrúti';
  }
  if (name.match(/pão|bolo|biscoito|torta|rosca|croissant/)) {
    return 'Padaria';
  }
  if (name.match(/refrigerante|suco|água|cerveja|vinho|energético|chá|café/)) {
    return 'Bebidas';
  }
  if (name.match(/sabão|detergente|amaciante|desinfetante|papel higiênico|papel toalha|esponja|vassoura/)) {
    return 'Limpeza';
  }
  if (name.match(/shampoo|condicionador|sabonete|creme|pasta de dente|escova|fio dental|desodorante/)) {
    return 'Higiene';
  }
  
  return 'Outros';
}

// Buscar múltiplos produtos
export async function searchMultipleProducts(productNames: string[]): Promise<Map<string, ProductSearchResult | null>> {
  const results = new Map<string, ProductSearchResult | null>();
  
  // Buscar produtos em paralelo para melhor performance
  const promises = productNames.map(async (name) => {
    const result = await searchProduct(name);
    return { name, result };
  });
  
  const resolvedResults = await Promise.all(promises);
  
  resolvedResults.forEach(({ name, result }) => {
    results.set(name, result);
  });
  
  return results;
}
