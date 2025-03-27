
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

interface AnimatedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps | keyof DragHandlerProps> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  // Add asChild prop to support composition with other components
  asChild?: boolean;
  // Add motion props separately
  initial?: any;
  animate?: any;
  whileHover?: any;
  whileTap?: any;
  transition?: any;
  variants?: any;
}

const AnimatedButton = ({
  children,
  variant = 'default',
  size = 'default',
  className,
  asChild = false,
  initial = { opacity: 0, y: 10 },
  animate = { opacity: 1, y: 0 },
  whileHover = { scale: 1.03 },
  whileTap = { scale: 0.97 },
  transition = { duration: 0.2 },
  variants,
  ...props
}: AnimatedButtonProps) => {
  // Create a clean object with only motion props
  const motionProps: HTMLMotionProps<"div"> = {
    initial,
    animate,
    whileHover,
    whileTap,
    transition,
    ...(variants && { variants })
  };
  
  return (
    <motion.div
      {...motionProps}
    >
      <Button
        variant={variant}
        size={size}
        className={cn('font-medium', className)}
        asChild={asChild}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export { AnimatedButton };
