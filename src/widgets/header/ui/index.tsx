import { useState, useRef, useEffect } from 'react';
import { Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchPill } from '@/shared/ui';
import { useSearch, SearchResults } from '@/features/city-search';
import { kakaoAddress2Coord } from '@/shared/api/kakao-api';
import type { IDistrict, IDistrictSearch } from '@/shared/types';

interface IHeaderProps {
  onLocationSelect: (district: IDistrict) => void;
  onHome?: () => void;
}

/**
 * 헤더 위젯 - 로고와 검색 기능
 */
export const Header = ({ onLocationSelect, onHome }: IHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { query, setQuery, results, isSearching, clearSearch, hasResults, isEmpty } =
    useSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isLoadingCoords, setIsLoadingCoords] = useState(false);

  const handleSelect = async (districtSearch: IDistrictSearch) => {
    setIsLoadingCoords(true);
    try {
      const coords = await kakaoAddress2Coord(districtSearch.fullName);
      if (!coords) return;

      const district: IDistrict = {
        ...districtSearch,
        coordinates: coords,
      };

      onLocationSelect(district);
      clearSearch();
      setIsSearchOpen(false);
    } catch {
      // 좌표 변환 실패 시 무시
    } finally {
      setIsLoadingCoords(false);
    }
  };

  const handleHome = () => {
    if (!onHome) return;
    onHome();
    clearSearch();
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 py-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleHome}
          className="flex items-center gap-2 group"
          aria-label="홈으로 이동"
        >
          <div className="bg-blue-500 p-2 rounded-xl text-white transition-transform group-hover:scale-105">
            <Cloud size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 hidden sm:block tracking-tight">
            Weather
          </h1>
        </button>

        <div ref={searchRef} className="flex-1 relative">
          <SearchPill
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="도시 검색..."
          />

          <AnimatePresence>
            {isSearchOpen && (hasResults || isEmpty || isSearching || isLoadingCoords) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-h-80 overflow-y-auto"
              >
                {isLoadingCoords ? (
                  <div className="py-8 text-center text-gray-400">
                    위치 정보를 가져오는 중...
                  </div>
                ) : (
                  <SearchResults
                    results={results}
                    isEmpty={isEmpty}
                    isSearching={isSearching}
                    onSelect={handleSelect}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
