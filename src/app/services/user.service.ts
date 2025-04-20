import { Injectable, signal } from '@angular/core';
import { USERS, User }      from '../data/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _users = signal<User[]>(USERS);
  readonly users    = this._users.asReadonly();

  // you can later add methods to add/remove/update
}
