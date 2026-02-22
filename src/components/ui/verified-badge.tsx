import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

interface VerifiedBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

const VerifiedBadge = ({ className, size = "sm" }: VerifiedBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      "bg-primary/15 text-primary border border-primary/25",
      "relative overflow-hidden",
      size === "sm" && "text-[10px] px-2 py-0.5",
      size === "md" && "text-xs px-3 py-1",
      className
    )}
  >
    <ShieldCheck className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
    Verified
    <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
      <span className="absolute inset-0 animate-shimmer-sweep bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </span>
  </span>
);

export { VerifiedBadge };
