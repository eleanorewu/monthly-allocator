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

  const headerColor = type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600';
  const totalColor = type === 'INCOME' ? 'text-emerald-700' : 'text-rose-700';
  const buttonColor = type === 'INCOME' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-rose-50 hover:text-rose-600';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className={`text-lg font-bold ${headerColor} flex items-center gap-2`}>
          {title}
        </h2>
        <button
          onClick={() => onAddItem(type)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 rounded-md transition-colors ${buttonColor}`}
        >
          <Plus size={16} />
          <span>新增項目</span>
        </button>
      </div>

      {/* Column Headers */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <div className="w-8"></div>
        <div className="flex-1">項目</div>
        <div className="w-40 text-right flex items-center justify-end gap-1">
          <Info size={12} />
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
                  onUpdate={onUpdateItem}
                  onRemove={onRemoveItem}
                />
              ))}
              {items.length === 0 && (
                <div className="text-center py-10 text-slate-400 italic">
                  暫無項目，請點擊上方按鈕新增
                </div>
              )}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && activeItem ? (
              <BudgetItemRow
                item={activeItem}
                onUpdate={() => {}}
                onRemove={() => {}}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Footer Total */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500">總{title}</span>
        <span className={`text-xl font-bold font-mono ${totalColor}`}>
          {formatCurrency(total)} <span className="text-sm font-normal text-slate-400">元</span>
        </span>
      </div>
    </div>
  );
};
