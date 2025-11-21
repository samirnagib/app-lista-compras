'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Save, List, Plus, Trash2 } from 'lucide-react';
import { Product, ShoppingList } from '@/lib/types';
import { storage } from '@/lib/storage';
import { AddProductForm } from '@/components/custom/AddProductForm';
import { ProductItem } from '@/components/custom/ProductItem';
import { BudgetControl } from '@/components/custom/BudgetControl';

export default function Home() {
  const [currentList, setCurrentList] = useState<ShoppingList | null>(null);
  const [savedLists, setSavedLists] = useState<ShoppingList[]>([]);
  const [showSavedLists, setShowSavedLists] = useState(false);
  const [listName, setListName] = useState('');

  // Carregar listas salvas ao montar
  useEffect(() => {
    const lists = storage.getAllLists();
    setSavedLists(lists);

    // Tentar carregar última lista
    const currentId = storage.getCurrentListId();
    if (currentId) {
      const list = storage.getList(currentId);
      if (list) {
        setCurrentList(list);
        setListName(list.name);
      }
    }

    // Se não houver lista, criar uma nova
    if (!currentId || !storage.getList(currentId)) {
      createNewList();
    }
  }, []);

  const createNewList = () => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: `Lista ${new Date().toLocaleDateString('pt-BR')}`,
      products: [],
      budget: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentList(newList);
    setListName(newList.name);
    storage.setCurrentListId(newList.id);
  };

  const handleAddProduct = (productData: Omit<Product, 'id' | 'checked'>) => {
    if (!currentList) return;

    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      checked: false,
    };

    const updatedList = {
      ...currentList,
      products: [...currentList.products, newProduct],
    };

    setCurrentList(updatedList);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    if (!currentList) return;

    const updatedList = {
      ...currentList,
      products: currentList.products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ),
    };

    setCurrentList(updatedList);
  };

  const handleDeleteProduct = (id: string) => {
    if (!currentList) return;

    const updatedList = {
      ...currentList,
      products: currentList.products.filter(p => p.id !== id),
    };

    setCurrentList(updatedList);
  };

  const handleBudgetChange = (budget: number) => {
    if (!currentList) return;

    const updatedList = {
      ...currentList,
      budget,
    };

    setCurrentList(updatedList);
  };

  const handleSaveList = () => {
    if (!currentList) return;

    const listToSave = {
      ...currentList,
      name: listName || currentList.name,
    };

    storage.saveList(listToSave);
    setSavedLists(storage.getAllLists());
    
    alert('✅ Lista salva com sucesso!');
  };

  const handleLoadList = (list: ShoppingList) => {
    setCurrentList(list);
    setListName(list.name);
    storage.setCurrentListId(list.id);
    setShowSavedLists(false);
  };

  const handleDeleteList = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta lista?')) {
      storage.deleteList(id);
      setSavedLists(storage.getAllLists());
      
      if (currentList?.id === id) {
        createNewList();
      }
    }
  };

  const handleDuplicateList = (list: ShoppingList) => {
    const newList: ShoppingList = {
      ...list,
      id: Date.now().toString(),
      name: `${list.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      products: list.products.map(p => ({ ...p, id: Date.now().toString() + Math.random(), checked: false })),
    };

    storage.saveList(newList);
    setSavedLists(storage.getAllLists());
    handleLoadList(newList);
  };

  const totalAmount = currentList?.products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0) || 0;

  if (!currentList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lista de Compras</h1>
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="text-sm text-gray-600 dark:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                  placeholder="Nome da lista"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSavedLists(!showSavedLists)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                title="Ver listas salvas"
              >
                <List className="w-6 h-6" />
              </button>
              <button
                onClick={handleSaveList}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
              >
                <Save className="w-5 h-5" />
                <span className="hidden sm:inline">Salvar</span>
              </button>
              <button
                onClick={createNewList}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Nova lista"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Listas Salvas */}
      {showSavedLists && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Listas Salvas</h2>
            {savedLists.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">Nenhuma lista salva ainda.</p>
            ) : (
              <div className="space-y-3">
                {savedLists.map(list => (
                  <div
                    key={list.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <button
                      onClick={() => handleLoadList(list)}
                      className="flex-1 text-left"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{list.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {list.products.length} {list.products.length === 1 ? 'item' : 'itens'} • 
                        R$ {list.products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0).toFixed(2)}
                      </p>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDuplicateList(list)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Duplicar lista"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Excluir lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Controle de Orçamento */}
        <BudgetControl
          budget={currentList.budget}
          total={totalAmount}
          onBudgetChange={handleBudgetChange}
        />

        {/* Formulário de Adicionar */}
        <AddProductForm onAdd={handleAddProduct} />

        {/* Lista de Produtos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Produtos ({currentList.products.length})
            </h2>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                R$ {totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {currentList.products.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Sua lista está vazia.</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Adicione produtos usando o formulário acima.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentList.products.map(product => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onUpdate={handleUpdateProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
