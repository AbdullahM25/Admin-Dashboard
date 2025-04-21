import { Injectable, signal, Signal } from '@angular/core';
import { USERS, User }                 from '../data/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _users = signal<User[]>(USERS);
  public readonly users: Signal<User[]> = this._users.asReadonly();

  public addUser(newUser: Omit<User, 'id'>): void {
    const current = this._users();
    const nextId = current.length > 0
      ? Math.max(...current.map(u => u.id)) + 1
      : 1;
    this._users.set([...current, { ...newUser, id: nextId }]);
  }

  public updateUser(
    id: number,
    changes: Partial<Omit<User, 'id'>>
  ): void {
    const list = this._users();
    const idx  = list.findIndex(u => u.id === id);
    if (idx < 0) return;
    const updated = { ...list[idx], ...changes };
    const next    = [...list];
    next[idx]     = updated;
    this._users.set(next);
  }
}