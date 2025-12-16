import React from 'react';
import { BudgetItem } from '../types';
import { formatCurrency } from '../utils/mathUtils';

interface PDFPreviewProps {
  month: string;
  incomeItems: BudgetItem[];
  expenseItems: BudgetItem[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  month,
  incomeItems,
  expenseItems,
  totalIncome,
  totalExpense,
  balance,
}) => {
  return (
    <div 
      id="pdf-preview" 
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        color: '#000000',
        boxSizing: 'border-box',
      }}
    >
      {/* Title */}
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#000000',
      }}>
        {month}月預算規劃
      </div>

      {/* Income and Expense Tables - Side by Side */}
      <div style={{ 
        display: 'flex', 
        gap: '15mm', 
        marginBottom: '20px',
        alignItems: 'flex-start'
      }}>
        {/* Income Table - Left */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#059669', // Green color for income
          }}>
            收入
          </div>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #d1d5db',
          }}>
            <thead>
              <tr>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                }}>項目</th>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                }}>金額</th>
              </tr>
            </thead>
            <tbody>
              {incomeItems.map((item) => (
                <tr key={item.id}>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px',
                    fontSize: '12px',
                  }}>{item.name || '(未命名)'}</td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px',
                    textAlign: 'right',
                    fontSize: '12px',
                  }}>{item.amount === 0 ? '0' : formatCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold' }}>
                <td style={{
                  border: '1px solid #d1d5db',
                  padding: '6px',
                  fontSize: '12px',
                }}>總收入</td>
                <td style={{
                  border: '1px solid #d1d5db',
                  padding: '6px',
                  textAlign: 'right',
                  fontSize: '12px',
                  color: '#059669', // Green color for total income
                }}>{formatCurrency(totalIncome)} 元</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expense Table - Right */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#dc2626', // Red color for expense
          }}>
            支出
          </div>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #d1d5db',
          }}>
            <thead>
              <tr>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                }}>項目</th>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: '#f3f4f6',
                }}>金額</th>
              </tr>
            </thead>
            <tbody>
              {expenseItems.map((item) => (
                <tr key={item.id}>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px',
                    fontSize: '12px',
                  }}>{item.name || '(未命名)'}</td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px',
                    textAlign: 'right',
                    fontSize: '12px',
                  }}>{item.amount === 0 ? '0' : formatCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold' }}>
                <td style={{
                  border: '1px solid #d1d5db',
                  padding: '6px',
                  fontSize: '12px',
                }}>總支出</td>
                <td style={{
                  border: '1px solid #d1d5db',
                  padding: '6px',
                  textAlign: 'right',
                  fontSize: '12px',
                  color: '#dc2626', // Red color for total expense
                }}>{formatCurrency(totalExpense)} 元</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary - Three Colored Boxes */}
      <div style={{ marginTop: '20px' }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: '#000000',
        }}>
          每月結算
        </div>
        <div style={{
          display: 'flex',
          gap: '10px',
        }}>
          {/* Total Income Box - Light Green */}
          <div style={{
            flex: 1,
            backgroundColor: '#ecfdf5', // Light green background
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            padding: '15px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#059669',
            }}>
              總收入
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#059669',
            }}>
              {formatCurrency(totalIncome)} 元
            </div>
          </div>

          {/* Total Expense Box - Light Red */}
          <div style={{
            flex: 1,
            backgroundColor: '#fef2f2', // Light red background
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            padding: '15px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#dc2626',
            }}>
              總支出
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#dc2626',
            }}>
              {formatCurrency(totalExpense)} 元
            </div>
          </div>

          {/* Balance Box - Light Blue */}
          <div style={{
            flex: 1,
            backgroundColor: balance >= 0 ? '#dbeafe' : '#fff7ed', // Light blue or light orange
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            padding: '15px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: balance >= 0 ? '#2563eb' : '#ea580c',
            }}>
              {balance >= 0 ? '盈餘' : '赤字'}
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: balance >= 0 ? '#2563eb' : '#ea580c',
            }}>
              {balance < 0 && '-'}
              {formatCurrency(Math.abs(balance))} 元
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

