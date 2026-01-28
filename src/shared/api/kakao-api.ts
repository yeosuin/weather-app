import axios from 'axios';
import type { ICoordinates } from '@/shared/types';

interface IKakaoCoord2AddressResponse {
  documents: Array<{
    address: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
    };
  }>;
}

interface IKakaoAddress2CoordResponse {
  documents: Array<{
    address_name: string;
    x: string;
    y: string;
  }>;
}

/**
 * 카카오 API로 좌표를 주소로 변환
 */
export const kakaoCoord2Address = async (coords: ICoordinates | null) => {
  if (!coords) return null;

  const { data } = await axios.get<IKakaoCoord2AddressResponse>(
    'https://dapi.kakao.com/v2/local/geo/coord2address.json',
    {
      params: { x: coords.lon, y: coords.lat },
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_KEY}`,
      },
    },
  );

  if (data.documents.length === 0) return null;

  return data.documents[0].address;
};

/**
 * 카카오 API로 주소를 좌표로 변환
 * @param address - 검색할 주소 문자열
 * @returns 좌표 정보 또는 null
 */
export const kakaoAddress2Coord = async (address: string): Promise<ICoordinates | null> => {
  if (!address) return null;

  const { data } = await axios.get<IKakaoAddress2CoordResponse>(
    'https://dapi.kakao.com/v2/local/search/address.json',
    {
      params: { query: address },
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_KEY}`,
      },
    },
  );

  if (data.documents.length === 0) return null;

  return {
    lat: parseFloat(data.documents[0].y),
    lon: parseFloat(data.documents[0].x),
  };
};
