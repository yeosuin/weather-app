type TClassValue = string | boolean | undefined | null;

/**
 * 조건부 클래스명을 병합하는 유틸리티 함수
 * @param inputs - 클래스명 또는 조건부 값
 * @returns 병합된 클래스명 문자열
 */
export const cn = (...inputs: TClassValue[]): string => {
  return inputs.filter(Boolean).join(' ');
};
