import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule }                        from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FilterPipe }                          from '../../pipes/filter.pipe';
import { UserService }                         from '../../services/user.service';
import { ProductService }                      from '../../services/product.service';
import { ToastService }                        from '../../services/toast.service';
import { FormService }                         from '../../services/form.service';
import { ActivatedRoute, Router, RouterModule }from '@angular/router';
import { User }                                from '../../data/users';
import { Product }                             from '../../data/products';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FilterPipe,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private formSvc = inject(FormService);

  userSvc    = inject(UserService);
  prodSvc    = inject(ProductService);
  toast      = inject(ToastService);

  orders     = 1234;
  revenue    = 56789;

  totalUsers    = computed(() => this.userSvc.activeUsers().length);
  totalProducts = computed(() => this.prodSvc.activeProducts().length);

  userForm!: FormGroup;
  productForm!: FormGroup;

  editingUserId?: number;
  editingProductId?: number;

  userSearchTerm     = '';
  userStatusFilter   = '';
  productSearchTerm  = '';
  productStockFilter = '';

  ngOnInit() {
    // initialize filters from URL
    this.route.queryParams.subscribe(params => {
      this.userSearchTerm     = params['userSearch']   ?? '';
      this.userStatusFilter   = params['userStatus']   ?? '';
      this.productSearchTerm  = params['prodSearch']   ?? '';
      this.productStockFilter = params['prodStock']    ?? '';
    });

    // initialize reactive forms
    this.userForm    = this.formSvc.buildUserForm();
    this.productForm = this.formSvc.buildProductForm();
  }

  updateQueryParams() {
    this.router.navigate([], {
      queryParams: {
        userSearch:   this.userSearchTerm     || null,
        userStatus:   this.userStatusFilter   || null,
        prodSearch:   this.productSearchTerm  || null,
        prodStock:    this.productStockFilter || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  createUser() {
    if (this.editingUserId) {
      this.saveUser();
      return;
    }
    this.userSvc.addUser(this.userForm.value);
    this.toast.show('User added!', 'success', 2500);
    this.userForm = this.formSvc.buildUserForm();
  }

  startEditUser(u: User) {
    this.editingUserId = u.id;
    this.userForm = this.formSvc.buildUserForm({
      name: u.name,
      email: u.email,
      status: u.status,
    });
  }

  saveUser() {
    if (!this.editingUserId) return;
    this.userSvc.updateUser(this.editingUserId, this.userForm.value);
    this.toast.show('User updated!', 'success', 2500);
    this.cancelEditUser();
  }

  cancelEditUser() {
    this.editingUserId = undefined;
    this.userForm      = this.formSvc.buildUserForm();
  }

  createProduct() {
    if (this.editingProductId) {
      this.saveProduct();
      return;
    }
    const { name, stock } = this.productForm.value;
    this.prodSvc.addStock(name, stock);
    this.toast.show('Product added/updated!', 'success', 2500);
    this.productForm = this.formSvc.buildProductForm();
  }

  startEditProduct(p: Product) {
    this.editingProductId = p.id;
    this.productForm = this.formSvc.buildProductForm({
      name: p.name,
      stock: p.stock,
    });
  }

  saveProduct() {
    if (!this.editingProductId) return;
    this.prodSvc.updateProduct(this.editingProductId, this.productForm.value);
    this.toast.show('Product updated!', 'success', 2500);
    this.cancelEditProduct();
  }

  cancelEditProduct() {
    this.editingProductId = undefined;
    this.productForm      = this.formSvc.buildProductForm();
  }

  deleteUser(id: number) {
    this.userSvc.deleteUser(id);
    this.toast.show('User deleted (archived)', 'warning', 2500);
  }

  deleteProduct(id: number) {
    this.prodSvc.deleteProduct(id);
    this.toast.show('Product deleted (archived)', 'warning', 2500);
  }

  showProductToast() {
    this.toast.show('Here are your products!', 'neutral', 3000);
  }
}
