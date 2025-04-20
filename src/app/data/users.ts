export type UserStatus = 'active' | 'inactive' | 'banned';

export interface User {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
}

export const USERS: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@parts.com", status: 'active' },
  { id: 2, name: "Bob Smith",    email: "bob@parts.com",   status: 'banned' },
  { id: 3, name: "Carol Lee",    email: "carol@parts.com", status: 'inactive' },
  // …add more if you like
];
