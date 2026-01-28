import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { IDistrictSearch } from '@/shared/types';

interface ISearchResultsProps {
  results: IDistrictSearch[];
  isEmpty: boolean;
  isSearching: boolean;
  onSelect: (district: IDistrictSearch) => void;
}

/**
 * 검색 결과 목록 컴포넌트
 */
export const SearchResults = ({
  results,
  isEmpty,
  isSearching,
  onSelect,
}: ISearchResultsProps) => {
  if (results.length === 0 && isSearching) {
    return (
      <div className="py-8 text-center text-gray-400">
        검색 중...
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="py-8 px-4 text-center">
        <p className="text-gray-500 font-medium">검색 결과가 없습니다</p>
        <p className="text-sm text-gray-400 mt-1">
          다른 지역명으로 다시 검색해 주세요
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {results.map((district, index) => {
        // 메인 텍스트: 시/군 + 구/읍/면 + 동/리
        const mainParts = [district.city, district.district];
        if (district.neighborhood) {
          mainParts.push(district.neighborhood);
        }
        const mainText = mainParts.join(' ');

        // 서브 텍스트: 도
        const subText = district.province || '';

        return (
          <motion.button
            key={`${district.id}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(district)}
            className="w-full p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-between group border border-transparent hover:border-blue-100"
          >
            <div className="text-left">
              <div className="font-bold text-lg text-gray-800">
                {mainText}
              </div>
              {subText && (
                <div className="text-sm text-gray-500">
                  {subText}
                </div>
              )}
            </div>
            <MapPin className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </motion.button>
        );
      })}
    </div>
  );
};
