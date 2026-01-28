import {
  type IKmaApiItem,
  type IWeatherData,
  type IHourlyForecast,
  type TWeatherCondition,
} from '@/shared/types';
import { format } from 'date-fns';

/**
 * PTY(강수형태), SKY(하늘상태) 코드를 TWeatherCondition으로 변환
 * @param PTY 강수형태 코드
 * @param SKY 하늘상태 코드
 * @returns TWeatherCondition
 */
const toWeatherCondition = (PTY: string, SKY: string): TWeatherCondition => {
  switch (PTY) {
    case '1': // 비
    case '2': // 비/눈
    case '4': // 소나기
    case '5': // 빗방울
      return 'rain';
    case '3': // 눈
    case '6': // 빗방울/눈날림
    case '7': // 눈날림
      return 'snow';
    default:
      break;
  }

  switch (SKY) {
    case '1': // 맑음
      return 'clear';
    case '3': // 구름많음
    case '4': // 흐림
      return 'clouds';
    default:
      return 'clear';
  }
};

const getWeatherDescription = (condition: TWeatherCondition): string => {
  switch (condition) {
    case 'clear':
      return '맑음';
    case 'clouds':
      return '구름 많음';
    case 'rain':
      return '비';
    case 'snow':
      return '눈';
    case 'storm':
      return '폭풍';
    case 'mist':
      return '안개';
    default:
      return '맑음';
  }
};

interface IKmaProcessedData {
  current: IWeatherData;
  hourly: IHourlyForecast[];
}

/**
 * 기상청 단기예보 응답을 IWeatherData와 IHourlyForecast[]로 변환
 * @param items 기상청 API 응답 아이템 목록
 * @returns 가공된 날씨 데이터
 */
export const kmaMapper = (items: IKmaApiItem[]): IKmaProcessedData | null => {
  if (items.length === 0) return null;

  const now = new Date();
  const currentHour = format(now, 'HH00');
  const today = format(now, 'yyyyMMdd');

  // 가장 가까운 예보 시간 찾기
  let closestFcstTime = '2300';
  let minDiff = Infinity;
  items.forEach(item => {
    if(item.fcstDate === today && item.category === 'TMP') {
      const hour = parseInt(item.fcstTime, 10);
      const currentHourNum = parseInt(currentHour, 10);
      const diff = Math.abs(hour - currentHourNum);
      if (diff < minDiff) {
        minDiff = diff;
        closestFcstTime = item.fcstTime;
      }
    }
  });


  const currentItems = items.filter(
    (item) => item.fcstDate === today && item.fcstTime === closestFcstTime,
  );

  const tmnItem = items.find((item) => item.category === 'TMN');
  const tmxItem = items.find((item) => item.category === 'TMX');
  const tmpItem = currentItems.find((item) => item.category === 'TMP');
  const skyItem = currentItems.find((item) => item.category === 'SKY');
  const ptyItem = currentItems.find((item) => item.category === 'PTY');
  const wsdItem = currentItems.find((item) => item.category === 'WSD');
  const rehItem = currentItems.find((item) => item.category === 'REH');

  // POP은 currentItems에 없을 수 있으므로 전체에서 가장 가까운 시간 찾기
  const popItem = currentItems.find((item) => item.category === 'POP') ||
    items.find((item) => item.category === 'POP' && item.fcstDate === today);

  if (!tmpItem || !skyItem || !ptyItem || !wsdItem || !rehItem) {
    return null;
  }

  const condition = toWeatherCondition(ptyItem.fcstValue, skyItem.fcstValue);

  const current: IWeatherData = {
    temperature: Math.round(parseFloat(tmpItem.fcstValue)),
    tempMin: tmnItem ? Math.round(parseFloat(tmnItem.fcstValue)) : 0,
    tempMax: tmxItem ? Math.round(parseFloat(tmxItem.fcstValue)) : 0,
    humidity: parseInt(rehItem.fcstValue, 10),
    windSpeed: parseFloat(wsdItem.fcstValue),
    precipitationProbability: popItem ? parseInt(popItem.fcstValue, 10) : 0,
    condition,
    description: getWeatherDescription(condition),
    icon: '',
  };

  type HourlyEntry = IHourlyForecast & { date: string; hour: number };
  const hourly: HourlyEntry[] = [];
  const hourlyItems: Record<
    string,
    Partial<IHourlyForecast> & {
      SKY?: string;
      PTY?: string;
      date?: string;
      hour?: number;
    }
  > = {};

  items.forEach((item) => {
    const time = `${item.fcstTime.slice(0, 2)}:00`;
    const key = `${item.fcstDate}-${time}`;
    if (!hourlyItems[key]) {
      hourlyItems[key] = {
        date: item.fcstDate,
        hour: parseInt(item.fcstTime.slice(0, 2), 10),
      };
    }

    // 기온
    if (item.category === 'TMP') {
      hourlyItems[key].temperature = Math.round(parseFloat(item.fcstValue));
    }
    // 하늘상태
    if (item.category === 'SKY') {
      hourlyItems[key].SKY = item.fcstValue;
    }
    // 강수형태
    if (item.category === 'PTY') {
      hourlyItems[key].PTY = item.fcstValue;
    }
    // 강수확률
    if (item.category === 'POP') {
      hourlyItems[key].precipitationProbability = parseInt(item.fcstValue, 10);
    }
    // 1시간 강수량
    if (item.category === 'PCP') {
      const value = item.fcstValue;
      if (value === '강수없음' || value === '0') {
        hourlyItems[key].precipitation = 0;
      } else if (value.includes('mm')) {
        hourlyItems[key].precipitation = parseFloat(value.replace('mm', ''));
      } else {
        hourlyItems[key].precipitation = 0;
      }
    }
    // 1시간 신적설
    if (item.category === 'SNO') {
      const value = item.fcstValue;
      if (value === '적설없음' || value === '0') {
        hourlyItems[key].snow = 0;
      } else if (value.includes('cm')) {
        hourlyItems[key].snow = parseFloat(value.replace('cm', ''));
      } else {
        hourlyItems[key].snow = 0;
      }
    }
    // 습도
    if (item.category === 'REH') {
      hourlyItems[key].humidity = parseInt(item.fcstValue, 10);
    }
    // 풍속
    if (item.category === 'WSD') {
      hourlyItems[key].windSpeed = parseFloat(item.fcstValue);
    }
    // 풍향
    if (item.category === 'VEC') {
      hourlyItems[key].windDirection = parseInt(item.fcstValue, 10);
    }
  });

  for (const key in hourlyItems) {
    const item = hourlyItems[key];
    if (
      item.temperature !== undefined &&
      item.SKY &&
      item.PTY &&
      item.date &&
      item.hour !== undefined &&
      item.precipitationProbability !== undefined &&
      item.precipitation !== undefined &&
      item.snow !== undefined &&
      item.humidity !== undefined &&
      item.windSpeed !== undefined &&
      item.windDirection !== undefined
    ) {
      const isToday = item.date === today;
      const timeLabel = `${String(item.hour).padStart(2, '0')}시`;

      hourly.push({
        time: timeLabel,
        temperature: item.temperature,
        condition: toWeatherCondition(item.PTY, item.SKY),
        icon: '',
        precipitationProbability: item.precipitationProbability,
        precipitation: item.precipitation,
        snow: item.snow,
        humidity: item.humidity,
        windSpeed: item.windSpeed,
        windDirection: item.windDirection,
        isToday,
        date: item.date,
        hour: item.hour,
      });
    }
  }

  hourly.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.hour - b.hour;
  });

  return { current, hourly: hourly.slice(0, 24) }; // 24시간 예보
};
