import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CustomCursorProps {
  children: React.ReactNode;
}

const CustomCursor = ({ children }: CustomCursorProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [data-cursor="pointer"]');
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => setCursorVariant('pointer'));
      el.addEventListener('mouseleave', () => setCursorVariant('default'));
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', () => setCursorVariant('pointer'));
        el.removeEventListener('mouseleave', () => setCursorVariant('default'));
      });
    };
  }, []);

  const cursorVariants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      border: '2px solid rgba(59, 130, 246, 0.8)',
    },
    pointer: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      border: '2px solid rgba(59, 130, 246, 1)',
      scale: 1.2,
    },
  };

  const trailingVariants = {
    default: {
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
      height: 8,
      width: 8,
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
    },
    pointer: {
      x: mousePosition.x - 6,
      y: mousePosition.y - 6,
      height: 12,
      width: 12,
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      scale: 1.5,
    },
  };

  if (!isHovering) return <>{children}</>;

  return (
    <>
      {children}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        variants={trailingVariants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
      />
    </>
  );
};

export default CustomCursor; 