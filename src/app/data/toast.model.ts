// A single toast’s data shape
export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'neutral';

export interface Toast {
  id: string; // unique identifier
  message: string; // text to show
  type: ToastType; // style variant
  duration: number; // how long (ms) before auto‑dismiss
}
