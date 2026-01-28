import { Home, Heart } from 'lucide-react';
import { cn } from '@/shared/lib';

type TNavTab = 'home' | 'favorites';

interface IBottomNavProps {
  activeTab: TNavTab;
  onTabChange: (tab: TNavTab) => void;
}

/**
 * 하단 네비게이션 바 컴포넌트 (Skycast 스타일)
 */
export const BottomNav = ({ activeTab, onTabChange }: IBottomNavProps) => {
  return (
    <nav className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg px-12 py-3">
        <div className="flex items-center justify-around gap-16">
          {/* 홈 버튼 */}
          <button
            onClick={() => onTabChange('home')}
            className={cn(
              'flex items-center justify-center p-3 rounded-full transition-all duration-300',
              activeTab === 'home'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            )}
            aria-label="홈"
          >
            <Home className={cn('w-6 h-6', activeTab === 'home' && 'fill-current')} />
          </button>

          {/* 즐겨찾기 버튼 */}
          <button
            onClick={() => onTabChange('favorites')}
            className={cn(
              'flex items-center justify-center p-3 rounded-full transition-all duration-300',
              activeTab === 'favorites'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            )}
            aria-label="즐겨찾기"
          >
            <Heart className={cn('w-6 h-6', activeTab === 'favorites' && 'fill-current')} />
          </button>
        </div>
      </div>
    </nav>
  );
};
