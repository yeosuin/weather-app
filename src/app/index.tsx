import { useState, useEffect } from 'react';
import { QueryProvider } from './providers';
import { HomePage } from '@/pages/home';
import { FavoritesPage } from '@/pages/favorites';
import { BottomNav } from '@/widgets/bottom-nav';
import { Toast } from '@/shared/ui';
import { useFavoriteStore } from '@/features/toggle-favorite';
import type { IDistrict } from '@/shared/types';

type TNavTab = 'home' | 'favorites';

/**
 * 앱 루트 컴포넌트
 */
export const App = () => {
  const [activeTab, setActiveTab] = useState<TNavTab>('home');
  const [selectedLocation, setSelectedLocation] = useState<IDistrict | null>(
    null,
  );

  const { loadFavorites, error } = useFavoriteStore();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // 에러 발생 시 토스트 표시
  useEffect(() => {
    if (error) {
      setShowToast(true);
    }
  }, [error]);

  const handleLocationSelect = (district: IDistrict) => {
    setSelectedLocation(district);
    // 탭 전환 없이 선택된 위치만 업데이트
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoriteLocationSelect = (district: IDistrict) => {
    setSelectedLocation(district);
    // 선택된 위치로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHome = () => {
    window.location.reload();
  };

  const handleTabChange = (tab: TNavTab) => {
    setActiveTab(tab);
    setSelectedLocation(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <QueryProvider>
      {activeTab === 'home' ? (
        <HomePage
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          onHome={handleHome}
        />
      ) : (
        <FavoritesPage
          selectedLocation={selectedLocation}
          onLocationSelect={handleFavoriteLocationSelect}
          onHome={handleHome}
        />
      )}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      <Toast
        message={error || ''}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </QueryProvider>
  );
};
