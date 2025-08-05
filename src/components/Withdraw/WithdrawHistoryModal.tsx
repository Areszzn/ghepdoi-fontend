'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { transactionAPI } from '@/lib/api';
import { ArrowUpFromLine, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';

interface Transaction {
  id: number;
  type: 'withdrawal';
  amount: number;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  bank_account?: {
    account_name: string;
    bank_name: string;
    account_number: string;
  };
}

interface WithdrawHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawHistoryModal({ isOpen, onClose }: WithdrawHistoryModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchWithdrawHistory();
    }
  }, [isOpen]);

  const fetchWithdrawHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await transactionAPI.getAll({
        type: 'withdrawal',
        limit: 50
      });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching withdraw history:', error);
      setError('Không thể tải lịch sử rút tiền');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTransaction = async (transactionId: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy giao dịch này? Số tiền sẽ được hoàn lại vào tài khoản.')) {
      return;
    }

    try {
      setCancelling(transactionId);
      await transactionAPI.cancel(transactionId);

      // Refresh the list
      await fetchWithdrawHistory();

      // Call onClose to trigger refresh in parent component
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      setError('Không thể hủy giao dịch');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xét duyệt';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };




  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber || accountNumber.length <= 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lịch sử rút tiền"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải lịch sử...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <ArrowUpFromLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lệnh rút tiền</h3>
          <p className="text-gray-500">Lịch sử rút tiền của bạn sẽ hiển thị ở đây</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 w-full">
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        <p className='mr-2'>{getStatusIcon(transaction.status)} </p>{getStatusText(transaction.status)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-600">
                          Số tiền: {formatCurrencyVND(transaction.amount)}
                        </p>
                        {['pending', 'processing'].includes(transaction.status.toLowerCase()) && (
                          <button
                            onClick={() => handleCancelTransaction(transaction.id)}
                            disabled={cancelling === transaction.id}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                            title="Hủy giao dịch"
                          >
                            Huỷ
                          </button>
                        )}
                      </div>
                    </div>

                    {transaction.bank_account && (
                      <div className="text-sm text-gray-600 mb-2">
                        <p>{transaction.bank_account.account_name}</p>
                        <p>{transaction.bank_account.bank_name} - {maskAccountNumber(transaction.bank_account.account_number)}</p>
                      </div>
                    )}

                    {transaction.status.toLowerCase() !== 'pending' && transaction.description && (
                      <div className="text-sm text-gray-400 mb-2 mt-2">
                        <p><span className="font-medium">Nội dung:</span> {transaction.description}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-900 space-y-1">
                      <div>Thời gian tạo: {formatDate(transaction.created_at)}</div>
                      {transaction.status.toLowerCase() !== 'pending' && transaction.completed_at && (
                        <div>Thời gian duyệt: {formatDate(transaction.completed_at)}</div>
                      )}
                    </div>
                  </div>
                </div>
                                      
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
