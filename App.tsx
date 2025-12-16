import React, { useState, useMemo, useRef } from 'react';
import { Download, Moon, Sun, Wallet } from 'lucide-react';
import { arrayMove } from '@dnd-kit/sortable';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BudgetItem, ItemType } from './types';
import { generateId, formatCurrency } from './utils/mathUtils';
import { BudgetSection } from './components/BudgetSection';
import { PDFPreview } from './components/PDFPreview';

// Initial Data
const INITIAL_INCOME: BudgetItem[] = [
  { id: 'inc-1', name: '上個月盈餘', amount: 0 },
  { id: 'inc-2', name: '薪資', amount: 0 },
  { id: 'inc-3', name: '加班費', amount: 0 },
  { id: 'inc-4', name: '股息', amount: 0 },
  { id: 'inc-5', name: '獎金', amount: 0 },
  { id: 'inc-6', name: '租屋補助', amount: 0 },
  { id: 'inc-7', name: '中獎', amount: 0 },
];

const INITIAL_EXPENSE: BudgetItem[] = [
  { id: 'exp-1', name: '房租', amount: 0 },
  { id: 'exp-2', name: '生活費', amount: 0 },
  { id: 'exp-3', name: '信用卡費', amount: 0 },
  { id: 'exp-4', name: '交通', amount: 0 },
  { id: 'exp-5', name: '帳單', amount: 0 },
  { id: 'exp-6', name: '保險費', amount: 0 },
  { id: 'exp-7', name: '投資', amount: 0 },
  { id: 'exp-8', name: '貸款', amount: 0 },
  { id: 'exp-9', name: '活存', amount: 0 },
];

const App: React.FC = () => {
  const [month, setMonth] = useState<string>(new Date().getMonth() + 1 + '');
  const [incomeItems, setIncomeItems] = useState<BudgetItem[]>(INITIAL_INCOME);
  const [expenseItems, setExpenseItems] = useState<BudgetItem[]>(INITIAL_EXPENSE);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const pdfPreviewRef = useRef<HTMLDivElement>(null);
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
    if (!pdfPreviewRef.current) return;
    setIsExporting(true);
    
    // Slight delay to ensure UI updates if needed
    await new Promise(r => setTimeout(r, 200));

    try {
      const canvas = await html2canvas(pdfPreviewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        width: pdfPreviewRef.current.scrollWidth,
        height: pdfPreviewRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // A4 dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If content fits in one page, add it directly
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // If content is too tall, scale it to fit one page
        const scale = pageHeight / imgHeight;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * scale, pageHeight);
      }

      pdf.save(`${month}月預算規劃.pdf`);
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
      <header className="max-w-7xl mx-auto mb-8 flex flex-row justify-between items-center gap-2 md:gap-4">
         <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
              <Wallet size={20} className="md:w-7 md:h-7" />
            </div>
            <h1 className="text-base md:text-2xl font-bold tracking-tight truncate">每月預算規劃</h1>
         </div>

         <div className="flex items-center gap-2 md:gap-4 flex-nowrap flex-shrink-0">
            <button 
              onClick={toggleTheme}
              className={`p-1.5 md:p-2 rounded-full transition-colors flex-shrink-0 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-white hover:bg-slate-100 text-slate-500 shadow-sm'}`}
              style={{ minWidth: 32, minHeight: 32 }}
            >
              {isDarkMode ? <Sun size={16} className="md:w-5 md:h-5" /> : <Moon size={16} className="md:w-5 md:h-5" />}
            </button>
         </div>
      </header>

      {/* PDF Preview - Hidden, only used for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden' }}>
        <div ref={pdfPreviewRef}>
          <PDFPreview
            month={month}
            incomeItems={incomeItems}
            expenseItems={expenseItems}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        ref={printRef} 
        className={`max-w-7xl mx-auto space-y-8 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}
      >
        
        {/* Date & Download Bar */}
        <div className={`rounded-xl p-3 md:p-6 shadow-sm flex flex-row justify-between items-center gap-2 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-1.5 md:gap-2 flex-nowrap min-w-0 flex-1">
            <label className={`text-sm md:text-lg font-medium whitespace-nowrap flex-shrink-0 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              月份 :
            </label>
            <div className="relative flex items-center gap-1 md:gap-2 flex-nowrap">
              <input 
                type="number" 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                min="1" max="12"
                className={`w-12 md:w-20 text-center text-sm md:text-xl font-bold py-1 px-1 md:px-2 rounded border focus:ring-2 focus:ring-blue-500 focus:outline-none flex-shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
              />
              <span className="text-xs md:text-lg font-medium text-slate-500 whitespace-nowrap flex-shrink-0">月預算分配</span>
            </div>
          </div>

          {!isExporting && (
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow transition-all hover:shadow-md active:scale-95 whitespace-nowrap text-xs md:text-base flex-shrink-0"
            >
              <Download size={14} className="md:w-4 md:h-4" />
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
            isDarkMode={isDarkMode}
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
            isDarkMode={isDarkMode}
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
        <p>2025/12/16 版本 1.0.0</p>
      </div>
    </div>
  );
};

export default App;
