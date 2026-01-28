import { useMemo } from 'react';
import { Wind, Droplets, Shirt, CloudRain } from 'lucide-react';
import type { IWeatherData, TWeatherCondition } from '@/shared/types';

interface IWeatherDetailsProps {
  weather: IWeatherData;
}

interface IDetailItem {
  label: string;
  value: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  isText?: boolean;
}

/**
 * 현재 온도 기반 옷차림 추천 + 우산 추천
 */
const getClothingRecommendation = (
  temperature: number,
  condition: TWeatherCondition,
  precipitationProbability: number
): string => {
  let clothing = '';

  if (temperature >= 28) clothing = '민소매, 반바지';
  else if (temperature >= 23) clothing = '반팔, 면바지';
  else if (temperature >= 20) clothing = '긴팔, 얇은 가디건';
  else if (temperature >= 17) clothing = '니트, 맨투맨';
  else if (temperature >= 12) clothing = '자켓, 가디건';
  else if (temperature >= 9) clothing = '트렌치코트, 야상';
  else if (temperature >= 5) clothing = '코트, 니트';
  else if (temperature >= 0) clothing = '패딩, 목도리';
  else clothing = '롱패딩, 장갑';

  // 비/눈 소식이 있으면 우산 추가
  const needsUmbrella =
    condition === 'rain' ||
    condition === 'storm' ||
    condition === 'snow' ||
    precipitationProbability >= 40;

  if (needsUmbrella) {
    clothing += ', 우산';
  }

  return clothing;
};

/**
 * 날씨 상세 정보 그리드 위젯
 */
export const WeatherDetails = ({ weather }: IWeatherDetailsProps) => {
  const items = useMemo<IDetailItem[]>(() => [
    {
      label: '풍속',
      value: `${weather.windSpeed}`,
      unit: 'm/s',
      icon: Wind,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
    },
    {
      label: '습도',
      value: `${weather.humidity}`,
      unit: '%',
      icon: Droplets,
      color: 'text-sky-500',
      bg: 'bg-sky-100',
    },
    {
      label: '옷차림',
      value: getClothingRecommendation(weather.temperature, weather.condition, weather.precipitationProbability),
      unit: '',
      icon: Shirt,
      color: 'text-purple-500',
      bg: 'bg-purple-100',
      isText: true,
    },
    {
      label: '강수확률',
      value: `${weather.precipitationProbability}`,
      unit: '%',
      icon: CloudRain,
      color: 'text-indigo-500',
      bg: 'bg-indigo-100',
    },
  ], [weather.windSpeed, weather.humidity, weather.temperature, weather.condition, weather.precipitationProbability]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-white/60 backdrop-blur-sm p-5 rounded-3xl flex flex-col justify-between h-32 hover:bg-white transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${item.bg} ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 font-bold tracking-wider">
                {item.label.toUpperCase()}
              </p>
            </div>
            <p className={`font-bold text-gray-800 mt-2 ${item.isText ? 'text-base' : 'text-2xl'}`}>
              {item.value}{' '}
              {item.unit && (
                <span className="text-sm font-normal text-gray-500">
                  {item.unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
