import type { ICoordinates, IGridCoordinates } from '@/shared/types';

/**
 * 기상청 격자 변환 상수
 */
const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기준점 Y좌표(GRID)

const DEGRAD = Math.PI / 180.0;

const re = RE / GRID;
const slat1 = SLAT1 * DEGRAD;
const slat2 = SLAT2 * DEGRAD;
const olon = OLON * DEGRAD;
const olat = OLAT * DEGRAD;

const sn =
  Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
  Math.tan(Math.PI * 0.25 + slat1 * 0.5);
const snLog = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
const sf = (Math.tan(Math.PI * 0.25 + slat1 * 0.5) ** snLog * Math.cos(slat1)) / snLog;
const ro = (re * sf) / Math.tan(Math.PI * 0.25 + olat * 0.5) ** snLog;

/**
 * 위경도를 기상청 격자 좌표(nx, ny)로 변환
 * @param coordinates - 위경도 좌표
 * @returns 격자 좌표
 */
export const convertToGrid = (coordinates: ICoordinates): IGridCoordinates => {
  const { lat, lon } = coordinates;

  const ra =
    (re * sf) / Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5) ** snLog;
  let theta = lon * DEGRAD - olon;

  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;

  theta *= snLog;

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
};

/**
 * 현재 날짜를 YYYYMMDD 형식으로 반환
 */
export const getBaseDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * 단기예보 API용 기준 시간 반환
 * 단기예보는 02, 05, 08, 11, 14, 17, 20, 23시에 발표
 */
export const getBaseTimeForForecast = (): string => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // 발표 시각 목록 (API 제공 시간 + 10분 후부터 사용 가능)
  const baseTimes = [23, 20, 17, 14, 11, 8, 5, 2];

  for (const baseHour of baseTimes) {
    // 현재 시간이 발표 시간 + 10분 이후면 해당 시간 사용
    if (hour > baseHour || (hour === baseHour && minute >= 10)) {
      return String(baseHour).padStart(2, '0') + '00';
    }
  }

  // 자정~02:10 사이면 전날 23시 데이터 사용
  return '2300';
};

/**
 * 단기예보 기준일 반환 (자정~02:10 사이면 전날)
 */
export const getBaseDateForForecast = (): string => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // 02:10 이전이면 전날 날짜 사용
  if (hour < 2 || (hour === 2 && minute < 10)) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  return getBaseDate();
};

/**
 * 초단기실황 API용 기준 시간 반환
 * 매시 10분 이후에 정시 데이터 조회 가능
 */
export const getBaseTimeForUltraSrt = (): string => {
  const now = new Date();
  let hour = now.getHours();
  const minute = now.getMinutes();

  // 10분 이전이면 이전 시간 데이터 사용
  if (minute < 10) {
    hour = hour - 1;
    if (hour < 0) hour = 23;
  }

  return String(hour).padStart(2, '0') + '00';
};

/**
 * 초단기실황 기준일 반환
 */
export const getBaseDateForUltraSrt = (): string => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // 00:00~00:10 사이면 전날 날짜 사용
  if (hour === 0 && minute < 10) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  return getBaseDate();
};

/**
 * 초단기예보 API용 기준 시간 반환
 * 매시 30분 발표, 45분 이후 호출 가능
 */
