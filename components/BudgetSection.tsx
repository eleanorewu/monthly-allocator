import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BudgetItem, ItemType } from '../types';
import { BudgetItemRow } from './BudgetItemRow';
import { Plus, Info } from 'lucide-react';
import { formatCurrency } from '../utils/mathUtils';

interface BudgetSectionProps {
  title: string;
  type: ItemType;
  items: BudgetItem[];
  total: number;
  isDarkMode: boolean;
  onAddItem: (type: ItemType) => void;
  onUpdateItem: (id: string, updates: Partial<BudgetItem>) => void;
  onRemoveItem: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  title,
  type,
  items,
  total,
  isDarkMode,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onReorder
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      onReorder(active.id, over.id);
    }
    setActiveId(null);
  };

  const activeItem = items.find(item => item.id === activeId);

  const headerColor = type === 'INCOME' 
    ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
    : (isDarkMode ? 'text-rose-400' : 'text-rose-600');
  const totalColor = type === 'INCOME' 
    ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-700')
    : (isDarkMode ? 'text-rose-400' : 'text-rose-700');
  const buttonColor = type === 'INCOME' 
    ? (isDarkMode ? 'hover:bg-emerald-900/30 hover:text-emerald-400' : 'hover:bg-emerald-50 hover:text-emerald-600')
    : (isDarkMode ? 'hover:bg-rose-900/30 hover:text-rose-400' : 'hover:bg-rose-50 hover:text-rose-600');

  return (
    <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden flex flex-col h-full`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'} flex justify-between items-center`}>
        <h2 className={`text-lg font-bold ${headerColor} flex items-center gap-2`}>
          {title}
        </h2>
        <button
          onClick={() => onAddItem(type)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-500'} rounded-md transition-colors ${buttonColor}`}
        >
          <Plus size={16} />
          <span>新增項目</span>
        </button>
      </div>

      {/* Column Headers */}
      <div className={`px-4 py-2 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'} border-b flex text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'} uppercase tracking-wider`}>
        <div className="w-8"></div>
        <div className="flex-1">項目</div>
        <div className="w-40 text-right flex items-center justify-end gap-1">
          <span className="relative group">
            <Info size={12} className={`cursor-pointer ${isDarkMode ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-500'}`} />
            <div className={`absolute top-1/2 right-full mr-2 -translate-y-1/2 w-48 p-2 ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-800 text-white'} text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-center font-sans leading-relaxed whitespace-pre-line`}>
              支援加減乘除運算，輸入計算內容後，按 Enter 鍵即可計算出結果。
              <div className={`absolute top-1/2 -right-2 -translate-y-1/2 border-4 border-transparent ${isDarkMode ? 'border-l-slate-700' : 'border-l-slate-800'}`}></div>
            </div>
          </span>
          金額
        </div>
        <div className="w-8"></div>
      </div>

      {/* List */}
      <div className="flex-1 p-4 overflow-y-auto min-h-[300px]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {items.map((item) => (
                <BudgetItemRow
                  key={item.id}
                  item={item}
                  isDarkMode={isDarkMode}
                  onUpdate={onUpdateItem}
                  onRemove={onRemoveItem}
                />
              ))}
              {items.length === 0 && (
                <div className={`text-center py-10 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} italic`}>
                  暫無項目，請點擊上方按鈕新增
                </div>
              )}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && activeItem ? (
              <BudgetItemRow
                item={activeItem}
                isDarkMode={isDarkMode}
                onUpdate={() => {}}
                onRemove={() => {}}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Footer Total */}
      <div className={`p-4 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border-t flex justify-between items-center`}>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>總{title}</span>
        <span className={`text-xl font-bold font-mono ${totalColor}`}>
          {formatCurrency(total)} <span className={`text-sm font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>元</span>
        </span>
      </div>
    </div>
  );
};
