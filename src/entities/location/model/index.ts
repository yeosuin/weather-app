import koreaDistrictsRaw from '@/shared/data/korea_districts.json';
import type { IDistrictSearch } from '@/shared/types';

// korea_districts.json은 문자열 배열
const koreaDistricts: string[] = koreaDistrictsRaw as string[];

/**
 * 문자열에서 시/구/동 파싱
 */
const parseDistrictString = (str: string): { city: string; district: string; neighborhood?: string } | null => {
  const parts = str.split('-');
  if (parts.length === 1) {
    return { city: parts[0], district: parts[0] };
  } else if (parts.length === 2) {
    return { city: parts[0], district: parts[1] };
  } else if (parts.length >= 3) {
    return { city: parts[0], district: parts[1], neighborhood: parts.slice(2).join(' ') };
  }
  return null;
};

/**
 * 문자열을 IDistrictSearch로 변환 (검색용, 좌표 없음)
 * 좌표는 검색 결과 선택 시 카카오 API로 가져옴
 */
const toDistrictSearch = (str: string): IDistrictSearch | null => {
  const parsed = parseDistrictString(str);
  if (!parsed) return null;

  const fullName = parsed.neighborhood
    ? `${parsed.city} ${parsed.district} ${parsed.neighborhood}`
    : `${parsed.city} ${parsed.district}`;

  return {
    id: str.replace(/\s+/g, '-').toLowerCase(),
    city: parsed.city,
    district: parsed.district,
    neighborhood: parsed.neighborhood,
    fullName,
  };
};

/**
 * 검색어로 지역 필터링
 * 검색 결과에는 좌표가 없음 (선택 시 카카오 API로 가져옴)
 * @param query - 검색어
 * @returns 일치하는 지역 목록
 */
export const searchDistricts = (query: string): IDistrictSearch[] => {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, '');

  const matched = koreaDistricts
    .filter((str) => {
      const parts = str.split('-');
      const lower = str.toLowerCase();
      const noHyphen = lower.replace(/-/g, '');

      // 전체 문자열에서 검색
      if (noHyphen.includes(normalizedQuery)) {
        return true;
      }

      // 각 부분(시/구/동)에서 개별 검색
      for (const part of parts) {
        if (part.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
      }

      // 마지막 부분(동)만 검색
      if (parts.length >= 3) {
        const dong = parts[parts.length - 1].toLowerCase();
        if (dong.includes(normalizedQuery)) {
          return true;
        }
      }

      return false;
    })
    .slice(0, 30) // 최대 30개
    .map(toDistrictSearch)
    .filter((d): d is IDistrictSearch => d !== null);

  return matched;
};

/**
 * ID로 지역 조회
 */
export const getDistrictById = (id: string): IDistrictSearch | undefined => {
  const found = koreaDistricts.find(
    (str) => str.replace(/\s+/g, '-').toLowerCase() === id
  );
  if (found) {
    return toDistrictSearch(found) || undefined;
  }
  return undefined;
};

/**
 * 전체 지역 목록 조회 (구/시 단위만)
 */
export const getAllDistricts = (): IDistrictSearch[] => {
  return koreaDistricts
    .filter((str) => str.split('-').length === 2) // 시-구 형태만
    .map(toDistrictSearch)
    .filter((d): d is IDistrictSearch => d !== null);
};
