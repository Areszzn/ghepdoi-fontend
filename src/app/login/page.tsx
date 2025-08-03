'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();
  const { settings, loading: settingsLoading } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      router.push('/profile');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto relative"
      style={{
        backgroundImage: settings.bg_login ? `url(${settings.bg_login})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: settings.bg_login ? 'transparent' : 'black'
      }}
    >
      {/* Overlay for better text readability */}
      {settings.bg_login && (
        <div className="absolute inset-0 bg-opacity-50"></div>
      )}
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
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
      <div className="mb-12 relative z-10">
        <div className="w-24 h-24 mx-auto mb-4 relative">
          {settings.logo_app ? (
            <img
              src={settings.logo_app}
              alt="App Logo"
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                // Fallback to default gradient if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full rounded-full flex items-center justify-center ${settings.logo_app ? 'hidden' : ''}`}>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-white text-lg font-semibold drop-shadow-lg">
            {settings.name_app}
          </h1>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8 relative z-10">
        <h2 className="text-white text-2xl font-bold text-center drop-shadow-lg">
          Đăng Nhập
        </h2>
      </div>

      <div className="w-full space-y-6 relative z-10">
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
                autoComplete="username"
                required
                className="w-full px-4 py-4 bg-white rounded-full border-0 placeholder-gray-400 text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full px-4 py-4 bg-white rounded-full border-0 placeholder-gray-400 text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              href="/register"
              className="text-white text-sm hover:text-purple-300 transition-colors"
            >
              Đăng ký tài khoản
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
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex justify-between items-center mt-8 text-sm">
            <Link
              href="/register"
              className="text-white hover:text-purple-300 transition-colors"
            >
              Đăng ký ngay
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
