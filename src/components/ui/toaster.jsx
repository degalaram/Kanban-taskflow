
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

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
