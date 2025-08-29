import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  offset?: number;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  speed = 0.5,
  offset = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, offset - speed * 100]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  children,
  className = '',
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background layers with different parallax speeds */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />
      
      {/* Floating geometric shapes */}
      <div
        className="absolute top-20 left-10 w-32 h-32 border border-blue-500/20 rounded-full"
        style={{
          transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.01}deg)`,
        }}
      />
      <div
        className="absolute top-40 right-20 w-24 h-24 border border-blue-400/30 rounded-lg"
        style={{
          transform: `translateY(${scrollY * 0.15}px) rotate(${-scrollY * 0.015}deg)`,
        }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-16 h-16 border border-blue-300/40 rounded-full"
        style={{
          transform: `translateY(${scrollY * 0.25}px) rotate(${scrollY * 0.02}deg)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export { ParallaxSection, ParallaxBackground }; 