import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
  glow?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    variant = 'default', 
    size = 'md', 
    children, 
    className, 
    pulse = false,
    glow = false,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(true);
      
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newRipple = {
          id: Date.now(),
          x,
          y,
        };
        
        setRipples(prev => [...prev, newRipple]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
      }
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const baseClasses = cn(
      'relative overflow-hidden rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2',
      {
        // Size variants
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
        
        // Variant styles
        'bg-slate-800 text-white hover:bg-slate-700 focus:ring-blue-500': variant === 'default',
        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
        'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500': variant === 'secondary',
        'bg-transparent text-slate-300 hover:bg-slate-800 focus:ring-slate-500': variant === 'ghost',
        
        // Pulse effect
        'animate-pulse': pulse,
        
        // Glow effect
        'shadow-lg shadow-blue-500/25': glow,
      },
      className
    );

    return (
      <motion.button
        ref={buttonRef}
        className={baseClasses}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
        animate={{
          boxShadow: glow ? [
            '0 0 20px rgba(59, 130, 246, 0.3)',
            '0 0 40px rgba(59, 130, 246, 0.2)',
            '0 0 20px rgba(59, 130, 246, 0.3)'
          ] : 'none'
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
        {...props}
      >
        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full bg-white/30"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                left: ripple.x - 2,
                top: ripple.y - 2,
                width: 4,
                height: 4,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Content */}
        <motion.span
          className="relative z-10 flex items-center justify-center"
          animate={{
            y: isPressed ? 1 : 0,
          }}
          transition={{ duration: 0.1 }}
        >
          {children}
        </motion.span>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton; 