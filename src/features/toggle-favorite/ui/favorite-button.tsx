import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { IDistrict } from '@/shared/types';
import { cn } from '@/shared/lib';
import { useFavoriteStore } from '../model/store';

interface IFavoriteButtonProps {
  district: IDistrict;
  size?: 'sm' | 'md';
}

/**
 * 즐겨찾기 토글 버튼
 */
export const FavoriteButton = ({ district, size = 'md' }: IFavoriteButtonProps) => {
  const { isFavorite, addFavorite, removeFavorite, favorites } = useFavoriteStore();
  const isActive = isFavorite(district.id);
  const canAdd = favorites.length < 6;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      removeFavorite(district.id);
    } else if (canAdd) {
      addFavorite(district);
    }
  };

  const sizeClasses = size === 'sm' ? 'p-2' : 'p-3';
  const iconSize = size === 'sm' ? 18 : 22;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      disabled={!isActive && !canAdd}
      className={cn(
        sizeClasses,
        'rounded-full transition-all shadow-sm',
        isActive
          ? 'bg-red-50 text-red-500 border border-red-200'
          : canAdd
            ? 'bg-white/80 backdrop-blur-sm text-slate-500 border border-slate-200 hover:text-red-400 hover:border-red-200 hover:bg-red-50'
            : 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
      )}
      title={isActive ? '즐겨찾기 해제' : canAdd ? '즐겨찾기 추가' : '최대 6개까지 추가 가능'}
    >
      <Heart size={iconSize} fill={isActive ? 'currentColor' : 'none'} />
    </motion.button>
  );
};
