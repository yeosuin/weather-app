import React, { useMemo } from 'react';
import { MapPinOff } from 'lucide-react';
import {
  WeatherCard,
  HourlyForecast,
  WeatherDetails,
  AirQualityCard,
} from '@/entities/weather';
import { FavoriteButton } from '@/features/toggle-favorite';
import { useKoreaWeather } from '@/features/weather/api/useKoreaWeather';
import { useAirQuality } from '@/features/air-quality';
import { toSidoName } from '@/shared/lib';
import {
  WeatherCardSkeleton,
  HourlyForecastSkeleton,
  BentoCard,
} from '@/shared/ui';
import type { IDistrict } from '@/shared/types';

interface IWeatherDashboardProps {
  location: IDistrict | null;
  isSearching: boolean;
  onWeatherConditionChange?: (condition: string) => void;
}

/**
 * 메인 날씨 대시보드 위젯
 */
export const WeatherDashboard = ({
  location,
  isSearching,
  onWeatherConditionChange,
}: IWeatherDashboardProps) => {
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useKoreaWeather(location?.coordinates ?? null);

  // 시도명 변환: province 또는 city에서 추출
  const sidoName = useMemo(() => {
    if (!location) return null;
    return toSidoName(location.province ?? location.city);
  }, [location?.province, location?.city]);

  const { data: airQualityData } = useAirQuality(sidoName);

  // 사용자 위치(구/동/시)와 가장 가까운 측정소 우선 선택
  const airQuality = useMemo(() => {
    if (!airQualityData || airQualityData.length === 0) return null;

    const validItems = airQualityData.filter(
      (item) => item.pm10Value !== null || item.pm25Value !== null,
    );
    if (validItems.length === 0) return null;

    if (!location) return validItems[0];

    // 동/구/시 순서로 측정소명 매칭 시도
    const keywords = [
      location.neighborhood,
      location.district,
      location.city,
    ].filter(Boolean) as string[];

    for (const keyword of keywords) {
      const matched = validItems.find(
        (item) => item.stationName.includes(keyword)
          || keyword.includes(item.stationName),
      );
      if (matched) return matched;
    }

    return validItems[0];
  }, [airQualityData, location]);

  const isLoading = isSearching || isWeatherLoading;

  // 날씨 상태가 변경되면 상위 컴포넌트에 알림
  React.useEffect(() => {
    if (weatherData?.current && onWeatherConditionChange) {
      onWeatherConditionChange(weatherData.current.condition);
    }
  }, [weatherData?.current?.condition, onWeatherConditionChange]);

  if (!location) {
    return (
      <>
        <WeatherCardSkeleton />
        <HourlyForecastSkeleton />
      </>
    );
  }

  if (weatherError) {
    return (
      <BentoCard className="text-center py-12">
        <MapPinOff className="mx-auto text-gray-300 mb-3" size={48} />
        <p className="text-gray-500 font-medium">
          날씨 정보를 가져오는 데 실패했습니다.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {weatherError.message}
        </p>
      </BentoCard>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
      {/* 왼쪽: 메인 날씨 카드 */}
      <div className="lg:col-span-4 lg:sticky lg:top-8">
        {isLoading ? (
          <WeatherCardSkeleton />
        ) : weatherData?.current ? (
          <WeatherCard
            weather={weatherData.current}
            location={location}
            variant="hero"
            actions={<FavoriteButton district={location} />}
          />
        ) : (
          <BentoCard className="text-center py-12">
            <MapPinOff className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 font-medium">
              해당 장소의 날씨 정보가 제공되지 않습니다.
            </p>
          </BentoCard>
        )}
      </div>

      {/* 오른쪽: 상세 정보 및 시간별 예보 */}
      <div className="lg:col-span-6 space-y-8">
        {!isLoading && weatherData?.current && (
          <div className="space-y-4">
            <WeatherDetails weather={weatherData.current} />
            {airQuality && <AirQualityCard data={airQuality} />}
          </div>
        )}

        {isLoading ? (
          <HourlyForecastSkeleton />
        ) : weatherData?.hourly && weatherData.hourly.length > 0 ? (
          <HourlyForecast forecasts={weatherData.hourly} />
        ) : null}
      </div>
    </div>
  );
};
