
import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const CardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

interface CardMotionProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "whileHover" | "whileTap"> {
  interactive?: boolean;
  delay?: number;
}

const CardMotion = React.forwardRef<
  HTMLDivElement,
  CardMotionProps
>(({ className, interactive = true, delay = 0, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "rounded-2xl border bg-card p-6 text-card-foreground shadow-sm",
      interactive && "cursor-pointer card-hover",
      className
    )}
    variants={CardVariants}
    initial="hidden"
    animate="visible"
    whileHover={interactive ? "hover" : undefined}
    whileTap={interactive ? "tap" : undefined}
    transition={{
      delay: delay,
    }}
    {...props}
  />
));
CardMotion.displayName = "CardMotion";

const CardMotionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-0", className)}
    {...props}
  />
));
CardMotionHeader.displayName = "CardMotionHeader";

const CardMotionTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
CardMotionTitle.displayName = "CardMotionTitle";

const CardMotionDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardMotionDescription.displayName = "CardMotionDescription";

const CardMotionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-4", className)} {...props} />
));
CardMotionContent.displayName = "CardMotionContent";

const CardMotionFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
));
CardMotionFooter.displayName = "CardMotionFooter";

export {
  CardMotion,
  CardMotionHeader,
  CardMotionFooter,
  CardMotionTitle,
  CardMotionDescription,
  CardMotionContent,
};
