import { create } from 'zustand';
import type { IFavoriteLocation, IDistrict } from '@/shared/types';
import {
  getFavorites,
  addFavorite as addToStorage,
  removeFavorite as removeFromStorage,
  updateFavoriteAlias as updateAliasInStorage,
} from '@/shared/lib';

interface IFavoriteStore {
  favorites: IFavoriteLocation[];
  isLoading: boolean;
  error: string | null;
  loadFavorites: () => void;
  addFavorite: (district: IDistrict) => void;
  removeFavorite: (id: string) => void;
  updateAlias: (id: string, alias: string) => void;
  isFavorite: (id: string) => boolean;
  clearError: () => void;
}

/**
 * 즐겨찾기 상태 관리 스토어
 */
export const useFavoriteStore = create<IFavoriteStore>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  loadFavorites: () => {
    set({ isLoading: true, error: null });
    try {
      const favorites = getFavorites();
      set({ favorites, isLoading: false });
    } catch {
      set({ error: '즐겨찾기를 불러오는데 실패했습니다.', isLoading: false });
    }
  },

  addFavorite: (district: IDistrict) => {
    try {
      const currentFavorites = get().favorites;

      // 최대 6개 제한 체크
      if (currentFavorites.length >= 6) {
        set({ error: '즐겨찾기는 최대 6개까지만 추가할 수 있습니다.' });
        return;
      }

      const newFavorite: IFavoriteLocation = {
        id: district.id,
        district,
        addedAt: Date.now(),
      };
      const updated = addToStorage(newFavorite);
      set({ favorites: updated, error: null });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '즐겨찾기 추가에 실패했습니다.',
      });
    }
  },

  removeFavorite: (id: string) => {
    try {
      const updated = removeFromStorage(id);
      set({ favorites: updated, error: null });
    } catch {
      set({ error: '즐겨찾기 삭제에 실패했습니다.' });
    }
  },

  updateAlias: (id: string, alias: string) => {
    try {
      const updated = updateAliasInStorage(id, alias);
      set({ favorites: updated, error: null });
    } catch {
      set({ error: '별칭 수정에 실패했습니다.' });
    }
  },

  isFavorite: (id: string) => {
    return get().favorites.some((f) => f.id === id);
  },

  clearError: () => {
    set({ error: null });
  },
}));
