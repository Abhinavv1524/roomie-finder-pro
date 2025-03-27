
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const LogoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const HighlightVariants = {
    initial: { width: "0%" },
    animate: { 
      width: "100%",
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className={`font-semibold ${sizeClasses[size]} ${className} flex items-center`}
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={LogoVariants}
    >
      <span className="mr-2 text-primary">
        <Home className="w-6 h-6" />
      </span>
      <span className="relative inline-block">
        <span className="text-primary">FindMy</span>
        <span className="text-foreground">Nest</span>
        <motion.span 
          className="absolute bottom-0 left-0 h-[2px] bg-primary rounded-full"
          variants={HighlightVariants}
        />
      </span>
    </motion.div>
  );
};

export default Logo;
