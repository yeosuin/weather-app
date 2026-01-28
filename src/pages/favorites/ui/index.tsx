import { useState } from 'react';
import { Header } from '@/widgets/header';
import { FavoriteGrid } from '@/widgets/favorite-grid';
import { WeatherDashboard } from '@/widgets/weather-dashboard';
import { cn, getBackgroundColor } from '@/shared/lib';
import type { IDistrict, TWeatherCondition } from '@/shared/types';

interface IFavoritesPageProps {
  selectedLocation: IDistrict | null;
  onLocationSelect: (district: IDistrict) => void;
  onHome: () => void;
}

/**
 * 즐겨찾기 페이지 컴포넌트
 */
export const FavoritesPage = ({
  selectedLocation,
  onLocationSelect,
  onHome,
}: IFavoritesPageProps) => {
  const [weatherCondition, setWeatherCondition] = useState<TWeatherCondition>('clear');

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-700',
      selectedLocation ? getBackgroundColor(weatherCondition) : 'bg-[#F3F6F8]'
    )}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <Header onLocationSelect={onLocationSelect} onHome={onHome} />

        <div className="mt-6">
          {selectedLocation ? (
            <WeatherDashboard
              location={selectedLocation}
              isSearching={false}
              onWeatherConditionChange={(condition) => setWeatherCondition(condition as TWeatherCondition)}
            />
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                  즐겨찾기
                </h2>
              </div>
              <FavoriteGrid onLocationSelect={onLocationSelect} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
