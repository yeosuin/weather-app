import { Search } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/shared/lib';

type TSearchPillProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * 캡슐 모양 검색 입력 컴포넌트
 */
export const SearchPill = forwardRef<HTMLInputElement, TSearchPillProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
          size={22}
          strokeWidth={2.5}
        />
        <input
          ref={ref}
          type="text"
          className={cn('search-pill w-full pl-12 pr-4', className)}
          {...props}
        />
      </div>
    );
  },
);

SearchPill.displayName = 'SearchPill';
