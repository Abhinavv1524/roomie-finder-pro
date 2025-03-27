
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// Separate motion-specific props from HTML props
type MotionProps = {
  initial?: any;
  animate?: any;
  whileHover?: any;
  whileTap?: any;
  transition?: any;
};

interface AnimatedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>, MotionProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const AnimatedButton = ({
  children,
  variant = 'default',
  size = 'default',
  className,
  initial = { opacity: 0, y: 10 },
  animate = { opacity: 1, y: 0 },
  whileHover = { scale: 1.03 },
  whileTap = { scale: 0.97 },
  transition = { duration: 0.2 },
  ...props
}: AnimatedButtonProps) => {
  // Extract motion props to avoid type conflicts
  const motionProps: HTMLMotionProps<"div"> = {
    initial,
    animate,
    whileHover,
    whileTap,
    transition
  };
  
  // Filter out all drag-related handlers from the remaining props
  const { onDrag, onDragStart, onDragEnd, onDragEnter, onDragLeave, onDragOver, onDrop, ...filteredProps } = props;
  
  return (
    <motion.div
      {...motionProps}
    >
      <Button
        variant={variant}
        size={size}
        className={cn('font-medium', className)}
        {...filteredProps}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export { AnimatedButton };
