import { useState } from 'react';
import { Header } from '@/widgets/header';
import { WeatherDashboard } from '@/widgets/weather-dashboard';
import { FavoriteGrid } from '@/widgets/favorite-grid';
import { useCurrentLocation } from '@/entities/location/model/use-current-location';
import { cn, getBackgroundColor } from '@/shared/lib';
import type { IDistrict, TWeatherCondition } from '@/shared/types';

interface IHomePageProps {
  selectedLocation: IDistrict | null;
  onLocationSelect: (district: IDistrict) => void;
  onHome: () => void;
}

/**
 * 홈 페이지 컴포넌트
 */
export const HomePage = ({
  selectedLocation,
  onLocationSelect,
  onHome,
}: IHomePageProps) => {
  const {
    location: currentLocation,
    error: geoError,
    isLoading: isGeoLoading,
  } = useCurrentLocation();

  const displayLocation = selectedLocation || currentLocation;
  const [weatherCondition, setWeatherCondition] = useState<TWeatherCondition>('clear');

  return (
    <div className={cn('min-h-screen transition-colors duration-700', getBackgroundColor(weatherCondition))}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <Header onLocationSelect={onLocationSelect} onHome={onHome} />

        {geoError && !displayLocation && (
          <div className="mb-4 p-4 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-2xl text-sm text-yellow-800">
            {geoError}. 기본 위치(서울) 날씨를 표시합니다.
          </div>
        )}

        <div className="mt-6">
          {selectedLocation && (
            <button
              onClick={onHome}
              className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors mb-4 flex items-center gap-1"
            >
              <span>&larr;</span> 현재 위치로 돌아가기
            </button>
          )}

          <WeatherDashboard
            key={displayLocation?.id}
            location={displayLocation}
            isSearching={isGeoLoading && !displayLocation}
            onWeatherConditionChange={(condition) => setWeatherCondition(condition as TWeatherCondition)}
          />

          {/* 데스크탑에서만 보이는 즐겨찾기 섹션 */}
          <div className="hidden lg:block mt-12">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                즐겨찾기
              </h2>
            </div>
            <FavoriteGrid onLocationSelect={onLocationSelect} />
          </div>
        </div>
      </div>
    </div>
  );
};
