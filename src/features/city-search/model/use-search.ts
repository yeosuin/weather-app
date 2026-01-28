import { useState, useEffect, useMemo } from 'react';
import { searchDistricts } from '@/entities/location';
import type { IDistrictSearch } from '@/shared/types';

/**
 * 디바운스된 검색 기능 훅
 * 검색 결과에는 좌표가 없음 (선택 시 카카오 API로 가져옴)
 */
export const useSearch = (debounceMs = 300) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const results: IDistrictSearch[] = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }
    return searchDistricts(debouncedQuery);
  }, [debouncedQuery]);

  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
    hasResults: results.length > 0,
    isEmpty: debouncedQuery.trim() !== '' && results.length === 0,
  };
};
