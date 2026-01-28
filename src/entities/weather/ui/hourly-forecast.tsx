import { WeatherIcon } from '@/shared/ui';
import type { IHourlyForecast } from '@/shared/types';

interface IHourlyForecastProps {
  forecasts: IHourlyForecast[];
}

/**
 * 시간별 예보 위젯 (Skycast 스타일)
 */
export const HourlyForecast = ({ forecasts }: IHourlyForecastProps) => {
  // 최대 24시간만 표시
  const displayForecasts = forecasts.slice(0, 24);

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-sm">
      <h3 className="font-bold text-gray-700 mb-4">시간별 예보</h3>

      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide px-1 snap-x">
        {displayForecasts.map((forecast) => (
          <div
            key={forecast.time}
            className="snap-start flex-shrink-0 flex flex-col items-center justify-between bg-white/60 hover:bg-white p-4 rounded-2xl min-w-[80px] h-32 transition-colors shadow-sm"
          >
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
              {forecast.time}
            </span>
            <div className="my-2">
              <WeatherIcon condition={forecast.condition} size="md" />
            </div>
            <span className="font-bold text-lg text-gray-800">
              {Math.round(forecast.temperature)}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
