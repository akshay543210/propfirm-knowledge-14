import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
  id?: string;
}

const SectionWrapper = ({ children, className, divider = true, id }: SectionWrapperProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      {divider && <div className="gradient-divider" />}
      <motion.section
        ref={ref}
        id={id}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn("py-20 px-4 sm:px-6 lg:px-8 relative", className)}
      >
        {children}
      </motion.section>
    </>
  );
};

export { SectionWrapper };
