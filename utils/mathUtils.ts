/**
 * Formats a number to currency string (e.g. 1,234)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * Safely evaluates a mathematical expression string.
 * Supports +, -, *, /, (, ).
 * Returns 0 if invalid.
 */
export const safeCalculate = (expression: string): number => {
  if (!expression) return 0;
  
  // Remove all non-math characters (allow numbers, operators, parens, dot)
  const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
  
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${sanitized}`)();
    const num = Number(result);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  } catch (e) {
    return 0;
  }
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
