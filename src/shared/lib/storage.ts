import type { IFavoriteLocation } from '@/shared/types';

const FAVORITES_KEY = 'weather-app-favorites';

/**
 * localStorage에서 즐겨찾기 목록 조회
 */
export const getFavorites = (): IFavoriteLocation[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * localStorage에 즐겨찾기 목록 저장
 */
export const saveFavorites = (favorites: IFavoriteLocation[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // 저장 실패 시 무시
  }
};

/**
 * 즐겨찾기 추가
 */
export const addFavorite = (favorite: IFavoriteLocation): IFavoriteLocation[] => {
  const favorites = getFavorites();
  if (favorites.length >= 6) {
    throw new Error('최대 6개까지 즐겨찾기를 추가할 수 있습니다.');
  }
  if (favorites.some((f) => f.id === favorite.id)) {
    return favorites;
  }
  const updated = [...favorites, favorite];
  saveFavorites(updated);
  return updated;
};

/**
 * 즐겨찾기 삭제
 */
export const removeFavorite = (id: string): IFavoriteLocation[] => {
  const favorites = getFavorites();
  const updated = favorites.filter((f) => f.id !== id);
  saveFavorites(updated);
  return updated;
};

/**
 * 즐겨찾기 별칭 수정
 */
export const updateFavoriteAlias = (
  id: string,
  alias: string
): IFavoriteLocation[] => {
  const favorites = getFavorites();
  const updated = favorites.map((f) =>
    f.id === id ? { ...f, alias: alias || undefined } : f
  );
  saveFavorites(updated);
  return updated;
};
