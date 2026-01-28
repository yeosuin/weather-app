import { useMemo } from 'react';
import { Gauge } from 'lucide-react';
import type { IAirQualityData, TAirQualityGrade } from '@/shared/types';

interface IAirQualityCardProps {
  data: IAirQualityData;
}

interface IGradeStyle {
  color: string;
  bg: string;
  text: string;
}

const GRADE_STYLES: Record<TAirQualityGrade, IGradeStyle> = {
  '좋음': { color: 'text-blue-600', bg: 'bg-blue-100', text: '좋음' },
  '보통': { color: 'text-green-600', bg: 'bg-green-100', text: '보통' },
  '나쁨': { color: 'text-orange-600', bg: 'bg-orange-100', text: '나쁨' },
  '매우나쁨': { color: 'text-red-600', bg: 'bg-red-100', text: '매우나쁨' },
};

const DEFAULT_STYLE: IGradeStyle = {
  color: 'text-gray-500',
  bg: 'bg-gray-100',
  text: '-',
};

/**
 * 등급에 맞는 스타일 반환
 */
const getGradeStyle = (
  grade: TAirQualityGrade | null,
): IGradeStyle => {
  if (!grade) return DEFAULT_STYLE;
  return GRADE_STYLES[grade] ?? DEFAULT_STYLE;
};

/**
 * 미세먼지 실시간 데이터를 표시하는 카드 컴포넌트
 * WeatherDetails와 동일한 2열 그리드 스타일
 */
export const AirQualityCard = ({ data }: IAirQualityCardProps) => {
  const items = useMemo(() => {
    const pm10Style = getGradeStyle(data.pm10Grade);
    const pm25Style = getGradeStyle(data.pm25Grade);

    return [
      {
        label: '미세먼지',
        value: data.pm10Value !== null ? `${data.pm10Value}` : '-',
        unit: data.pm10Value !== null ? 'μg/m³' : '',
        grade: pm10Style.text,
        icon: Gauge,
        color: pm10Style.color,
        bg: pm10Style.bg,
      },
      {
        label: '초미세먼지',
        value: data.pm25Value !== null ? `${data.pm25Value}` : '-',
        unit: data.pm25Value !== null ? 'μg/m³' : '',
        grade: pm25Style.text,
        icon: Gauge,
        color: pm25Style.color,
        bg: pm25Style.bg,
      },
    ];
  }, [data]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white/60 backdrop-blur-sm p-5 rounded-3xl
            flex flex-col justify-between h-32
            hover:bg-white transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${item.bg} ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 font-bold tracking-wider">
              {item.label}
            </p>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="font-bold text-2xl text-gray-800">
              {item.value}{' '}
              {item.unit && (
                <span className="text-sm font-normal text-gray-500">
                  {item.unit}
                </span>
              )}
            </p>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${item.bg} ${item.color}`}
            >
              {item.grade}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
