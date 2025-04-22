import { Injectable, signal, Signal, computed } from '@angular/core';
import { USERS, User } from '../data/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _users = signal<User[]>(USERS);
  public readonly users: Signal<User[]> = this._users.asReadonly();

  /** Only non‑archived users */
  public readonly activeUsers = computed(() =>
    this._users().filter((u) => !u.archived)
  );

  /** Add a brand‑new user */
  public addUser(newUser: Omit<User, 'id' | 'archived'>): void {
    const current = this._users();
    const nextId =
      current.length > 0 ? Math.max(...current.map((u) => u.id)) + 1 : 1;
    this._users.set([...current, { ...newUser, id: nextId, archived: false }]);
  }

  /**
   * Update any fields (including `archived`) of an existing user.
   * Note: we only omit `id` so you can pass `{ archived: true }`.
   */
  public updateUser(id: number, changes: Partial<Omit<User, 'id'>>): void {
    const list = this._users();
    const idx = list.findIndex((u) => u.id === id);
    if (idx < 0) return;

    const updated: User = { ...list[idx], ...changes };
    const next: User[] = [...list];
    next[idx] = updated;
    this._users.set(next);
  }

  /** Soft‑delete (archive) */
  public deleteUser(id: number): void {
    this.updateUser(id, { archived: true });
  }

  /** Restore from archive */
  public restoreUser(id: number): void {
    this.updateUser(id, { archived: false });
  }
}
