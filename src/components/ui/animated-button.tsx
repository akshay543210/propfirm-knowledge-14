import React from "react";
import { motion, MotionProps } from "framer-motion";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps & MotionProps>(
  ({ 
    variant = "primary", 
    size = "md", 
    glow = false, 
    pulse = false, 
    children, 
    className = "", 
    ...props 
  }, ref) => {
    const baseClasses = "relative font-semibold rounded-lg transition-all duration-300 overflow-hidden";
    
    const variantClasses = {
      primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
      secondary: "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600",
    };
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
    
    const glowClasses = glow 
      ? "shadow-lg hover:shadow-xl" 
      : "";
      
    const pulseClasses = pulse 
      ? "animate-pulse" 
      : "";
    
    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${glowClasses} ${pulseClasses} ${className}`;
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={combinedClasses}
        {...props}
      >
        {children}
        {glow && (
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg pointer-events-none" />
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;