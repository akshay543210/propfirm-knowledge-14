import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  sweep?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, sweep = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl glass-card-premium",
        sweep && "light-sweep",
        !hover && "hover:transform-none hover:shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
