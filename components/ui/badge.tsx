import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-wood text-cream",
        secondary: "border-transparent bg-amber-light text-wood-dark",
        outline: "border-wood/30 text-wood-dark",
        BLACK: "border-transparent bg-amber-950 text-amber-100",
        GREEN: "border-transparent bg-green-700 text-green-50",
        OOLONG: "border-transparent bg-yellow-700 text-yellow-50",
        HERBAL: "border-transparent bg-pink-600 text-pink-50",
        WHITE: "border-transparent bg-stone-400 text-stone-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
