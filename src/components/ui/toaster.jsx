// Toaster component - displays toast notifications
// Uses the useToast hook to get the list of toasts

import { useToast } from "@/hooks/use-toast";

// Simple Toaster component that displays toast messages
export function Toaster() {
  const { toasts } = useToast();

  // If no toasts, render nothing
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(function (toast) {
        return (
          <div
            key={toast.id}
            className="bg-card text-card-foreground border rounded-lg shadow-lg p-4 min-w-[300px]"
          >
            {toast.title && (
              <div className="font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm text-muted-foreground mt-1">
                {toast.description}
              </div>
            )}
            {toast.action}
          </div>
        );
      })}
    </div>
  );
}
