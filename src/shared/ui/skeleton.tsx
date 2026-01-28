interface ISkeletonProps {
  className?: string;
}

/**
 * 로딩 스켈레톤 컴포넌트
 */
export const Skeleton = ({ className = '' }: ISkeletonProps) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
};

/**
 * 날씨 카드용 스켈레톤
 */
export const WeatherCardSkeleton = () => {
  return (
    <div className="bento-card">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-16 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
    </div>
  );
};

/**
 * 시간별 예보용 스켈레톤
 */
export const HourlyForecastSkeleton = () => {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  );
};
