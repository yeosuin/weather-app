import type { TWeatherCondition } from '@/shared/types';

/**
 * 날씨 상태에 따른 배경색 클래스 반환
 * @param condition - 날씨 상태
 * @returns Tailwind CSS 배경색 클래스
 */
export const getBackgroundColor = (condition: TWeatherCondition): string => {
  switch (condition) {
    case 'rain':
    case 'storm':
      return 'bg-slate-700';
    case 'clouds':
    case 'mist':
      return 'bg-slate-400';
    case 'snow':
      return 'bg-blue-200';
    case 'clear':
    default:
      return 'bg-[#D6E4F0]';
  }
};
