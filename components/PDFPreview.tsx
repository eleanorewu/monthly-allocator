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
        padding: '15mm',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        color: '#000000',
        boxSizing: 'border-box',
      }}
    >
      {/* Title */}
      <h1 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '12px',
        marginTop: '0',
        color: '#000000',
      }}>
        {month}月預算規劃
      </h1>

      {/* Income and Expense Tables */}
      <div style={{ display: 'flex', gap: '8mm', marginBottom: '12px' }}>
        {/* Income Table */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '6px',
            color: '#059669',
            borderBottom: '2px solid #059669',
            paddingBottom: '3px',
          }}>
            收入
          </h2>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '0',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '5px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '10px',
                }}>項目</th>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '5px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '10px',
                }}>金額</th>
              </tr>
            </thead>
            <tbody>
              {incomeItems.map((item, index) => (
                <tr key={item.id} style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                }}>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '5px',
                    fontSize: '10px',
                  }}>{item.name || '(未命名)'}</td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '5px',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                  }}>{formatCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#ecfdf5', fontWeight: 'bold' }}>
                <td style={{
                  border: '1px solid #d1d5db',
                  padding: '5px',
                  fontSize: '10px',
                }}>總收入</td>
                <td style={{
                  border: '1px solid #d1d5db',
                  padding: '5px',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  color: '#059669',
                }}>{formatCurrency(totalIncome)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expense Table */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '6px',
            color: '#dc2626',
            borderBottom: '2px solid #dc2626',
            paddingBottom: '3px',
          }}>
            支出
          </h2>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '0',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '5px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '10px',
                }}>項目</th>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '5px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '10px',
                }}>金額</th>
              </tr>
            </thead>
            <tbody>
              {expenseItems.map((item, index) => (
                <tr key={item.id} style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                }}>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '5px',
                    fontSize: '10px',
                  }}>{item.name || '(未命名)'}</td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '5px',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                  }}>{formatCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#fef2f2', fontWeight: 'bold' }}>
                <td style={{
                  border: '1px solid #d1d5db',
                  padding: '5px',
                  fontSize: '10px',
                }}>總支出</td>
                <td style={{
                  border: '1px solid #d1d5db',
                  padding: '5px',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  color: '#dc2626',
                }}>{formatCurrency(totalExpense)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div style={{
        marginTop: '12px',
        border: '2px solid #1e293b',
        borderRadius: '4px',
        padding: '10px',
        backgroundColor: '#f8fafc',
      }}>
        <h3 style={{
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '8px',
          marginTop: '0',
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          每月結算
        </h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}>
          <tbody>
            <tr>
              <td style={{
                padding: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                width: '33%',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ecfdf5',
              }}>總收入</td>
              <td style={{
                padding: '6px',
                fontSize: '12px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                color: '#059669',
                textAlign: 'right',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ecfdf5',
              }}>{formatCurrency(totalIncome)} 元</td>
            </tr>
            <tr>
              <td style={{
                padding: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                width: '33%',
                border: '1px solid #cbd5e1',
                backgroundColor: '#fef2f2',
              }}>總支出</td>
              <td style={{
                padding: '6px',
                fontSize: '12px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                color: '#dc2626',
                textAlign: 'right',
                border: '1px solid #cbd5e1',
                backgroundColor: '#fef2f2',
              }}>{formatCurrency(totalExpense)} 元</td>
            </tr>
            <tr>
              <td style={{
                padding: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                width: '33%',
                border: '1px solid #cbd5e1',
                backgroundColor: balance >= 0 ? '#dbeafe' : '#fff7ed',
              }}>{balance >= 0 ? '盈餘' : '赤字'}</td>
              <td style={{
                padding: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                color: balance >= 0 ? '#2563eb' : '#ea580c',
                textAlign: 'right',
                border: '1px solid #cbd5e1',
                backgroundColor: balance >= 0 ? '#dbeafe' : '#fff7ed',
              }}>
                {balance < 0 && '-'}
                {formatCurrency(Math.abs(balance))} 元
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

