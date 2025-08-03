'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home
} from 'lucide-react';



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
      {/* Main content */}
      <div>
        {/* Page content */}
        <main className="flex-1 pb-24">
          <div className="py-4">
            <div className="mx-auto px-4">
              {children}
            </div>
          </div>
        </main>

        {/* Bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-2xl mx-auto safe-area-inset-bottom">
          <div className="flex items-center justify-around px-4 py-2 relative">
            {/* Left Navigation */}
            <Link
              href="/deposit"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                pathname === '/dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">Nạp Tiền</span>
            </Link>
            {/* Center Logo Button */}
            <Link
              href="/profile"
              className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-lg -mt-8 border-4 border-white"
            >
              <div className="text-white font-bold text-xl">Profile</div>
            </Link>

            {/* Right Navigation - Profile */}
            <Link
              href="/withdraw"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                pathname === '/profile' || pathname.startsWith('/bank-accounts') || pathname.startsWith('/deposit') || pathname.startsWith('/withdraw') || pathname.startsWith('/cancel-orders')
                  ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {user?.displayName?.[0] || user?.username?.[0]}
                </span>
              </div>
              <span className="text-xs mt-1 font-medium">Rút Tiền</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
