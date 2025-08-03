'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showBackButton = false, 
  onBack 
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal panel - full height within 640px constraint */}
      <div className="relative w-full max-w-xl h-full bg-white flex flex-col">
        {/* Header */}
        <div className="relative flex items-center justify-center p-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500">
          {/* Close button (arrow) - positioned absolutely to the left */}
          <button
            onClick={onClose}
            className="absolute left-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Back button - positioned absolutely to the left (if needed) */}
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="absolute left-16 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          {/* Title - centered */}
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        {/* Content - full height */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
