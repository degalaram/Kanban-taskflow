// Dialog component - modal dialog using Radix UI
// Includes Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Root dialog component
const Dialog = DialogPrimitive.Root;

// Trigger that opens the dialog
const DialogTrigger = DialogPrimitive.Trigger;

// Portal for rendering dialog outside the DOM hierarchy
const DialogPortal = DialogPrimitive.Portal;

// Close button
const DialogClose = DialogPrimitive.Close;

// Overlay - the dark backdrop behind the dialog
const DialogOverlay = React.forwardRef(function DialogOverlay(props, ref) {
  const { className, ...rest } = props;
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/80",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...rest}
    />
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Content - the actual dialog box
const DialogContent = React.forwardRef(function DialogContent(props, ref) {
  const { className, children, ...rest } = props;
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          // Positioning
          "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
          // Sizing
          "grid w-full max-w-lg gap-4",
          // Styling
          "border bg-background p-6 shadow-lg sm:rounded-lg",
          // Animation
          "duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          className
        )}
        {...rest}
      >
        {children}
        {/* Close button in top right corner */}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Header - container for title and description
const DialogHeader = function DialogHeader(props) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...rest}
    />
  );
};
DialogHeader.displayName = "DialogHeader";

// Footer - container for actions
const DialogFooter = function DialogFooter(props) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...rest}
    />
  );
};
DialogFooter.displayName = "DialogFooter";

// Title
const DialogTitle = React.forwardRef(function DialogTitle(props, ref) {
  const { className, ...rest } = props;
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...rest}
    />
  );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Description
const DialogDescription = React.forwardRef(function DialogDescription(props, ref) {
  const { className, ...rest } = props;
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...rest}
    />
  );
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
