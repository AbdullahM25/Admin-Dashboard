export type UserStatus = 'active' | 'inactive' | 'banned';

export interface User {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  archived: boolean; // new flag
}

export const USERS: User[] = [
  {
    id: 1,
    name: 'Abdullah Mishari',
    email: 'AbdullahSMishari@parts.admin.com',
    status: 'active',
    archived: false,
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@parts.com',
    status: 'banned',
    archived: false,
  },
  {
    id: 3,
    name: 'Carol Lee',
    email: 'carol@parts.com',
    status: 'inactive',
    archived: false,
  },
  {
    id: 4,
    name: 'Kareem',
    email: 'Kareem@parts.maintenance.com',
    status: 'active',
    archived: false,
  },

  // …add more if you like
];
