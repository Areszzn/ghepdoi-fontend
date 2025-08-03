'use client';

import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
      {/* Main content */}
        <main className="flex-1">
          <div className="py-2">
            <div className="mx-auto px-4">
              {children}
            </div>
          </div>
        </main>
    </div>
  );
}
