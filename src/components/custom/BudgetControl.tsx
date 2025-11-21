'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface BudgetControlProps {
  budget: number;
  total: number;
  onBudgetChange: (budget: number) => void;
}

export function BudgetControl({ budget, total, onBudgetChange }: BudgetControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget.toString());

  const remaining = budget - total;
  const percentage = budget > 0 ? (total / budget) * 100 : 0;
  const isOverBudget = remaining < 0;

  const handleSave = () => {
    const newBudget = parseFloat(tempBudget) || 0;
    onBudgetChange(newBudget);
    setIsEditing(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Controle de Orçamento</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setTempBudget(budget.toString());
            }}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
          >
            Editar
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="number"
            min="0"
            step="0.01"
            value={tempBudget}
            onChange={(e) => setTempBudget(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent"
            placeholder="Digite o orçamento"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-white/80">Orçamento:</span>
              <span className="text-2xl font-bold">R$ {budget.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-white/80">Total Gasto:</span>
              <span className="text-2xl font-bold">R$ {total.toFixed(2)}</span>
            </div>

            <div className="h-px bg-white/30 my-2"></div>

            <div className="flex justify-between items-baseline">
              <span className="text-white/80 flex items-center gap-2">
                {isOverBudget ? (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Acima do Orçamento:
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    Saldo Restante:
                  </>
                )}
              </span>
              <span className={`text-2xl font-bold ${isOverBudget ? 'text-red-200' : 'text-green-200'}`}>
                R$ {Math.abs(remaining).toFixed(2)}
              </span>
            </div>
          </div>

          {budget > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso</span>
                <span>{percentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget 
                      ? 'bg-red-400' 
                      : percentage > 80 
                      ? 'bg-yellow-400' 
                      : 'bg-green-400'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              {isOverBudget && (
                <p className="text-sm text-red-200 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Você ultrapassou o orçamento!
                </p>
              )}
              {!isOverBudget && percentage > 80 && (
                <p className="text-sm text-yellow-200 mt-2">
                  Atenção: você já gastou mais de 80% do orçamento.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
