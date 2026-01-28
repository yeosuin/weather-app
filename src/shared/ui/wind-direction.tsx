interface IWindDirectionProps {
  direction: number; // 0-360 degree
  speed: number;
  size?: 'sm' | 'md';
}

/**
 * 풍향을 화살표로 표시하는 컴포넌트
 * @param direction - 풍향 (0-360도, 0=북, 90=동, 180=남, 270=서)
 * @param speed - 풍속 (m/s)
 * @param size - 크기
 */
export const WindDirection = ({
  direction,
  speed,
  size = 'md',
}: IWindDirectionProps) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg
        className={`${sizeClass} text-blue-600`}
        style={{ transform: `rotate(${direction}deg)` }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L4 12h6v10h4V12h6z" />
      </svg>
      <span className="text-xs text-gray-700">{speed}</span>
    </div>
  );
};
