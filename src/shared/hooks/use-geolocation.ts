import { useState, useEffect } from 'react';
import type { ICoordinates } from '@/shared/types';

interface IGeolocationState {
  coordinates: ICoordinates | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * 기본 위치 (서울시청)
 */
const DEFAULT_COORDINATES: ICoordinates = {
  lat: 37.5666,
  lon: 126.9784,
};

/**
 * 사용자의 현재 위치를 가져오는 훅
 * @returns 좌표, 에러, 로딩 상태
 */
export const useGeolocation = (): IGeolocationState => {
  const [state, setState] = useState<IGeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: DEFAULT_COORDINATES,
        error: '브라우저가 위치 서비스를 지원하지 않습니다.',
        isLoading: false,
      });
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        coordinates: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        error: null,
        isLoading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      let errorMessage = '위치를 가져올 수 없습니다.';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = '위치 권한이 거부되었습니다.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = '위치 정보를 사용할 수 없습니다.';
          break;
        case error.TIMEOUT:
          errorMessage = '위치 요청 시간이 초과되었습니다.';
          break;
      }
      setState({
        coordinates: DEFAULT_COORDINATES,
        error: errorMessage,
        isLoading: false,
      });
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });
  }, []);

  return state;
};
