import { Injectable, signal } from '@angular/core';
import { PRODUCTS, Product }  from '../data/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<Product[]>(PRODUCTS);
  readonly products    = this._products.asReadonly();
}
