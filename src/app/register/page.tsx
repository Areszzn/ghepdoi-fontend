'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await register({
        username: formData.username,
        password: formData.password,
        displayName: formData.displayName || undefined,
      });
      router.push('/deposit');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => window.history.back()}
          className="text-white p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div className="mb-12">
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">DW</span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-white text-lg font-semibold">NGỌC NU</h1>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-white text-2xl font-bold text-center">
          Đăng Ký
        </h2>
      </div>

      <div className="w-full space-y-6">
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3">
              <div className="text-sm text-red-300">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-4 bg-white rounded-full border-0 placeholder-gray-400 text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                id="displayName"
                name="displayName"
                type="text"
                className="w-full px-4 py-4 bg-white rounded-full border-0 placeholder-gray-400 text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tên hiển thị (tùy chọn)"
                value={formData.displayName}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-4 bg-white rounded-full border-0 placeholder-gray-400 text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-4 bg-white rounded-full border-0 placeholder-gray-400 text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-white text-sm hover:text-purple-300 transition-colors"
            >
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-full hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang tạo tài khoản...
                </div>
              ) : (
                'Tạo tài khoản'
              )}
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex justify-between items-center mt-8 text-sm">
            <Link
              href="/login"
              className="text-white hover:text-purple-300 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/support"
              className="text-white hover:text-purple-300 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Liên hệ CSKH
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
