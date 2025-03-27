
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// Separate motion-specific props from HTML props
type MotionProps = {
  initial?: any;
  animate?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  variants?: any;
};

// Define drag-related event handler props that cause conflicts
type DragHandlerProps = {
  onDrag?: any;
  onDragStart?: any;
  onDragEnd?: any;
  onDragEnter?: any;
  onDragLeave?: any;
  onDragOver?: any;
  onDrop?: any;
  onAnimationStart?: any;
  onAnimationComplete?: any;
};

interface GlassCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps | keyof DragHandlerProps> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  // Add motion props separately
  initial?: any;
  animate?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  variants?: any;
}

const GlassCard = ({ 
  children, 
  className, 
  hoverEffect = true,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.5 },
  whileHover,
  whileTap,
  variants,
  ...props 
}: GlassCardProps) => {
  // Create a clean object with only motion props
  const motionProps: HTMLMotionProps<"div"> = {
    initial,
    animate,
    transition,
    ...(whileHover && { whileHover }),
    ...(whileTap && { whileTap }),
    ...(variants && { variants })
  };
  
  return (
    <motion.div
      className={cn(
        'glass-panel rounded-2xl p-6',
        hoverEffect && 'glass-panel-hover',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { GlassCard };
