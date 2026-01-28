/**
 * 카카오 API region_1depth_name → 에어코리아 sidoName 변환 매퍼
 */
const SIDO_MAP: Record<string, string> = {
  '서울특별시': '서울',
  '부산광역시': '부산',
  '대구광역시': '대구',
  '인천광역시': '인천',
  '광주광역시': '광주',
  '대전광역시': '대전',
  '울산광역시': '울산',
  '세종특별자치시': '세종',
  '경기도': '경기',
  '강원특별자치도': '강원',
  '강원도': '강원',
  '충청북도': '충북',
  '충청남도': '충남',
  '전북특별자치도': '전북',
  '전라북도': '전북',
  '전라남도': '전남',
  '경상북도': '경북',
  '경상남도': '경남',
  '제주특별자치도': '제주',
};

/**
 * 카카오 API의 region_1depth_name 또는 IDistrict.province/city를
 * 에어코리아 sidoName 형식으로 변환
 * @param regionName - 지역명 (예: "서울특별시", "경기도", "서울")
 * @returns 에어코리아 sidoName (예: "서울", "경기") 또는 null
 */
export const toSidoName = (regionName: string): string | null => {
  // 이미 짧은 형식이면 그대로 반환
  const shortNames = Object.values(SIDO_MAP);
  if (shortNames.includes(regionName)) {
    return regionName;
  }

  return SIDO_MAP[regionName] ?? null;
};
