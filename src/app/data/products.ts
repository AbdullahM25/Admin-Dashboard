export interface Product {
  id: number;
  name: string;
  stock: number;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Motherboard', stock: 42 },
  { id: 2, name: 'AMD and Intel CPUs', stock: 20 },
  { id: 3, name: 'Mechanical Keyboards', stock: 0 },
  { id: 4, name: 'High‑End GPU', stock: 5 },
  { id: 5, name: 'Power Supply Unit', stock: 120 },
  { id: 6, name: 'Computer Accessories', stock: 400 },
  { id: 7, name: 'Computer Cases', stock: 19 },
];
