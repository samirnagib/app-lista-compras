// Gerenciamento de localStorage para listas de compras
import { ShoppingList } from './types';

const STORAGE_KEY = 'shopping_lists';
const CURRENT_LIST_KEY = 'current_list_id';

export const storage = {
  // Obter todas as listas
  getAllLists: (): ShoppingList[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Salvar lista
  saveList: (list: ShoppingList): void => {
    if (typeof window === 'undefined') return;
    const lists = storage.getAllLists();
    const index = lists.findIndex(l => l.id === list.id);
    
    if (index >= 0) {
      lists[index] = { ...list, updatedAt: new Date().toISOString() };
    } else {
      lists.push(list);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  },

  // Obter lista por ID
  getList: (id: string): ShoppingList | null => {
    const lists = storage.getAllLists();
    return lists.find(l => l.id === id) || null;
  },

  // Deletar lista
  deleteList: (id: string): void => {
    if (typeof window === 'undefined') return;
    const lists = storage.getAllLists().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  },

  // Definir lista atual
  setCurrentListId: (id: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CURRENT_LIST_KEY, id);
  },

  // Obter ID da lista atual
  getCurrentListId: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CURRENT_LIST_KEY);
  },
};
