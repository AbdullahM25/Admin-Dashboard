import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../data/toast.model';
import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // internal list of active toasts
  private _toasts = signal<Toast[]>([]);
  // readonly “view” of that list
  readonly toasts = this._toasts.asReadonly();

  /**
   * Fire a new toast:
   * - message: text
   * - type: variant (now includes 'neutral')
   * - duration: ms until auto‑remove
   */
  show(message: string, type: ToastType = 'info', duration = 3000) {
    const toast: Toast = { id: uuid(), message, type, duration };

    // add to the list
    this._toasts.set([...this._toasts(), toast]);

    // schedule its removal
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  /** Remove a toast immediately by its id */
  dismiss(id: string) {
    this._toasts.set(this._toasts().filter((t) => t.id !== id));
  }
}
