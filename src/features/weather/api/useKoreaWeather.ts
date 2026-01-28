import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  convertToGrid,
  getBaseDateForForecast,
  getBaseTimeForForecast,
} from '@/shared/lib/grid-converter';
import { kmaMapper } from '@/entities/weather/model/kma-mapper';
import type { ICoordinates, IKmaForecastResponse } from '@/shared/types';

const KMA_BASE_URL = '/api/weather';

const getKmaVilageFcst = async (coordinates: ICoordinates) => {
  const { nx, ny } = convertToGrid(coordinates);
  const base_date = getBaseDateForForecast();
  const base_time = getBaseTimeForForecast();

  const params = {
    numOfRows: '1000',
    pageNo: '1',
    dataType: 'JSON',
    base_date,
    base_time,
    nx,
    ny,
  };

  const { data } = await axios.get<IKmaForecastResponse>(
    `${KMA_BASE_URL}/1360000/VilageFcstInfoService_2.0/getVilageFcst`,
    { params },
  );
  if (data.response.header.resultCode !== '00') {
    throw new Error(data.response.header.resultMsg);
  }

  return kmaMapper(data.response.body.items.item);
};

export const useKoreaWeather = (coordinates: ICoordinates | null) => {
  return useQuery({
    queryKey: ['kmaVilageFcst', coordinates],
    queryFn: async () => {
      if (!coordinates) return null;
      return getKmaVilageFcst(coordinates);
    },
    enabled: !!coordinates,
    staleTime: 10 * 60 * 1000, // 10분
  });
};
