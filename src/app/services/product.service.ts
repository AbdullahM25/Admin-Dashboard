import { Injectable, signal, Signal } from '@angular/core';
import { PRODUCTS, Product }          from '../data/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<Product[]>(PRODUCTS);
  public readonly products: Signal<Product[]> = this._products.asReadonly();

  /** Add a brand‑new product (keeps the old behavior) */
  public addProduct(prod: Omit<Product, 'id'>): void {
    const current = this._products();
    const nextId = current.length > 0
      ? Math.max(...current.map(p => p.id)) + 1
      : 1;
    this._products.set([...current, { id: nextId, ...prod }]);
  }

  /**
   * Upsert: if a product with the same name exists (case‑insensitive),
   * increment its stock; otherwise, add a new product.
   */
  public upsertProduct(prod: Omit<Product, 'id'>): void {
    const current = this._products();
    const idx = current.findIndex(
      p => p.name.toLowerCase() === prod.name.toLowerCase()
    );

    if (idx > -1) {
      const existing = current[idx];
      const updated: Product = {
        ...existing,
        stock: existing.stock + prod.stock
      };
      const nextList = [...current];
      nextList[idx] = updated;
      this._products.set(nextList);
    } else {
      const nextId = current.length > 0
        ? Math.max(...current.map(p => p.id)) + 1
        : 1;
      this._products.set([...current, { id: nextId, ...prod }]);
    }
  }

  /**
   * Update: modify fields of an existing product by its ID.
   * E.g., change name and/or set stock to a new value.
   */
  public updateProduct(
    id: number,
    changes: Partial<Omit<Product, 'id'>>
  ): void {
    const list = this._products();
    const idx  = list.findIndex(p => p.id === id);
    if (idx < 0) return;

    const updated: Product = { ...list[idx], ...changes };
    const next: Product[] = [...list];
    next[idx] = updated;
    this._products.set(next);
  }
}
