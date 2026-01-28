/**
 * 날씨 상태 타입
 */
export type TWeatherCondition = 'clear' | 'clouds' | 'rain' | 'storm' | 'snow' | 'mist';

/**
 * 위치 좌표 인터페이스
 */
export interface ICoordinates {
  lat: number;
  lon: number;
}

/**
 * 기상청 격자 좌표 인터페이스
 */
export interface IGridCoordinates {
  nx: number;
  ny: number;
}

/**
 * 지역 데이터 인터페이스
 */
export interface IDistrict {
  id: string;
  province?: string; // 도 (예: 경기도)
  city: string; // 시/군 (예: 수원시)
  district: string; // 구/읍/면 (예: 장안구)
  neighborhood?: string; // 동/리 (예: 정자동)
  coordinates: ICoordinates;
  fullName: string;
}

/**
 * 검색용 지역 데이터 인터페이스 (좌표 optional)
 * 검색 결과 선택 시 카카오 API로 좌표를 가져옴
 */
export interface IDistrictSearch {
  id: string;
  province?: string;
  city: string;
  district: string;
  neighborhood?: string;
  coordinates?: ICoordinates;
  fullName: string;
}

/**
 * 날씨 데이터 인터페이스
 */
export interface IWeatherData {
  temperature: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number; // 강수확률 (%)
  condition: TWeatherCondition;
  description: string;
  icon: string;
}

/**
 * 시간별 예보 인터페이스
 */
export interface IHourlyForecast {
  time: string;
  temperature: number;
  condition: TWeatherCondition;
  icon: string;
  precipitationProbability: number; // 강수 확률 (%)
  precipitation: number; // 강수량 (mm)
  snow: number; // 적설량 (cm)
  humidity: number; // 습도 (%)
  windSpeed: number; // 풍속 (m/s)
  windDirection: number; // 풍향 (degree)
  isToday?: boolean; // 오늘/내일 구분
}

/**
 * 즐겨찾기 위치 인터페이스
 */
export interface IFavoriteLocation {
  id: string;
  district: IDistrict;
  alias?: string;
  addedAt: number;
}

/**
 * 기상청 API 응답 아이템 인터페이스
 */
export interface IKmaApiItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

/**
 * 기상청 단기예보 API 응답 인터페이스
 */
export interface IKmaForecastResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: IKmaApiItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

/**
 * 기상청 초단기실황 API 응답 인터페이스
 */
export interface IKmaUltraSrtNcstResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: Array<{
          baseDate: string;
          baseTime: string;
          category: string;
          nx: number;
          ny: number;
          obsrValue: string;
        }>;
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

/**
 * 기상청 초단기예보 API 응답 인터페이스
 */

/**
 * 대기질 등급 타입
 */
export type TAirQualityGrade = '좋음' | '보통' | '나쁨' | '매우나쁨';

/**
 * 에어코리아 실시간 측정 데이터 인터페이스
 */
export interface IAirQualityData {
  stationName: string;
  dataTime: string;
  pm10Value: number | null;
  pm25Value: number | null;
  pm10Grade: TAirQualityGrade | null;
  pm25Grade: TAirQualityGrade | null;
}

/**
 * 에어코리아 API 응답 아이템 인터페이스
 */
export interface IAirQualityApiItem {
  stationName: string;
  dataTime: string;
  pm10Value: string;
  pm25Value: string;
  pm10Grade: string;
  pm25Grade: string;
}

/**
 * 에어코리아 API 응답 인터페이스
 */
export interface IAirQualityApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      totalCount: number;
      items: IAirQualityApiItem[];
      pageNo: number;
      numOfRows: number;
    };
  };
}
