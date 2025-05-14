'use client';

import * as React from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { Check, AlertCircle } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-3">
              {variant === 'success' ? (
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
              ) : variant === 'destructive' ? (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              ) : null}
              <div className="flex-1 text-left">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
