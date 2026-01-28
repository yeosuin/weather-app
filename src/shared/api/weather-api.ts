import axios from 'axios';
import type {
  ICoordinates,
  IWeatherData,
  IHourlyForecast,
  IKmaForecastResponse,
  IKmaUltraSrtNcstResponse,
  TWeatherCondition,
} from '@/shared/types';
import {
  convertToGrid,
  getBaseDateForForecast,
  getBaseTimeForForecast,
  getBaseDateForUltraSrt,
  getBaseTimeForUltraSrt,
} from '@/shared/lib/grid-converter';

const KMA_BASE = '/api/weather';
const BASE_URL = `${KMA_BASE}/1360000/VilageFcstInfoService_2.0`;

const getKma = async <T>(
  endpoint: string,
  params: Record<string, string | number>
): Promise<T> => {
  const { data } = await axios.get<T>(`${BASE_URL}/${endpoint}`, {
    params,
  });
  return data;
};

/**
 * 하늘 상태(SKY) + 강수 형태(PTY)를 TWeatherCondition으로 변환
 */
const mapWeatherCondition = (sky: string, pty: string): TWeatherCondition => {
  const ptyNum = parseInt(pty, 10);
  const skyNum = parseInt(sky, 10);

  if (ptyNum === 1 || ptyNum === 4) return 'rain';
  if (ptyNum === 2) return 'rain';
  if (ptyNum === 3) return 'snow';

  if (skyNum === 1) return 'clear';
  if (skyNum === 3) return 'clouds';
  if (skyNum === 4) return 'mist';

  return 'clouds';
};

/**
 * 날씨 상태 한글 설명 반환
 */
const getWeatherDescription = (sky: string, pty: string): string => {
  const ptyNum = parseInt(pty, 10);
  const skyNum = parseInt(sky, 10);

  if (ptyNum === 1) return '비';
  if (ptyNum === 2) return '비/눈';
  if (ptyNum === 3) return '눈';
  if (ptyNum === 4) return '소나기';

  if (skyNum === 1) return '맑음';
  if (skyNum === 3) return '구름 많음';
  if (skyNum === 4) return '흐림';

  return '맑음';
};

/**
 * 초단기실황 API 호출하여 현재 날씨 데이터 조회
 */
export const fetchCurrentWeather = async (
  coordinates: ICoordinates
): Promise<IWeatherData> => {
  const grid = convertToGrid(coordinates);
  const baseDate = getBaseDateForUltraSrt();
  const baseTime = getBaseTimeForUltraSrt();

  // 초단기실황 조회
  const ncstData = await getKma<IKmaUltraSrtNcstResponse>('getUltraSrtNcst', {
    numOfRows: 10,
    pageNo: 1,
    dataType: 'JSON',
    base_date: baseDate,
    base_time: baseTime,
    nx: grid.nx,
    ny: grid.ny,
  });
  if (ncstData.response.header.resultCode !== '00') {
    throw new Error(ncstData.response.header.resultMsg);
  }

  // 단기예보 조회 (최저/최고 기온용)
  const forecastBaseDate = getBaseDateForForecast();
  const forecastBaseTime = getBaseTimeForForecast();

  const fcstData = await getKma<IKmaForecastResponse>('getVilageFcst', {
    numOfRows: 300,
    pageNo: 1,
    dataType: 'JSON',
    base_date: forecastBaseDate,
    base_time: forecastBaseTime,
    nx: grid.nx,
    ny: grid.ny,
  });
  if (fcstData.response.header.resultCode !== '00') {
    throw new Error(fcstData.response.header.resultMsg);
  }

  // 초단기실황 데이터 파싱
  const ncstItems = ncstData.response.body.items.item;
  const ncstMap: Record<string, string> = {};
  ncstItems.forEach((item) => {
    ncstMap[item.category] = item.obsrValue;
  });

  // 단기예보 데이터에서 오늘 최저/최고 기온 추출
  const fcstItems = fcstData.response.body.items.item;
  let tempMin = 0;
  let tempMax = 0;
  let sky = '1';
  let pty = '0';
  let pop = 0; // 강수확률

  const today = getBaseDateForUltraSrt();

  fcstItems.forEach((item) => {
    if (item.fcstDate === today) {
      if (item.category === 'TMN') {
        tempMin = Math.round(parseFloat(item.fcstValue));
      }
      if (item.category === 'TMX') {
        tempMax = Math.round(parseFloat(item.fcstValue));
      }
      if (item.category === 'SKY') {
        sky = item.fcstValue;
      }
      if (item.category === 'PTY') {
        pty = item.fcstValue;
      }
      if (item.category === 'POP') {
        pop = parseInt(item.fcstValue, 10);
      }
    }
  });

  // 현재 온도 (T1H)
  const temperature = Math.round(parseFloat(ncstMap['T1H'] || '0'));
  // 습도 (REH)
  const humidity = parseInt(ncstMap['REH'] || '0', 10);
  // 풍속 (WSD)
  const windSpeed = parseFloat(ncstMap['WSD'] || '0');
  // 강수형태 (PTY) - 실황에서 가져오기
  const currentPty = ncstMap['PTY'] || pty;

  // 최저/최고 기온이 없으면 현재 온도 기준으로 설정
  if (tempMin === 0) tempMin = temperature - 3;
  if (tempMax === 0) tempMax = temperature + 3;

  const condition = mapWeatherCondition(sky, currentPty);
  const description = getWeatherDescription(sky, currentPty);

  return {
    temperature,
    tempMin,
    tempMax,
    humidity,
    windSpeed,
    precipitationProbability: pop,
    condition,
    description,
    icon: condition,
  };
};

