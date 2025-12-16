import React, { useState, useMemo, useRef } from 'react';
import { Download, Moon, Sun, Wallet } from 'lucide-react';
import { arrayMove } from '@dnd-kit/sortable';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BudgetItem, ItemType } from './types';
import { generateId, formatCurrency } from './utils/mathUtils';
import { BudgetSection } from './components/BudgetSection';

// Initial Data
const INITIAL_INCOME: BudgetItem[] = [
  { id: 'inc-1', name: '上個月盈餘', amount: 0 },
  { id: 'inc-2', name: '薪資', amount: 50000 },
  { id: 'inc-3', name: '獎金', amount: 5000 },
];

const INITIAL_EXPENSE: BudgetItem[] = [
  { id: 'exp-1', name: '房租', amount: 12000 },
  { id: 'exp-2', name: '生活費', amount: 8000 },
  { id: 'exp-3', name: '水電瓦斯', amount: 1500 },
  { id: 'exp-4', name: '交通', amount: 1280 },
  { id: 'exp-5', name: '電話費', amount: 499 },
];

const App: React.FC = () => {
  const [month, setMonth] = useState<string>(new Date().getMonth() + 1 + '');
  const [incomeItems, setIncomeItems] = useState<BudgetItem[]>(INITIAL_INCOME);
  const [expenseItems, setExpenseItems] = useState<BudgetItem[]>(INITIAL_EXPENSE);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // -- Calculations --
  const totalIncome = useMemo(() => incomeItems.reduce((sum, item) => sum + item.amount, 0), [incomeItems]);
  const totalExpense = useMemo(() => expenseItems.reduce((sum, item) => sum + item.amount, 0), [expenseItems]);
  const balance = totalIncome - totalExpense;

  // -- Handlers --
  const handleAddItem = (type: ItemType) => {
    const newItem: BudgetItem = { id: generateId(), name: '', amount: 0 };
    if (type === 'INCOME') {
      setIncomeItems([...incomeItems, newItem]);
    } else {
      setExpenseItems([...expenseItems, newItem]);
    }
  };

  const handleUpdateItem = (type: ItemType, id: string, updates: Partial<BudgetItem>) => {
    const updater = (items: BudgetItem[]) => items.map(item => item.id === id ? { ...item, ...updates } : item);
    if (type === 'INCOME') setIncomeItems(updater);
    else setExpenseItems(updater);
  };

  const handleRemoveItem = (type: ItemType, id: string) => {
    if (type === 'INCOME') setIncomeItems(incomeItems.filter(item => item.id !== id));
    else setExpenseItems(expenseItems.filter(item => item.id !== id));
  };

  const handleReorder = (type: ItemType, activeId: string, overId: string) => {
    const reorderList = (items: BudgetItem[]) => {
      const oldIndex = items.findIndex(i => i.id === activeId);
      const newIndex = items.findIndex(i => i.id === overId);
      return arrayMove(items, oldIndex, newIndex);
    };
    
    if (type === 'INCOME') setIncomeItems(reorderList(incomeItems));
    else setExpenseItems(reorderList(expenseItems));
  };

  // -- PDF Export --
  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    
    // Slight delay to ensure UI updates if needed
    await new Promise(r => setTimeout(r, 100));

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297; // A4 Landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`預算分配表_${month}月.pdf`);
    } catch (err) {
      console.error("PDF Export failed", err);
      alert("匯出失敗，請稍後再試");
    } finally {
      setIsExporting(false);
    }
  };

  // -- Toggle Theme --
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Top Controls */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
              <Wallet size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">每月現金預算分配</h1>
         </div>

         <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-white hover:bg-slate-100 text-slate-500 shadow-sm'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
         </div>
      </header>

      {/* Main Content Area - This part gets captured for PDF */}
      <div 
        ref={printRef} 
        className={`max-w-7xl mx-auto space-y-8 ${isExporting ? 'p-8' : ''} ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}
      >
        
        {/* Date & Download Bar */}
        <div className={`rounded-xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-4">
            <label className={`text-lg font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              月份 :
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                min="1" max="12"
                className={`w-20 text-center text-xl font-bold py-1 px-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
              />
              <span className="ml-2 text-lg font-medium text-slate-500">月預算分配</span>
            </div>
          </div>

          {!isExporting && (
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow transition-all hover:shadow-md active:scale-95"
            >
              <Download size={18} />
              <span>下載 PDF</span>
            </button>
          )}
        </div>

        {/* Budget Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <BudgetSection 
            title="收入"
            type="INCOME"
            items={incomeItems}
            total={totalIncome}
            onAddItem={handleAddItem}
            onUpdateItem={(id, updates) => handleUpdateItem('INCOME', id, updates)}
            onRemoveItem={(id) => handleRemoveItem('INCOME', id)}
            onReorder={(active, over) => handleReorder('INCOME', active, over)}
          />

          <BudgetSection 
            title="支出"
            type="EXPENSE"
            items={expenseItems}
            total={totalExpense}
            onAddItem={handleAddItem}
            onUpdateItem={(id, updates) => handleUpdateItem('EXPENSE', id, updates)}
            onRemoveItem={(id) => handleRemoveItem('EXPENSE', id)}
            onReorder={(active, over) => handleReorder('EXPENSE', active, over)}
          />
        </div>

        {/* Summary Card */}
        <div className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-sm uppercase tracking-wide font-semibold mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>每月結算</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Income */}
            <div className={`p-5 rounded-lg border-l-4 ${isDarkMode ? 'bg-emerald-900/20 border-emerald-500' : 'bg-emerald-50 border-emerald-400'}`}>
              <div className="text-emerald-600/80 text-sm font-medium mb-1">總收入</div>
              <div className="text-2xl md:text-3xl font-bold text-emerald-600 font-mono">
                {formatCurrency(totalIncome)} <span className="text-base font-normal">元</span>
              </div>
            </div>

            {/* Total Expense */}
            <div className={`p-5 rounded-lg border-l-4 ${isDarkMode ? 'bg-rose-900/20 border-rose-500' : 'bg-rose-50 border-rose-400'}`}>
              <div className="text-rose-600/80 text-sm font-medium mb-1">總支出</div>
              <div className="text-2xl md:text-3xl font-bold text-rose-600 font-mono">
                {formatCurrency(totalExpense)} <span className="text-base font-normal">元</span>
              </div>
            </div>

            {/* Balance */}
            <div className={`p-5 rounded-lg border-l-4 transition-colors ${
              balance >= 0 
                ? (isDarkMode ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-400')
                : (isDarkMode ? 'bg-orange-900/20 border-orange-500' : 'bg-orange-50 border-orange-400')
            }`}>
              <div className={`text-sm font-medium mb-1 ${balance >= 0 ? 'text-blue-600/80' : 'text-orange-600/80'}`}>
                {balance >= 0 ? '盈餘' : '赤字'}
              </div>
              <div className={`text-2xl md:text-3xl font-bold font-mono ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {balance < 0 && '-'}
                {formatCurrency(Math.abs(balance))} <span className="text-base font-normal">元</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 text-center text-slate-400 text-sm">
        <p>提示：金額欄位支援算式輸入 (例: 1000+500)，按 Enter 自動計算。</p>
      </div>
    </div>
  );
};

export default App;
