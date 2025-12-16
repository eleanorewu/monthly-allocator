import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Calculator, Pencil, XCircle } from 'lucide-react';
import { BudgetItem } from '../types';
import { formatCurrency, safeCalculate } from '../utils/mathUtils';

interface BudgetItemRowProps {
  item: BudgetItem;
  onUpdate: (id: string, updates: Partial<BudgetItem>) => void;
  onRemove: (id: string) => void;
  isOverlay?: boolean;
}

export const BudgetItemRow: React.FC<BudgetItemRowProps> = ({ 
  item, 
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

  const [localAmountStr, setLocalAmountStr] = useState<string>(item.amount === 0 ? '' : item.amount.toString());
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const handleAmountBlur = () => {
    setIsEditingAmount(false);
    const calculated = safeCalculate(localAmountStr);
    onUpdate(item.id, { amount: calculated });
    setLocalAmountStr(calculated === 0 ? '' : calculated.toString());
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
      className={`group flex items-center gap-3 py-3 px-4 bg-white border border-slate-100 rounded-lg hover:border-slate-300 hover:shadow-md transition-all duration-200 ${isOverlay ? 'shadow-xl cursor-grabbing' : ''}`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 p-1 rounded hover:bg-slate-100"
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
          className="w-full bg-transparent text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:text-blue-600 transition-colors"
        />
        <Pencil size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
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
              className="w-full text-right bg-slate-50 border border-blue-400 rounded px-2 py-1 text-slate-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
             {/* Clear Button (only visible when editing) */}
             <button 
                onClick={clearAmount}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur
                className="absolute left-2 text-slate-400 hover:text-red-500"
                title="歸零"
             >
                <XCircle size={14} />
             </button>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditingAmount(true)}
            className="w-full text-right cursor-text group/amount flex items-center justify-end gap-2 py-1 border border-transparent hover:border-slate-200 rounded px-2 relative"
          >
             {/* Calculator Icon with Tooltip */}
             <span className="relative flex items-center justify-center text-slate-300 opacity-0 group-hover/amount:opacity-100 transition-opacity group/tooltip">
               <Calculator size={14} />
               {/* Tooltip Popup */}
               <div className="absolute top-1/2 right-full mr-2 -translate-y-1/2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none text-center font-sans leading-relaxed">
                 支援加減乘除運算，輸入計算內容後，按 Enter 鍵即可計算出結果。
                 {/* Arrow pointing right */}
                 <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-4 border-transparent border-l-slate-800"></div>
               </div>
             </span>

             <span className="font-semibold text-slate-700 font-mono">
               {formatCurrency(item.amount)}
             </span>
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};