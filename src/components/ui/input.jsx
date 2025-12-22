// Input component - styled input field
// Uses forwardRef for ref forwarding

import * as React from "react";
import { cn } from "@/lib/utils";

// Input component with forwardRef
const Input = React.forwardRef(function Input(props, ref) {
  const { className, type, ...rest } = props;
  
  return (
    <input
      type={type}
      className={cn(
        // Base input styles
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base",
        // Ring offset for focus state
        "ring-offset-background",
        // File input specific styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Placeholder styles
        "placeholder:text-muted-foreground",
        // Focus styles
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Disabled styles
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Responsive text size
        "md:text-sm",
        // Custom className from props
        className
      )}
      ref={ref}
      {...rest}
    />
  );
});

Input.displayName = "Input";

export { Input };
