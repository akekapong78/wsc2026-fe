'use client';

import { useCallback, useRef, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export type ToastKind = 'success' | 'error';
export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

// Minimal shared toast — no dependency, used by both OMS and VOC dashboards
// to surface PATCH/load success-or-error feedback the pages used to swallow
// silently (or only show as an inline banner).
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const notify = useCallback((kind: ToastKind, message: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return { toasts, notify, dismiss };
}

export function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className={`pointer-events-auto cursor-pointer rounded-lg shadow-lg px-3.5 py-2.5 text-[13px] font-medium text-white flex items-center gap-2 max-w-sm ${
            t.kind === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {t.kind === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
