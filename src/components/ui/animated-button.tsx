
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

interface AnimatedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
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
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export { AnimatedButton };
