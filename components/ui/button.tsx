import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#BA4A1E] via-[#C85826] to-[#D96830] text-white shadow-md shadow-orange-950/20 hover:from-[#A43E16] hover:to-[#BA4A1E] hover:shadow-lg active:scale-[0.97] ring-1 ring-orange-300/35 font-semibold",
        matcha:
          "bg-gradient-to-r from-[#1E5C38] via-[#2A7549] to-[#368D5B] text-white shadow-md shadow-emerald-950/20 hover:from-[#17482C] hover:to-[#22613B] hover:shadow-lg active:scale-[0.97] ring-1 ring-emerald-300/35 font-semibold",
        secondary:
          "bg-amber-light/90 backdrop-blur-xs text-wood-dark border border-amber/40 hover:bg-amber hover:text-white active:scale-[0.97] font-semibold shadow-2xs",
        outline:
          "border-2 border-[#BA4A1E]/35 bg-white/90 backdrop-blur-xs text-wood-dark hover:bg-[#FFF6EF] hover:border-[#BA4A1E] hover:shadow-xs active:scale-[0.97] font-semibold",
        ghost: "text-wood hover:bg-wood/10 hover:text-wood-dark active:scale-[0.97] font-medium",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.97] font-semibold",
        amberGlow:
          "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-lg shadow-amber-900/25 ring-1 ring-amber-400/50 hover:from-amber-700 hover:to-amber-900 active:scale-[0.97] font-semibold hover:shadow-amber-900/40",
        glass:
          "bg-white/85 backdrop-blur-md border border-wood/20 text-wood-dark shadow-xs hover:bg-white hover:border-amber/50 active:scale-[0.97] font-semibold",
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
