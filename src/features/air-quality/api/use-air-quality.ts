import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type {
  IAirQualityData,
  IAirQualityApiResponse,
  TAirQualityGrade,
} from '@/shared/types';

const AIR_QUALITY_BASE_URL = '/api/weather';

const GRADE_MAP: Record<string, TAirQualityGrade> = {
  '1': '좋음',
  '2': '보통',
  '3': '나쁨',
  '4': '매우나쁨',
};

/**
 * 에어코리아 시도별 실시간 측정정보 조회
 * @param sidoName - 시도명 (예: "서울", "경기")
 */
const getAirQuality = async (
  sidoName: string,
): Promise<IAirQualityData[]> => {
  const params = {
    sidoName,
    returnType: 'json',
    numOfRows: 100,
    pageNo: 1,
    ver: '1.3',
  };

  const { data } = await axios.get<IAirQualityApiResponse>(
    `${AIR_QUALITY_BASE_URL}/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty`,
    { params },
  );

  if (data.response.header.resultCode !== '00') {
    throw new Error(data.response.header.resultMsg);
  }

  return data.response.body.items.map((item) => ({
    stationName: item.stationName,
    dataTime: item.dataTime,
    pm10Value: item.pm10Value && item.pm10Value !== '-'
      ? Number(item.pm10Value)
      : null,
    pm25Value: item.pm25Value && item.pm25Value !== '-'
      ? Number(item.pm25Value)
      : null,
    pm10Grade: GRADE_MAP[item.pm10Grade] ?? null,
    pm25Grade: GRADE_MAP[item.pm25Grade] ?? null,
  }));
};

/**
 * 시도별 대기질 실시간 측정 데이터를 가져오는 TanStack Query hook
 * @param sidoName - 에어코리아 sidoName (예: "서울", "경기")
 */
export const useAirQuality = (sidoName: string | null) => {
  return useQuery({
    queryKey: ['airQuality', sidoName],
    queryFn: async () => {
      if (!sidoName) return null;
      return getAirQuality(sidoName);
    },
    enabled: !!sidoName,
    staleTime: 30 * 60 * 1000, // 30분
  });
};
