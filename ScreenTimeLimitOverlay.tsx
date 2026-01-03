'use client';

import { Clock, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface ScreenTimeLimitOverlayProps {
  onParentAccess: () => void;
}

export default function ScreenTimeLimitOverlay({ onParentAccess }: ScreenTimeLimitOverlayProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] p-8 max-w-md w-full text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={48} className="text-white" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          {t.screenTimeExpired.title}
        </h2>

        <p className="text-gray-600 text-lg mb-2">
          {t.screenTimeExpired.message}
        </p>

        <p className="text-gray-500 mb-8">
          {t.screenTimeExpired.askParent}
        </p>

        <button
          onClick={onParentAccess}
          className="w-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white py-4 rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <Lock size={20} />
          {t.parents.title}
        </button>
      </div>
    </div>
  );
}
