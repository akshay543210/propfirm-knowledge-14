import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PerformanceMonitor = () => {
  const [fps, setFps] = useState(60);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Show performance monitor only in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-lg border border-slate-700/50 rounded-lg p-3 text-sm text-white z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${fps >= 50 ? 'bg-green-400' : fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'}`} />
        <span className="font-mono">{fps} FPS</span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {fps >= 50 ? 'Excellent' : fps >= 30 ? 'Good' : 'Poor'} Performance
      </div>
    </motion.div>
  );
};

export default PerformanceMonitor; 