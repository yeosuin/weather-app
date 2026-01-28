import { BentoCard, WeatherIcon } from '@/shared/ui';
import type { IWeatherData, IDistrict } from '@/shared/types';

interface IWeatherCardProps {
  weather: IWeatherData;
  location: IDistrict | { fullName: string };
  alias?: string;
  variant?: 'hero' | 'compact';
  onClick?: () => void;
  actions?: React.ReactNode;
}

/**
 * 날씨 정보를 표시하는 카드 컴포넌트 (Skycast 스타일)
 */
export const WeatherCard = ({
  weather,
  location,
  alias,
  variant = 'compact',
  onClick,
  actions,
}: IWeatherCardProps) => {
  const isHero = variant === 'hero';

  // 위치 정보 포맷팅 함수
  const getLocationInfo = () => {
    if ('fullName' in location) {
      return {
        main: location.fullName,
        sub: '대한민국',
      };
    }

    const district = location as IDistrict;
    const mainParts = [district.city, district.district];
    if (district.neighborhood) {
      mainParts.push(district.neighborhood);
    }

    return {
      main: mainParts.join(' '),
      sub: district.province || '대한민국',
    };
  };

  const locationInfo = getLocationInfo();

  if (isHero) {
    return (
      <div className="relative">
        <div
          className={`flex flex-col items-center text-center lg:sticky lg:top-8 lg:max-w-sm lg:mx-auto justify-center ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
        >
          <div className="w-full">
            <div className="flex justify-center items-center w-full mb-3">
              <div className="bg-blue-100/50 backdrop-blur-sm px-5 py-1.5 rounded-full">
                <span className="text-xs md:text-sm font-semibold text-slate-600">
                  {new Date().toLocaleDateString('ko-KR', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold mb-1 tracking-tight text-slate-800">
              {alias || locationInfo.main}
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mb-4">
              {weather.description}
            </p>

            <div className="flex justify-center items-center mb-4">
              <div className="relative scale-125 md:scale-150 my-6 md:my-8">
                <WeatherIcon condition={weather.condition} size="xl" />
              </div>
            </div>

            <div className="flex flex-col items-center mb-4">
              <span className="text-[4rem] md:text-[5rem] font-bold leading-none tracking-tighter text-slate-800">
                {Math.round(weather.temperature)}°
              </span>
              <p className="text-base md:text-lg text-slate-600 font-medium mt-8 flex gap-4">
                <span>H: {Math.round(weather.tempMax)}°</span>
                <span>L: {Math.round(weather.tempMin)}°</span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions (즐겨찾기 버튼 등) */}
        {actions && (
          <div className="absolute top-0 right-0 z-20">
            {actions}
          </div>
        )}
      </div>
    );
  }

  // Compact variant (즐겨찾기 카드용)
  return (
    <BentoCard
      className={`flex flex-col justify-between h-48 group relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-xl text-slate-800 mb-1">
            {alias || locationInfo.main}
          </h3>
          <p className="text-sm text-slate-500 font-medium">{locationInfo.sub}</p>
        </div>
        {actions}
      </div>

      <div className="relative z-10 flex items-end justify-between mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-slate-400 font-medium mb-1">
            {weather.description}
          </span>
          <span className="text-4xl font-bold text-slate-800">
            {Math.round(weather.temperature)}°
          </span>
        </div>
        <div className="scale-125 origin-bottom-right">
          <WeatherIcon condition={weather.condition} size="lg" />
        </div>
      </div>
    </BentoCard>
  );
};
