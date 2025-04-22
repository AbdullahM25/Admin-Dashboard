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

  /** Map specific model names → parent category IDs */
  private readonly modelCategoryMap: Record<string, number> = {
    // Motherboards (id: 1)
    'asus prime z790-a': 1,
    'gigabyte aorus b550': 1,
    'msi mpg x570': 1,
    'asus tuf b660m': 1,
    // CPUs (id: 2)
    'intel i7-13700k': 2,
    'amd ryzen 9 5900x': 2,
    'intel i5-12600k': 2,
    // Mechanical Keyboards (id: 3)
    'corsair k95': 3,
    'logitech g915': 3,
    // GPUs (id: 4)
    'nvidia rtx 3080': 4,
    'amd radeon 6900 xt': 4,
    // Power Supplies (id: 5)
    'corsair rm750': 5,
    'seasonic foco gx-750': 5,
    // Accessories (id: 6)
    'logitech g502': 6,
    'razer deathadder': 6,
    'steelseries qck': 6,
    // Cases (id: 7)
    'nzxt h510': 7,
    'corsair 4000d': 7,
  };

  /**
   * Increment stock by a model or category name.
   * 1) Exact model match
   * 2) Prefix model match (if only one)
   * 3) Exact category name match
   * 4) Prefix category name match (if only one)
   * 5) Otherwise create a new category
   */
  public addStock(name: string, amount: number): void {
    const key = name.trim().toLowerCase();

    // 1) Exact model
    let categoryId = this.modelCategoryMap[key];

    // 2) Prefix model
    if (!categoryId) {
      const modelMatches = Object.keys(this.modelCategoryMap).filter((k) =>
        k.startsWith(key)
      );
      if (modelMatches.length === 1) {
        categoryId = this.modelCategoryMap[modelMatches[0]];
      }
    }

    if (categoryId) {
      this.changeStock(categoryId, amount);
      return;
    }

    const list = this._products();

    // 3) Exact category name
    let idx = list.findIndex((p) => p.name.toLowerCase() === key);
    if (idx > -1) {
      this.changeStock(list[idx].id, amount);
      return;
    }

    // 4) Prefix category name
    const catMatches = list
      .map((p) => p.name.toLowerCase())
      .filter((n) => n.startsWith(key));
    if (catMatches.length === 1) {
      idx = list.findIndex((p) => p.name.toLowerCase() === catMatches[0]);
      this.changeStock(list[idx].id, amount);
      return;
    }

    // 5) No match → new category
    this.createCategory(name, amount);
  }

  /** Create a new product category with initial stock */
  private createCategory(name: string, stock: number): void {
    const list = this._products();
    const nextId = list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;
    this._products.set([...list, { id: nextId, name, stock, archived: false }]);
  }

  /** Adjust stock on an existing category by delta */
  private changeStock(id: number, delta: number): void {
    const list = this._products();
    const idx = list.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const updated: Product = {
      ...list[idx],
      stock: list[idx].stock + delta,
    };
    const newList = [...list];
    newList[idx] = updated;
    this._products.set(newList);
  }

  /** Update any fields (including archived) of an existing product */
  public updateProduct(
    id: number,
    changes: Partial<Omit<Product, 'id'>>
  ): void {
    const list = this._products();
    const idx = list.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const updated = { ...list[idx], ...changes };
    const newList = [...list];
    newList[idx] = updated;
    this._products.set(newList);
  }

  /** Soft‑delete (mark archived) */
  public deleteProduct(id: number): void {
    this.updateProduct(id, { archived: true });
  }

  /** Restore an archived product */
  public restoreProduct(id: number): void {
    this.updateProduct(id, { archived: false });
  }
}
