import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../data/users';
import { Product } from '../data/products';

@Injectable({ providedIn: 'root' })
export class FormService {
  constructor(private fb: FormBuilder) {}

  /**
   * Builds a reactive FormGroup for adding or editing a User.
   * @param user Optional existing user to patch values.
   */
  buildUserForm(user?: Omit<User, 'id' | 'archived'>): FormGroup {
    return this.fb.group({
      name:  [user?.name  || '', [Validators.required, Validators.minLength(2)]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      status:[user?.status|| 'active', Validators.required]
    });
  }

  /**
   * Builds a reactive FormGroup for adding or editing a Product.
   * @param prod Optional existing product to patch values.
   */
  buildProductForm(prod?: Omit<Product, 'id' | 'archived'>): FormGroup {
    return this.fb.group({
      name:  [prod?.name  || '', Validators.required],
      stock: [prod?.stock ?? 0,   [Validators.required, Validators.min(0)]]
    });
  }
}
