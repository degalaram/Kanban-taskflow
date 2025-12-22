// Toast notification hook
// Manages a list of toast messages with add, update, dismiss, and remove actions

import { useState, useEffect } from "react";

// Maximum number of toasts to show at once
const TOAST_LIMIT = 1;
// How long to wait before removing a dismissed toast from the DOM
const TOAST_REMOVE_DELAY = 1000000;

// Action types for the reducer
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

// Counter for generating unique toast IDs
let count = 0;

// Generate a unique ID for each toast
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Map to store timeout IDs for removing toasts
const toastTimeouts = new Map();

// Add a toast to the removal queue after it's dismissed
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// Reducer function to handle toast state changes
export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Add toast(s) to removal queue
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    }
    
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
      
    default:
      return state;
  }
};

// Array of listener functions to notify when state changes
const listeners = [];

// In-memory state storage
let memoryState = { toasts: [] };

// Dispatch function to update state and notify listeners
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Function to create and show a new toast
function toast(props) {
  const id = genId();

  // Function to update this toast
  const update = (updateProps) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...updateProps, id },
    });
    
  // Function to dismiss this toast
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Add the toast to state
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// Hook to use toast functionality in components
function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    // Subscribe to state changes
    listeners.push(setState);
    
    // Cleanup: unsubscribe when component unmounts
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
