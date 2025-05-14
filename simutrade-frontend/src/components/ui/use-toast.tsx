// This file is deprecated and not used anymore.
// The actual implementation is in /src/hooks/use-toast.ts
// This file is kept only for reference and can be safely removed.

// Inspired by react-hot-toast library
import * as React from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastClose>;

type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: 'default' | 'destructive';
};

const ToastContext = React.createContext<{
  toasts: ToasterToast[];
  addToast: (toast: Omit<ToasterToast, 'id'>) => void;
  removeToast: (toastId: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const addToast = React.useCallback((toast: Omit<ToasterToast, 'id'>) => {
    setToasts((currentToasts) => {
      if (currentToasts.length >= TOAST_LIMIT) {
        currentToasts.pop();
      }

      const id = String(Math.random());

      return [
        {
          ...toast,
          id,
        },
        ...currentToasts,
      ];
    });
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const toast = (props: Omit<ToasterToast, 'id'>) => {
    context.addToast(props);
  };

  return {
    toast,
    toasts: context.toasts,
    dismiss: context.removeToast,
  };
}
