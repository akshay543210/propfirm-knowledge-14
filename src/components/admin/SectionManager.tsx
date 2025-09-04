import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  DollarSign, 
  Trophy, 
  Table,
  Globe,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  Loader2
} from "lucide-react";
import { usePropFirms } from "@/hooks/useSupabaseData";
import { useSectionMemberships } from "@/hooks/useSectionMemberships";
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AllFirmsSection from "./AllFirmsSection";
import CheapFirmsSection from "./CheapFirmsSection";
import TopFirmsSection from "./TopFirmsSection";
import ExploreFirmsSection from "./ExploreFirmsSection";
import { toast } from "sonner";
import { memo } from "react";

const SectionManager = memo(() => {
  const { propFirms, loading: firmsLoading } = usePropFirms();
  const { 
    budgetFirms, 
    topFirms, 
    tableReviewFirms,
    loading: membershipsLoading, 
    addFirmToSection, 
    removeFirmFromSection,
    refetch,
    error,
    hasInitialized
  } = useSectionMemberships();
  
  const [selectedBudgetFirm, setSelectedBudgetFirm] = useState<string>("");
  const [selectedTopFirm, setSelectedTopFirm] = useState<string>("");
  const [selectedTableReviewFirm, setSelectedTableReviewFirm] = useState<string>("");

  // Memoized refetch function to prevent unnecessary re-renders
  const memoizedRefetch = useCallback(() => {
    if (!firmsLoading && propFirms.length > 0 && hasInitialized) {
      refetch();
    }
  }, [propFirms.length, firmsLoading, refetch, hasInitialized]);

  // Only refetch when propFirms actually change
  useEffect(() => {
    memoizedRefetch();
  }, [memoizedRefetch]);

  const handleAddToBudget = useCallback(async () => {
    if (!selectedBudgetFirm) {
      toast.error('Please select a firm to add');
      return;
    }
    const result = await addFirmToSection("budget-firms", selectedBudgetFirm);
    if (result.success) {
      setSelectedBudgetFirm("");
      toast.success('Firm added to budget section successfully');
    }
  }, [selectedBudgetFirm, addFirmToSection]);

  const handleAddToTop = useCallback(async () => {
    if (!selectedTopFirm) {
      toast.error('Please select a firm to add');
      return;
    }
    const result = await addFirmToSection("top-firms", selectedTopFirm);
    if (result.success) {
      setSelectedTopFirm("");
      toast.success('Firm added to top firms successfully');
    }
<dyad-problem-report summary="3 problems">
<problem file="src/components/AnimationShowcase.tsx" line="228" column="11" code="2322">Type '{ hidden: { opacity: number; y: number; }; visible: { opacity: number; y: number; transition: { duration: number; ease: string; }; }; }' is not assignable to type 'Variants'.
  Property 'visible' is incompatible with index signature.
    Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'Variant'.
      Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'TargetAndTransition'.
        Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type '{ transition?: Transition&lt;any&gt;; transitionEnd?: ResolvedValues; }'.
          Types of property 'transition' are incompatible.
            Type '{ duration: number; ease: string; }' is not assignable to type 'Transition&lt;any&gt;'.
              Type '{ duration: number; ease: string; }' is not assignable to type 'TransitionWithValueOverrides&lt;any&gt;'.
                Type '{ duration: number; ease: string; }' is not assignable to type 'ValueAnimationTransition&lt;any&gt;'.
                  Types of property 'ease' are incompatible.
                    Type 'string' is not assignable to type 'Easing | Easing[]'.</problem>
<problem file="src/components/AnimationShowcase.tsx" line="280" column="11" code="2322">Type '{ hidden: { opacity: number; y: number; }; visible: { opacity: number; y: number; transition: { duration: number; ease: string; }; }; }' is not assignable to type 'Variants'.
  Property 'visible' is incompatible with index signature.
    Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'Variant'.
      Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'TargetAndTransition'.
        Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type '{ transition?: Transition&lt;any&gt;; transitionEnd?: ResolvedValues; }'.
          Types of property 'transition' are incompatible.
            Type '{ duration: number; ease: string; }' is not assignable to type 'Transition&lt;any&gt;'.
              Type '{ duration: number; ease: string; }' is not assignable to type 'TransitionWithValueOverrides&lt;any&gt;'.
                Type '{ duration: number; ease: string; }' is not assignable to type 'ValueAnimationTransition&lt;any&gt;'.
                  Types of property 'ease' are incompatible.
                    Type 'string' is not assignable to type 'Easing | Easing[]'.</problem>
<problem file="src/components/AnimationShowcase.tsx" line="291" column="11" code="2322">Type '{ hidden: { opacity: number; y: number; }; visible: { opacity: number; y: number; transition: { duration: number; ease: string; }; }; }' is not assignable to type 'Variants'.
  Property 'visible' is incompatible with index signature.
    Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'Variant'.
      Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type 'TargetAndTransition'.
        Type '{ opacity: number; y: number; transition: { duration: number; ease: string; }; }' is not assignable to type '{ transition?: Transition&lt;any&gt;; transitionEnd?: ResolvedValues; }'.
          Types of property 'transition' are incompatible.
            Type '{ duration: number; ease: string; }' is not assignable to type 'Transition&lt;any&gt;'.
              Type '{ duration: number; ease: string; }' is not assignable to type 'TransitionWithValueOverrides&lt;any&gt;'.
                Type '{ duration: number; ease: string; }' is not assignable to type 'ValueAnimationTransition&lt;any&gt;'.
                  Types of property 'ease' are incompatible.
                    Type 'string' is not assignable to type 'Easing | Easing[]'.</problem>
</dyad-problem-report><dyad-write path="src/components/AnimationShowcase.tsx" description="Fix TypeScript errors in AnimationShowcase component related to Framer Motion variants">
import React from 'react';
import { motion, Transition } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import AnimatedButton from '@/components/ui/animated-button';

// Individual animation demo components
const HoverEffectsDemo = () => (
  <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover-lift">
    <h3 className="text-xl font-bold text-white mb-4">Hover Effects</h3>
    <div className="space-y-4">
      <motion.div
        className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
        whileHover={{ scale: 1.05, rotate: 2 }}
        transition={{ duration: 0.3 }}
      />
      <AnimatedButton variant="primary" className="w-full">
        Hover Me
      </AnimatedButton>
    </div>
  </div>
);

const ScrollAnimationsDemo = ({ controls, variants }: any) => (
  <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover-lift">
    <h3 className="text-xl font-bold text-white mb-4">Scroll Animations</h3>
    <div className="space-y-4">
      <motion.div
        className="w-full h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"
        variants={variants.fadeInUp}
        initial="hidden"
        animate={controls}
      />
      <motion.div
        className="w-full h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
        variants={variants.fadeInLeft}
        initial="hidden"
        animate={controls}
      />
    </div>
  </div>
);

const ParticleEffectsDemo = () => (
  <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover-lift">
    <h3 className="text-xl font-bold text-white mb-4">Particle Effects</h3>
    <div className="relative h-32 bg-slate-700/30 rounded-lg overflow-hidden">
      <motion.div
        className="absolute w-2 h-2 bg-blue-400 rounded-full"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-3 h-3 bg-purple-400 rounded-full"
        animate={{
          x: [100, 0, 100],
          y: [50, 0, 50],
          scale: [1, 2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  </div>
);

const MagneticEffectsDemo = () => (
  <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover-lift">
    <h3 className="text-xl font-bold text-white mb-4">Magnetic Effects</h3>
    <div className="space-y-4">
      <motion.div
        className="w-full h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
      <AnimatedButton variant="secondary" className="w-full">
        Magnetic Button
      </AnimatedButton>
    </div>
  </div>
);

const ColorAnimationsDemo = () => (
  <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover-lift">
    <h3 className="text-xl font-bold text-white mb-4">Color Animations</h3>
    <div className="space-y-4">
      <motion.div
        className="w-full h-20 rounded-lg"
        animate={{
          background: [
            'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            'linear-gradient(45deg, #4ecdc4, #45b7d1)',
            'linear-gradient(45deg, #45b7d1, #96ceb4)',
            'linear-gradient(45deg, #96ceb4, #ff6b6b)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="text-center text-lg font-bold"
        animate={{
          color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff6b6b'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        Color Shifting Text
      </motion.div>
    </div>
  </div>
);

const LoadingStatesDemo = () => (
  <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover-lift">
    <h3 className="text-xl font-bold text-white mb-4">Loading States</h3>
    <div className="space-y-4">
      <div className="flex justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="space-y-2">
        <motion.div
          className="h-2 bg-slate-700 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="h-full bg-blue-500"
            animate={{ x: [-100, 100] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  </div>
);

const InteractiveDemo = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    <motion.div
      className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-8"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h4 className="text-lg font-bold text-white mb-4">3D Card Effect</h4>
      <motion.div
        className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
        whileHover={{ rotateX: 10, rotateY: 10 }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: "preserve-3d" }}
      />
    </motion.div>

    <motion.div
      className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-8"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h4 className="text-lg font-bold text-white mb-4">Spring Animation</h4>
      <motion.div
        className="w-16 h-16 bg-green-500 rounded-full mx-auto"
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  </div>
);

const AnimationShowcase = () => {
  const { ref, controls, variants } = useScrollAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      } as Transition,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      } as Transition,
    },
  };

  return (
    <section 
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={variants.fadeInUp}
          initial="hidden"
          animate={controls}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="gradient-text-blue">Animation</span> Showcase
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of modern web animations with our comprehensive collection of interactive effects.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Hover Effects */}
          <motion.div variants={itemVariants} className="group">
            <HoverEffectsDemo />
          </motion.div>

          {/* Scroll Animations */}
          <motion.div variants={itemVariants} className="group">
            <ScrollAnimationsDemo controls={controls} variants={variants} />
          </motion.div>

          {/* Particle Effects */}
          <motion.div variants={itemVariants} className="group">
            <ParticleEffectsDemo />
          </motion.div>

          {/* Magnetic Effects */}
          <motion.div variants={itemVariants} className="group">
            <MagneticEffectsDemo />
          </motion.div>

          {/* Color Animations */}
          <motion.div variants={itemVariants} className="group">
            <ColorAnimationsDemo />
          </motion.div>

          {/* Loading States */}
          <motion.div variants={itemVariants} className="group">
            <LoadingStatesDemo />
          </motion.div>
        </motion.div>

        {/* Interactive Demo Section */}
        <motion.div
          variants={variants.fadeInUp}
          initial="hidden"
          animate={controls}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">Interactive Demo</h3>
          <InteractiveDemo />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={variants.fadeInUp}
          initial="hidden"
          animate={controls}
          className="mt-16 text-center"
        >
          <AnimatedButton
            size="lg"
            variant="primary"
            glow={true}
            pulse={true}
            className="text-lg px-8 py-4"
          >
            Explore More Animations
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimationShowcase;