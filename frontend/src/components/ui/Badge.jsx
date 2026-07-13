import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20",
  {
    variants: {
      variant: {
        default: "bg-[#1a237e] text-white",
        secondary: "bg-gray-100 text-gray-900",
        destructive: "bg-red-100 text-red-700",
        outline: "border border-gray-300 text-gray-700",
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
        info: "bg-blue-100 text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(badgeVariants({ variant }), className)}
    {...props}
  />
))
Badge.displayName = "Badge"

export { Badge, badgeVariants }
export default Badge
