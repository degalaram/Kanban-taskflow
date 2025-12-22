// Card components - container components for content
// Includes Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

import * as React from "react";
import { cn } from "@/lib/utils";

// Main Card container
const Card = React.forwardRef(function Card(props, ref) {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...rest}
    />
  );
});
Card.displayName = "Card";

// Card Header - usually contains title and description
const CardHeader = React.forwardRef(function CardHeader(props, ref) {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...rest}
    />
  );
});
CardHeader.displayName = "CardHeader";

// Card Title - the main heading
const CardTitle = React.forwardRef(function CardTitle(props, ref) {
  const { className, ...rest } = props;
  return (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...rest}
    />
  );
});
CardTitle.displayName = "CardTitle";

// Card Description - subtitle or helper text
const CardDescription = React.forwardRef(function CardDescription(props, ref) {
  const { className, ...rest } = props;
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...rest}
    />
  );
});
CardDescription.displayName = "CardDescription";

// Card Content - main content area
const CardContent = React.forwardRef(function CardContent(props, ref) {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...rest}
    />
  );
});
CardContent.displayName = "CardContent";

// Card Footer - usually contains actions
const CardFooter = React.forwardRef(function CardFooter(props, ref) {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...rest}
    />
  );
});
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
