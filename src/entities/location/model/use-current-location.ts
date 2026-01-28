import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGeolocation } from '@/shared/hooks';
import { kakaoCoord2Address } from '@/shared/api/kakao-api';
import type { IDistrict } from '@/shared/types';

/**
 * 현재 위치 기반으로 지역 정보를 가져오는 훅
 * GPS 좌표 → 카카오 API → 주소 정보 변환
 */
export const useCurrentLocation = () => {
  const {
    coordinates: geoCoordinates,
    error: geoError,
    isLoading: isGeoLoading,
  } = useGeolocation();

  const {
    data: kakaoAddress,
    isLoading: isAddressLoading,
    error: addressError,
  } = useQuery({
    queryKey: ['coord2address', geoCoordinates],
    queryFn: () => kakaoCoord2Address(geoCoordinates),
    enabled: !!geoCoordinates,
    staleTime: Infinity,
  });

  const location: IDistrict | null = useMemo(() => {
    if (!geoCoordinates || !kakaoAddress) return null;

    // 카카오 API 응답으로 ID 생성
    const idParts = [
      kakaoAddress.region_1depth_name,
      kakaoAddress.region_2depth_name,
      kakaoAddress.region_3depth_name,
    ].filter(Boolean);
    const id = idParts.join('-').toLowerCase().replace(/\s+/g, '-');

    return {
      id,
      coordinates: geoCoordinates,
      fullName: `${kakaoAddress.region_1depth_name} ${kakaoAddress.region_2depth_name} ${kakaoAddress.region_3depth_name}`.trim(),
      city: kakaoAddress.region_1depth_name,
      district: kakaoAddress.region_2depth_name,
      neighborhood: kakaoAddress.region_3depth_name,
    };
  }, [geoCoordinates, kakaoAddress]);

  const isLoading = isGeoLoading || (isAddressLoading && !!geoCoordinates);
  const error = geoError || (addressError as Error)?.message;

  return { location, isLoading, error };
};
