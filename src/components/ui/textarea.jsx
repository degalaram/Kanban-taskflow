// Textarea component - multi-line text input
// Uses forwardRef for ref forwarding

import * as React from "react";
import { cn } from "@/lib/utils";

// Textarea component
const Textarea = React.forwardRef(function Textarea(props, ref) {
  const { className, ...rest } = props;
  
  return (
    <textarea
      className={cn(
        // Base styles
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        // Ring offset for focus
        "ring-offset-background",
        // Placeholder styles
        "placeholder:text-muted-foreground",
        // Focus styles
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Disabled styles
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Custom className
        className
      )}
      ref={ref}
      {...rest}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
