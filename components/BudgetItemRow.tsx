import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Calculator, Pencil, XCircle } from 'lucide-react';
import { BudgetItem } from '../types';
import { formatCurrency, safeCalculate } from '../utils/mathUtils';

interface BudgetItemRowProps {
  item: BudgetItem;
  isDarkMode: boolean;
  onUpdate: (id: string, updates: Partial<BudgetItem>) => void;
  onRemove: (id: string) => void;
  isOverlay?: boolean;
}

export const BudgetItemRow: React.FC<BudgetItemRowProps> = ({ 
  item, 
  isDarkMode,
  onUpdate, 
  onRemove,
  isOverlay = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isOverlay ? 999 : 'auto',
  };

  const [localAmountStr, setLocalAmountStr] = useState<string>('');
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const handleAmountFocus = () => {
    setIsEditingAmount(true);
    // 當點擊時，如果當前金額為 0，清空輸入框讓用戶直接輸入
    if (item.amount === 0) {
      setLocalAmountStr('');
    } else {
      setLocalAmountStr(item.amount.toString());
    }
    // 確保輸入框獲得焦點後選中所有文字，方便用戶直接輸入
    setTimeout(() => {
      amountInputRef.current?.select();
    }, 0);
  };

  const handleAmountBlur = () => {
    setIsEditingAmount(false);
    const calculated = safeCalculate(localAmountStr);
    onUpdate(item.id, { amount: calculated });
    setLocalAmountStr('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      amountInputRef.current?.blur();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(item.id, { name: e.target.value });
  };

  // Helper to clear input
  const clearAmount = () => {
    setLocalAmountStr('');
    onUpdate(item.id, { amount: 0 });
    amountInputRef.current?.focus();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 py-3 px-4 ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-100 hover:border-slate-300'} border rounded-lg hover:shadow-md transition-all duration-200 ${isOverlay ? 'shadow-xl cursor-grabbing' : ''}`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className={`cursor-grab active:cursor-grabbing ${isDarkMode ? 'text-slate-500 hover:text-slate-400 hover:bg-slate-700' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'} p-1 rounded`}
      >
        <GripVertical size={20} />
      </div>

      {/* Item Name */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={item.name}
          onChange={handleNameChange}
          placeholder="項目名稱"
          className={`w-full bg-transparent ${isDarkMode ? 'text-slate-200 placeholder-slate-500 focus:text-blue-400' : 'text-slate-700 placeholder-slate-400 focus:text-blue-600'} font-medium focus:outline-none transition-colors`}
        />
        <Pencil size={14} className={`absolute right-0 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-300'} opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity`} />
      </div>

      {/* Amount Input */}
      <div className="relative w-40">
        {isEditingAmount ? (
          <div className="relative flex items-center">
            <input
              ref={amountInputRef}
              type="text"
              value={localAmountStr}
              onChange={(e) => setLocalAmountStr(e.target.value)}
              onBlur={handleAmountBlur}
              onKeyDown={handleKeyDown}
              placeholder="0"
              autoFocus
              className={`w-full text-right ${isDarkMode ? 'bg-slate-700 border-blue-500 text-slate-100 focus:ring-blue-600' : 'bg-slate-50 border-blue-400 text-slate-800 focus:ring-blue-200'} border rounded px-2 py-1 font-mono text-sm focus:outline-none focus:ring-2`}
            />
             {/* Clear Button (only visible when editing) */}
             <button 
                onClick={clearAmount}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur
                className={`absolute left-2 ${isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`}
                title="歸零"
             >
                <XCircle size={14} />
             </button>
          </div>
        ) : (
          <div 
            onClick={handleAmountFocus}
            className={`w-full text-right cursor-text flex items-center justify-end gap-2 py-1 border border-transparent ${isDarkMode ? 'hover:border-slate-600' : 'hover:border-slate-200'} rounded px-2 relative`}
          >
             {/* Calculator Icon */}
             <span className={`flex items-center justify-center ${isDarkMode ? 'text-slate-500 hover:text-blue-400' : 'text-slate-300 hover:text-blue-500'}`}>
               <Calculator size={14} />
             </span>

             {item.amount === 0 ? (
               <span className={`font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} font-mono`}>
                 0
               </span>
             ) : (
               <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} font-mono`}>
                 {formatCurrency(item.amount)}
               </span>
             )}
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onRemove(item.id)}
        className={`${isDarkMode ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'} p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100`}
        aria-label="Delete item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};