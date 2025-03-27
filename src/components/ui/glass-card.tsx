
import React from 'react';
import { motion, VariantLabels, TargetAndTransition, AnimationControls } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  initial?: VariantLabels | TargetAndTransition;
  animate?: VariantLabels | TargetAndTransition | AnimationControls;
  transition?: any; // Using any for transition as it has complex typings
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
  return (
    <motion.div
      className={cn(
        'glass-panel rounded-2xl p-6',
        hoverEffect && 'glass-panel-hover',
        className
      )}
      initial={initial}
      animate={animate}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { GlassCard };
