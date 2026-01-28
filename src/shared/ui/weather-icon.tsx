import type { TWeatherCondition } from '@/shared/types';

interface IWeatherIconProps {
  condition: TWeatherCondition;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * 날씨 조건에 따른 3D 스타일 이모지 아이콘
 */
export const WeatherIcon = ({
  condition,
  size = 'md',
  className = '',
}: IWeatherIconProps) => {
  const iconMap: Record<TWeatherCondition, string> = {
    clear: '\u2600\uFE0F',
    clouds: '\u2601\uFE0F',
    rain: '\uD83C\uDF27\uFE0F',
    storm: '\u26C8\uFE0F',
    snow: '\u2744\uFE0F',
    mist: '\uD83C\uDF2B\uFE0F',
  };

  const sizeMap: Record<string, string> = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
  };

  return (
    <span
      className={`${sizeMap[size]} ${className}`}
      role="img"
      aria-label={condition}
    >
      {iconMap[condition]}
    </span>
  );
};
