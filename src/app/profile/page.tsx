'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import { User, Eye, EyeOff, CreditCard, ArrowDownToLine, ArrowUpFromLine, Settings, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await userAPI.updateProfile(profileData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Failed to update profile';
      setError(errorMessage || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Failed to change password';
      setError(errorMessage || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-0">
          {/* Header với gradient background */}
          <div className="gradient-wallet rounded-t-3xl px-6 py-8 text-white relative overflow-hidden shadow-wallet">
            {/* Settings icon */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <Settings className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* User info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-2 border-white border-opacity-30">
                <span className="text-xl font-bold text-white">
                  {user?.displayName?.[0] || user?.username?.[0]}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{user?.username || 'xuandong87'}</h2>
                <div className="flex items-center mt-1">
                  <div className="bg-yellow-400 rounded-full p-1 mr-2">
                    <span className="text-xs font-bold text-purple-800">👑</span>
                  </div>
                  <span className="text-yellow-300 font-semibold">VIP 1</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/deposit"
                className="bg-orange-400 bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-opacity-30 hover:scale-105 transition-all duration-200"
              >
                <ArrowDownToLine className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Nạp tiền</span>
              </Link>
              <Link
                href="/withdraw"
                className="bg-orange-400 bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-opacity-30 hover:scale-105 transition-all duration-200"
              >
                <ArrowUpFromLine className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Rút tiền</span>
              </Link>
            </div>
          </div>

          {/* Wallet section */}
          <div className="bg-white px-6 py-6 -mt-4 rounded-b-3xl shadow-lg">
            <div className="text-center mb-6">
              <p className="text-gray-500 text-sm mb-2">Ví của tôi</p>
              <div className="flex items-center justify-center space-x-4">
                <div>
                  <p className="text-3xl font-bold text-purple-600">0</p>
                  <p className="text-gray-500 text-sm">Số tiền</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">100</p>
                  <p className="text-gray-500 text-sm">Điểm tin nhiệm</p>
                </div>
              </div>
            </div>

            {/* Menu grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-200 active:scale-95 cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700 text-center">Chi tiết tài khoản</span>
              </div>

              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-200 active:scale-95"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700 text-center">Thông tin cá nhân</span>
              </button>

              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-green-50 hover:scale-105 transition-all duration-200 active:scale-95 cursor-pointer">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <ArrowDownToLine className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-700 text-center">Lịch sử rút tiền</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 hover:scale-105 transition-all duration-200 active:scale-95 cursor-pointer">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <ArrowUpFromLine className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700 text-center">Lịch sử nạp tiền</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:scale-105 transition-all duration-200 active:scale-95 cursor-pointer">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                  <Settings className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-sm text-gray-700 text-center">Thông báo</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:scale-105 transition-all duration-200 active:scale-95 cursor-pointer">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-sm text-gray-700 text-center">Chăm sóc khách hàng</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex flex-col items-center p-4 bg-red-50 rounded-xl hover:bg-red-100 hover:scale-105 transition-all duration-200 active:scale-95"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-sm text-red-700 text-center">Đăng xuất</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}



          {/* Profile Settings Form */}
          {showPasswordForm && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Profile Settings
                </h3>

                <form onSubmit={handleProfileSubmit} className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        id="username"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                        value={user?.username || ''}
                        disabled
                      />
                      <User className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                  </div>

                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                      Display Name
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        id="displayName"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                        placeholder="How others will see your name"
                        required
                      />
                      <User className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        'Update Profile'
                      )}
                    </button>
                  </div>
                </form>

                {/* Change Password Section */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          id="currentPassword"
                          className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          id="newPassword"
                          className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          id="confirmPassword"
                          className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          });
                        }}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          'Change Password'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}


        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
