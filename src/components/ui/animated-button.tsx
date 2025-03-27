
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  initial?: object;
  animate?: object;
  whileHover?: object;
  whileTap?: object;
  transition?: object;
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
  return (
    <motion.div
      initial={initial}
      animate={animate}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition}
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
