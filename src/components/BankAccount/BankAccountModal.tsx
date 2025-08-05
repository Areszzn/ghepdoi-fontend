'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { bankAccountAPI } from '@/lib/api';
import { CreditCard, Plus, Eye, EyeOff } from 'lucide-react';

interface BankAccount {
  id: number;
  tentaikhoan: string;
  sotaikhoan: number;
  tennganhang: string;
  created_at: string;
  updated_at: string;
}

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BankAccountModal({ isOpen, onClose }: BankAccountModalProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [visibleAccounts, setVisibleAccounts] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      fetchBankAccounts();
    }
  }, [isOpen]);

  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bankAccountAPI.getAll();
      setAccounts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setError('Không thể tải thông tin ngân hàng');
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async (accountId: number) => {
  //   if (!confirm('Bạn có chắc chắn muốn xóa tài khoản ngân hàng này?')) {
  //     return;
  //   }

  //   try {
  //     await bankAccountAPI.delete(accountId);
  //     setSuccess('Đã xóa tài khoản ngân hàng');
  //     fetchBankAccounts();
  //     setTimeout(() => setSuccess(''), 3000);
  //   } catch (error: unknown) {
  //     const errorMessage = error instanceof Error && 'response' in error
  //       ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
  //       : 'Không thể xóa tài khoản ngân hàng';
  //     setError(errorMessage || 'Không thể xóa tài khoản ngân hàng');
  //   }
  // };

  const toggleAccountVisibility = (accountId: number) => {
    setVisibleAccounts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber || accountNumber.length <= 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  const displayAccountNumber = (account: BankAccount) => {
    return visibleAccounts.has(account.id)
      ? account.sotaikhoan.toString()
      : maskAccountNumber(account.sotaikhoan.toString());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thông tin ngân hàng"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải thông tin...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài khoản ngân hàng</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {account.tentaikhoan}
                      </h4>
                    </div>

                    <p className="text-sm text-gray-600 mb-1">
                      {account.tennganhang}
                    </p>

                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-sm text-gray-600">
                        {displayAccountNumber(account)}
                      </p>
                      <button
                        onClick={() => toggleAccountVisibility(account.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title={visibleAccounts.has(account.id) ? "Ẩn số tài khoản" : "Hiện số tài khoản"}
                      >
                        {visibleAccounts.has(account.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">
                      Thêm ngày: {formatDate(account.created_at)}
                    </p>
                  </div>
                </div>
                
                {/* <button
                  onClick={() => handleDelete(account.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Xóa tài khoản"
                >
                  <Trash2 className="h-4 w-4" />
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
