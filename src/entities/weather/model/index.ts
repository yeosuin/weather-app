import type { TWeatherCondition } from '@/shared/types';

/**
 * 날씨 조건에 따른 배경 클래스 반환
 */
export const getWeatherBackground = (condition: TWeatherCondition): string => {
  const backgroundMap: Record<TWeatherCondition, string> = {
    clear: 'bg-yellow-50',
    clouds: 'bg-blue-50',
    rain: 'bg-indigo-50',
    storm: 'bg-indigo-100',
    snow: 'bg-slate-50',
    mist: 'bg-gray-100',
  };
  return backgroundMap[condition] || 'bg-gray-50';
};

/**
 * 날씨 조건에 따른 텍스트 클래스 반환
 */
export const getWeatherTextColor = (condition: TWeatherCondition): string => {
  const textColorMap: Record<TWeatherCondition, string> = {
    clear: 'text-yellow-800',
    clouds: 'text-blue-800',
    rain: 'text-indigo-900',
    storm: 'text-indigo-900',
    snow: 'text-slate-800',
    mist: 'text-gray-700',
  };
  return textColorMap[condition] || 'text-gray-900';
};

/**
 * 날씨 조건 한글 설명
 */
export const getWeatherLabel = (condition: TWeatherCondition): string => {
  const labelMap: Record<TWeatherCondition, string> = {
    clear: '맑음',
    clouds: '흐림',
    rain: '비',
    storm: '천둥번개',
    snow: '눈',
    mist: '안개',
  };
  return labelMap[condition] || '알 수 없음';
};