/**
 * 단기예보 API 호출하여 시간별 예보 조회
 */
export const fetchHourlyForecast = async (
  coordinates: ICoordinates
): Promise<IHourlyForecast[]> => {
  const grid = convertToGrid(coordinates);
  const baseDate = getBaseDateForForecast();
  const baseTime = getBaseTimeForForecast();

  const data = await getKma<IKmaForecastResponse>('getVilageFcst', {
    numOfRows: 300,
    pageNo: 1,
    dataType: 'JSON',
    base_date: baseDate,
    base_time: baseTime,
    nx: grid.nx,
    ny: grid.ny,
  });
  if (data.response.header.resultCode !== '00') {
    throw new Error(data.response.header.resultMsg);
  }

  const items = data.response.body.items.item;

  // 시간대별로 그룹화
  const forecastMap: Record<
    string,
    {
      TMP?: string;
      SKY?: string;
      PTY?: string;
      POP?: string;
      PCP?: string;
      SNO?: string;
      REH?: string;
      WSD?: string;
      VEC?: string;
    }
  > = {};

  items.forEach((item) => {
    const key = `${item.fcstDate}-${item.fcstTime}`;
    if (!forecastMap[key]) {
      forecastMap[key] = {};
    }
    if (item.category === 'TMP') {
      forecastMap[key].TMP = item.fcstValue;
    }
    if (item.category === 'SKY') {
      forecastMap[key].SKY = item.fcstValue;
    }
    if (item.category === 'PTY') {
      forecastMap[key].PTY = item.fcstValue;
    }
    if (item.category === 'POP') {
      forecastMap[key].POP = item.fcstValue;
    }
    if (item.category === 'PCP') {
      forecastMap[key].PCP = item.fcstValue;
    }
    if (item.category === 'SNO') {
      forecastMap[key].SNO = item.fcstValue;
    }
    if (item.category === 'REH') {
      forecastMap[key].REH = item.fcstValue;
    }
    if (item.category === 'WSD') {
      forecastMap[key].WSD = item.fcstValue;
    }
    if (item.category === 'VEC') {
      forecastMap[key].VEC = item.fcstValue;
    }
  });

  // 현재 시간 이후의 예보만 추출 (최대 8개)
  const now = new Date();
  const currentHour = now.getHours();
  const today = getBaseDateForUltraSrt();

  const forecasts: IHourlyForecast[] = [];

  Object.keys(forecastMap)
    .sort()
    .forEach((key) => {
      if (forecasts.length >= 8) return;

      const [date, time] = key.split('-');
      const hour = parseInt(time.substring(0, 2), 10);

      if (date === today && hour <= currentHour) return;

      const forecast = forecastMap[key];
      if (forecast.TMP) {
        const condition = mapWeatherCondition(
          forecast.SKY || '1',
          forecast.PTY || '0'
        );

        // PCP/SNO는 "강수없음" 또는 숫자mm/cm 형태
        const parsePrecipitation = (value?: string): number => {
          if (!value || value === '강수없음' || value === '적설없음') return 0;
          return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
        };

        forecasts.push({
          time: `${hour}시`,
          temperature: Math.round(parseFloat(forecast.TMP)),
          condition,
          icon: condition,
          precipitationProbability: parseInt(forecast.POP || '0', 10),
          precipitation: parsePrecipitation(forecast.PCP),
          snow: parsePrecipitation(forecast.SNO),
          humidity: parseInt(forecast.REH || '0', 10),
          windSpeed: parseFloat(forecast.WSD || '0'),
          windDirection: parseInt(forecast.VEC || '0', 10),
        });
      }
    });

  return forecasts;
};
