export interface Product {
    id: number;
    name: string;
    stock: number;
  }
  
  export const PRODUCTS: Product[] = [
    { id: 1, name: "Gaming Motherboard",  stock: 42  },
    { id: 2, name: "Mech Keyboard",       stock: 0   },
    { id: 3, name: "High‑End GPU",        stock: 5   },
    { id: 4, name: "Power Supply Unit",   stock: 120 },
  ];
  