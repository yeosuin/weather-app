import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IFavoriteLocation } from '@/shared/types';
import { useFavoriteStore } from '@/features/toggle-favorite';

interface IEditAliasModalProps {
  favorite: IFavoriteLocation | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 별칭 수정 모달 컴포넌트
 */
export const EditAliasModal = ({
  favorite,
  isOpen,
  onClose,
}: IEditAliasModalProps) => {
  const { updateAlias } = useFavoriteStore();
  const [alias, setAlias] = useState(favorite?.alias || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && favorite) {
      setAlias(favorite.alias || '');
      setError(null);
    }
  }, [isOpen, favorite]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (favorite) {
      const trimmed = alias.trim();
      if (!trimmed) {
        setError('빈칸은 사용하실 수 없습니다.');
        return;
      }
      updateAlias(favorite.id, trimmed);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && favorite && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full md:w-96 bg-white rounded-t-bento md:rounded-bento p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">별칭 수정</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {favorite.district.fullName}
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={alias}
                onChange={(e) => {
                  setAlias(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="별칭을 입력하세요 (예: 집, 회사)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                >
                  저장
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
