'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { bankAccountAPI, transactionAPI } from '@/lib/api';
import { ArrowUpFromLine, CreditCard } from 'lucide-react';

interface BankAccount {
  id: number;
  tentaikhoan: string;
  sotaikhoan: number;
  tennganhang: string;
  created_at: string;
  updated_at: string;
}

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
}

export default function WithdrawModal({ isOpen, onClose, userBalance }: WithdrawModalProps) {
  const [step, setStep] = useState<'check' | 'bank-info' | 'amount'>('check');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  
  const [bankForm, setBankForm] = useState({
    tentaikhoan: '',
    sotaikhoan: '',
    tennganhang: ''
  });

  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      // Reset to check step when modal opens
      setStep('check');
      setError('');
      setSuccess('');
      setBankAccount(null);
      setLoading(false);

      // Then check bank account
      checkBankAccount();
    }
  }, [isOpen]);

  const checkBankAccount = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bankAccountAPI.getAll();
      const accounts = response.data.data;

      if (accounts && accounts.length > 0) {
        setBankAccount(accounts[0]);
        setStep('amount');
      } else {
        setBankAccount(null);
        setStep('bank-info');
      }
    } catch (error) {
      console.error('Error checking bank account:', error);
      setBankAccount(null);
      setStep('bank-info');
    } finally {
      setLoading(false);
    }
  };

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await bankAccountAPI.create({
        tentaikhoan: bankForm.tentaikhoan,
        sotaikhoan: parseInt(bankForm.sotaikhoan),
        tennganhang: bankForm.tennganhang
      });
      
      setBankAccount(response.data.account);
      setStep('amount');
      setSuccess('Thông tin ngân hàng đã được lưu!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Không thể lưu thông tin ngân hàng';
      setError(errorMessage || 'Không thể lưu thông tin ngân hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const amount = parseFloat(withdrawForm.amount);
    
    if (amount <= 0) {
      setError('Số tiền phải lớn hơn 0');
      setLoading(false);
      return;
    }

    if (amount > userBalance) {
      setError('Số dư không đủ');
      setLoading(false);
      return;
    }

    try {
      await transactionAPI.createWithdrawal({
        amount,
        bankAccountId: bankAccount!.id,
        description: withdrawForm.description || undefined
      });

      setSuccess('Lệnh rút tiền đã được tạo! Số tiền đã được trừ khỏi tài khoản và đang chờ xét duyệt.');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error: unknown) {
      let errorMessage = 'Không thể tạo lệnh rút tiền';

      if (error instanceof Error && 'response' in error) {
        const apiError = (error as { response?: { data?: { error?: string } } }).response?.data?.error;
        if (apiError === 'Insufficient balance') {
          errorMessage = 'Số dư không đủ để thực hiện giao dịch';
        } else if (apiError) {
          errorMessage = apiError;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBankForm({ tentaikhoan: '', sotaikhoan: '', tennganhang: '' });
    setWithdrawForm({ amount: '', description: '' });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBack = () => {
    if (step === 'amount' && !bankAccount) {
      setStep('bank-info');
    }
  };

  const setMaxAmount = () => {
    setWithdrawForm({ ...withdrawForm, amount: userBalance.toString() });
  };

  const getTitle = () => {
    switch (step) {
      case 'bank-info':
        return 'Thông tin ngân hàng';
      case 'amount':
        return 'Rút tiền';
      default:
        return 'Rút tiền';
    }
  };

  const renderContent = () => {
    if (loading && step === 'check') {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang kiểm tra thông tin...</p>
        </div>
      );
    }

    if (step === 'bank-info') {
      return (
        <form onSubmit={handleBankSubmit} className="space-y-4">
          <div className="text-center mb-6">
            <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-2" />
            <p className="text-gray-600">Vui lòng nhập thông tin ngân hàng để rút tiền</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên chủ tài khoản
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={bankForm.tentaikhoan}
              onChange={(e) => setBankForm({ ...bankForm, tentaikhoan: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tài khoản
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={bankForm.sotaikhoan}
              onChange={(e) => setBankForm({ ...bankForm, sotaikhoan: e.target.value })}
              placeholder="1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên ngân hàng
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={bankForm.tennganhang}
              onChange={(e) => setBankForm({ ...bankForm, tennganhang: e.target.value })}
              placeholder="Vietcombank"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang lưu...' : 'Tiếp theo'}
          </button>
        </form>
      );
    }

    if (step === 'amount') {
      return (
        <form onSubmit={handleWithdrawSubmit} className="space-y-4">
          <div className="text-center mb-6">
            <ArrowUpFromLine className="h-12 w-12 text-purple-600 mx-auto mb-2" />
            <p className="text-gray-600">Số dư hiện tại: <span className="font-semibold text-purple-600">{userBalance.toLocaleString()} VND</span></p>
          </div>

          {bankAccount && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Thông tin ngân hàng</h4>
              <p className="text-sm text-gray-600">
                {bankAccount.tentaikhoan} - {bankAccount.tennganhang}
              </p>
              <p className="text-sm text-gray-600">
                {bankAccount.sotaikhoan.toString().slice(-4)}**********
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền rút
            </label>
            <div className="relative">
              <input
                type="number"
                required
                className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-300"
                value={withdrawForm.amount}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                placeholder="0"
              />
              <button
                type="button"
                onClick={setMaxAmount}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
              >
                Toàn bộ
              </button>
            </div>
          </div>

          {/* Warning message */}
          {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Số tiền sẽ được trừ ngay khỏi tài khoản khi tạo lệnh rút tiền.
                  Bạn có thể hủy giao dịch để hoàn tiền nếu chưa được xử lý.
                </p>
              </div>
            </div>
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang xử lý...' : 'Rút ngay'}
          </button>
        </form>
      );
    }

    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getTitle()}
      showBackButton={step === 'amount' && !bankAccount}
      onBack={handleBack}
    >{renderContent()}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      
    </Modal>
  );
}
