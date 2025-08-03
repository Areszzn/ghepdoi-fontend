'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { bankAccountAPI, transactionAPI } from '@/lib/api';
import { ArrowDownToLine, CreditCard, DollarSign, AlertCircle } from 'lucide-react';

interface BankAccount {
  id: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  account_type: string;
  is_primary: boolean;
  is_verified: boolean;
}

export default function DepositPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    bankAccountId: '',
    description: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await bankAccountAPI.getAll();
      const accountsData = response.data.accounts;
      setAccounts(accountsData);
      
      // Auto-select primary account if available
      const primaryAccount = accountsData.find((acc: BankAccount) => acc.is_primary);
      if (primaryAccount) {
        setFormData(prev => ({ ...prev, bankAccountId: primaryAccount.id.toString() }));
      }
    } catch (error) {
      setError('Failed to fetch bank accounts');
      console.error('Error fetching bank accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      setSubmitting(false);
      return;
    }

    if (amount > 10000) {
      setError('Maximum deposit amount is $10,000');
      setSubmitting(false);
      return;
    }

    try {
      await transactionAPI.createDeposit({
        amount,
        bankAccountId: parseInt(formData.bankAccountId),
        description: formData.description || undefined,
      });

      setSuccess('Deposit request submitted successfully!');
      setFormData({
        amount: '',
        bankAccountId: formData.bankAccountId, // Keep selected account
        description: '',
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Failed to create deposit';
      setError(errorMessage || 'Failed to submit deposit request');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <ArrowDownToLine className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="mt-3 text-2xl font-bold text-gray-900">Nạp Tiền</h1>
            <p className="mt-1 text-sm text-gray-500">
              Thêm tiền vào tài khoản từ ngân hàng liên kết
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          {accounts.length === 0 ? (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bank accounts</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You need to add a bank account before making a deposit.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/bank-accounts')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Bank Account
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Deposit Amount
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="amount"
                        step="0.01"
                        min="0.01"
                        max="10000"
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">USD</span>
                      </div>
                    </div>
                    {formData.amount && (
                      <p className="mt-1 text-sm text-gray-500">
                        Amount: {formatCurrency(formData.amount)}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum: $0.01 • Maximum: $10,000.00
                    </p>
                  </div>

                  {/* Bank Account Selection */}
                  <div>
                    <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">
                      Deposit From
                    </label>
                    <select
                      id="bankAccount"
                      className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.bankAccountId}
                      onChange={(e) => setFormData({ ...formData, bankAccountId: e.target.value })}
                      required
                    >
                      <option value="">Select a bank account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.account_name} - {account.bank_name} ({maskAccountNumber(account.account_number)})
                          {account.is_primary ? ' • Primary' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Account Details */}
                  {formData.bankAccountId && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      {(() => {
                        const selectedAccount = accounts.find(acc => acc.id.toString() === formData.bankAccountId);
                        if (!selectedAccount) return null;
                        
                        return (
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {selectedAccount.account_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {selectedAccount.bank_name} • {selectedAccount.account_type}
                              </p>
                              <p className="text-xs text-gray-400">
                                {maskAccountNumber(selectedAccount.account_number)}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  selectedAccount.is_verified
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {selectedAccount.is_verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Add a note about this deposit..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard')}
                      className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !formData.amount || !formData.bankAccountId}
                      className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowDownToLine className="h-4 w-4 mr-2" />
                          Submit Deposit
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Deposit Information
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Deposits are typically processed within 1-3 business days</li>
                          <li>You will receive an email confirmation once processed</li>
                          <li>Maximum daily deposit limit is $10,000</li>
                          <li>Funds will be available once the deposit is completed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
