import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/shared/lib';

interface IBentoCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
}

/**
 * Bento 스타일 카드 컴포넌트
 * @param children - 자식 요소
 * @param className - 추가 클래스명
 * @param variant - 카드 스타일 (default | glass)
 */
export const BentoCard = ({
  children,
  className,
  variant = 'default',
  ...props
}: IBentoCardProps) => {
  const baseClasses = variant === 'glass' ? 'glass-card' : 'bento-card';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(baseClasses, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
