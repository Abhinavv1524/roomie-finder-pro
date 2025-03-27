
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// Separate motion-specific props from HTML props
type MotionProps = {
  initial?: any;
  animate?: any;
  transition?: any;
};

interface GlassCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps>, MotionProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard = ({ 
  children, 
  className, 
  hoverEffect = true,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.5 },
  ...props 
}: GlassCardProps) => {
  // Extract motion props to avoid passing them as HTML attributes
  const motionProps: HTMLMotionProps<"div"> = {
    initial,
    animate,
    transition
  };
  
  // Filter out any onDrag handlers from the remaining props
  const { onDrag, ...filteredProps } = props;
  
  return (
    <motion.div
      className={cn(
        'glass-panel rounded-2xl p-6',
        hoverEffect && 'glass-panel-hover',
        className
      )}
      {...motionProps}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
};

export { GlassCard };
