// Utility function for combining class names
// Uses clsx for conditional classes and tailwind-merge to handle Tailwind conflicts

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn = className helper
// Combines multiple class names and resolves Tailwind conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
