import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-wood-dark to-wood text-cream shadow-md shadow-wood/20 hover:from-wood hover:to-wood-light hover:shadow-lg active:scale-[0.97] ring-1 ring-amber-400/20 font-semibold",
        secondary:
          "bg-amber-light/80 backdrop-blur-xs text-wood-dark border border-amber/30 hover:bg-amber active:scale-[0.97] font-medium shadow-2xs",
        outline:
          "border-2 border-wood/25 bg-white/60 backdrop-blur-xs text-wood-dark hover:bg-white hover:border-wood/40 hover:shadow-xs active:scale-[0.97]",
        ghost: "text-wood hover:bg-wood/10 hover:text-wood-dark active:scale-[0.97]",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.97]",
        amberGlow:
          "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-lg shadow-amber-900/25 ring-1 ring-amber-400/50 hover:from-amber-700 hover:to-amber-900 active:scale-[0.97] font-semibold hover:shadow-amber-900/40",
        glass:
          "bg-white/70 backdrop-blur-md border border-wood/20 text-wood-dark shadow-xs hover:bg-white/90 hover:border-amber/40 active:scale-[0.97]",
        zen:
          "rounded-full bg-cream-dark text-wood-dark border border-wood/20 hover:bg-amber-light/30 active:scale-[0.95] font-medium px-5",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
