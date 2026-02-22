import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

const AnimatedCounter = ({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2.5,
  className,
}: AnimatedCounterProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {inView ? (
        <CountUp
          end={end}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          duration={duration}
          separator=","
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
};

export { AnimatedCounter };
