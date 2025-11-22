// Tipos para o aplicativo de lista de compras

export interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
  category?: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  products: Product[];
  budget: number;
  createdAt: string;
  updatedAt: string;
  supermarketId?: string; // ID do supermercado selecionado
}

export interface SupermarketPrice {
  supermarketId: string;
  supermarketName: string;
  productId: string;
  price: number;
  lastUpdated: string;
}

export interface Supermarket {
  id: string;
  name: string;
  address: string;
  distance: number;
  latitude: number;
  longitude: number;
}

export interface ProductWithPrices extends Product {
  prices?: Map<string, number>; // supermarketId -> price
}
