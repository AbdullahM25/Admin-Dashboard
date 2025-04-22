import { Injectable, signal, Signal, computed } from '@angular/core';
import { PRODUCTS, Product } from '../data/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<Product[]>(PRODUCTS);
  public readonly products: Signal<Product[]> = this._products.asReadonly();

  /** Only non‑archived products */
  public readonly activeProducts = computed(() =>
    this._products().filter((p) => !p.archived)
  );

  /** Add a brand‑new product */
  public addProduct(prod: Omit<Product, 'id' | 'archived'>): void {
    const current = this._products();
    const nextId =
      current.length > 0 ? Math.max(...current.map((p) => p.id)) + 1 : 1;
    this._products.set([...current, { ...prod, id: nextId, archived: false }]);
  }

  /** Upsert: bump stock or add new */
  public upsertProduct(prod: Omit<Product, 'id' | 'archived'>): void {
    const current = this._products();
    const idx = current.findIndex(
      (p) => p.name.toLowerCase() === prod.name.toLowerCase()
    );

    if (idx > -1) {
      const existing = current[idx];
      const updated: Product = {
        ...existing,
        stock: existing.stock + prod.stock,
      };
      const nextList = [...current];
      nextList[idx] = updated;
      this._products.set(nextList);
    } else {
      this.addProduct(prod);
    }
  }

  /**
   * Update any fields (including `archived`) of an existing product.
   * Note: we omit only the `id` key so `archived` is allowed.
   */
  public updateProduct(
    id: number,
    changes: Partial<Omit<Product, 'id'>>
  ): void {
    const list = this._products();
    const idx = list.findIndex((p) => p.id === id);
    if (idx < 0) return;

    const updated: Product = { ...list[idx], ...changes };
    const next: Product[] = [...list];
    next[idx] = updated;
    this._products.set(next);
  }

  /** Soft‑delete (archive) */
  public deleteProduct(id: number): void {
    this.updateProduct(id, { archived: true });
  }

  /** Restore from archive */
  public restoreProduct(id: number): void {
    this.updateProduct(id, { archived: false });
  }
}
