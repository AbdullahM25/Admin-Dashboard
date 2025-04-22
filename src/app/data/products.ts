export interface Product {
  id: number;
  name: string;
  stock: number;
  archived: boolean; // new flag
}

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Motherboard', stock: 42, archived: false },
  { id: 2, name: 'AMD and Intel CPUs', stock: 20, archived: false },
  { id: 3, name: 'Mechanical Keyboards', stock: 0, archived: false },
  { id: 4, name: 'High‑End GPU', stock: 5, archived: false },
  { id: 5, name: 'Power Supply Unit', stock: 120, archived: false },
  { id: 6, name: 'Computer Accessories', stock: 400, archived: false },
  { id: 7, name: 'Computer Cases', stock: 19, archived: false },
];
