import { useState } from 'react';
import { Pencil, Trash2, Star, MapPinOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeatherCard } from '@/entities/weather';
import { EditAliasModal } from '@/features/edit-alias';
import { useFavoriteStore } from '@/features/toggle-favorite';
import { useKoreaWeather } from '@/features/weather/api/useKoreaWeather';
import { WeatherCardSkeleton, BentoCard } from '@/shared/ui';
import type { IFavoriteLocation, IDistrict } from '@/shared/types';

interface IFavoriteGridProps {
  onLocationSelect: (district: IDistrict) => void;
}

/**
 * 즐겨찾기 그리드 위젯
 */
export const FavoriteGrid = ({ onLocationSelect }: IFavoriteGridProps) => {
  const { favorites, removeFavorite } = useFavoriteStore();
  const [editTarget, setEditTarget] = useState<IFavoriteLocation | null>(null);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 min-h-[50vh]">
        <div className="bg-white p-8 rounded-full shadow-sm mb-4">
          <Star className="w-12 h-12 text-gray-300" />
        </div>
        <p className="text-lg font-medium">즐겨찾기가 없습니다</p>
        <p className="text-sm mt-2">검색하여 도시를 추가해보세요</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {favorites.map((favorite) => (
            <FavoriteItem
              key={favorite.id}
              favorite={favorite}
              onSelect={() => onLocationSelect(favorite.district)}
              onEdit={() => setEditTarget(favorite)}
              onDelete={() => removeFavorite(favorite.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <EditAliasModal
        favorite={editTarget}
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
};

interface IFavoriteItemProps {
  favorite: IFavoriteLocation;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const FavoriteItem = ({
  favorite,
  onSelect,
  onEdit,
  onDelete,
}: IFavoriteItemProps) => {
  const {
    data: weatherData,
    isLoading,
    error,
  } = useKoreaWeather(favorite.district.coordinates);

  if (isLoading) {
    return <WeatherCardSkeleton />;
  }

  if (error || !weatherData?.current) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <BentoCard className="relative">
          <div className="text-center py-4">
            <MapPinOff className="mx-auto text-gray-300 mb-2" size={24} />
            <p className="text-xs text-gray-400 font-medium">
              {favorite.alias || favorite.district.district}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {error ? '날씨 정보를 가져오지 못했습니다.' : '해당 장소의 정보가 제공되지 않습니다.'}
            </p>
          </div>
          <button
            onClick={onDelete}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-red-100 transition-colors"
            title="삭제"
          >
            <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
          </button>
        </BentoCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <WeatherCard
        weather={weatherData.current}
        location={favorite.district}
        alias={favorite.alias}
        variant="compact"
        onClick={onSelect}
        actions={
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 rounded-full bg-white/50 hover:bg-white transition-colors"
              title="별칭 수정"
            >
              <Pencil size={14} className="text-gray-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-full bg-white/50 hover:bg-red-100 transition-colors"
              title="삭제"
            >
              <Trash2 size={14} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
        }
      />
    </motion.div>
  );
};
