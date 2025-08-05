/**
 * Format number with dot separator (e.g., 976.666.433)
 * @param amount - The number to format
 * @returns Formatted string with dot separators, no decimal places
 */
export const formatCurrency = (amount: number): string => {
  // Convert to integer to remove decimal places, then format
  const integerAmount = Math.floor(amount);
  return integerAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Format currency with VND suffix
 * @param amount - The number to format
 * @returns Formatted string with dot separators and VND suffix
 */
export const formatCurrencyVND = (amount: number): string => {
  return formatCurrency(amount) + ' VND';
};

/**
 * Format date to Vietnamese format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date with time
 * @param dateString - ISO date string
 * @returns Formatted date string with time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

/**
 * Mask account number for security
 * @param accountNumber - Account number to mask
 * @returns Masked account number
 */
export const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.length <= 4) return accountNumber;
  return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
};
