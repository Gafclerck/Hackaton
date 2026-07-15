import { forwardRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn, getInitials, getAvatarColor } from "../../lib/utils";

const AvatarRoot = forwardRef(function AvatarRoot({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
});

const AvatarImage = forwardRef(function AvatarImage({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
});

const AvatarFallback = forwardRef(function AvatarFallback({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  );
});

function Avatar({ nom, size = 36, className = "" }) {
  const bg = getAvatarColor(nom);
  return (
    <AvatarRoot
      className={className}
      style={{ width: size, height: size }}
    >
      <AvatarFallback
        className="text-primary-foreground font-semibold select-none"
        style={{
          backgroundColor: bg,
          fontSize: size * 0.36,
        }}
      >
        {getInitials(nom)}
      </AvatarFallback>
    </AvatarRoot>
  );
}

export { AvatarRoot, AvatarImage, AvatarFallback, Avatar };
export default Avatar;
