'use client';

import React from 'react';
import Modal from '../Modal/Modal';
import { Construction, Wrench } from 'lucide-react';

interface DevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  feature: string;
}

export default function DevelopmentModal({ isOpen, onClose, title, feature }: DevelopmentModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="text-center py-8">
       
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chưa có thông tin
        </h3>
      </div>
    </Modal>
  );
}
