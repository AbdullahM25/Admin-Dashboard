import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule }                        from '@angular/common';
import { FormsModule }                         from '@angular/forms';
import { FilterPipe }                          from '../../pipes/filter.pipe';
import { UserService }                         from '../../services/user.service';
import { ProductService }                      from '../../services/product.service';
import { ToastService }                        from '../../services/toast.service';
import { ActivatedRoute, Router, RouterModule }from '@angular/router';
import { User }                                from '../../data/users';
import { Product }                             from '../../data/products';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  userSvc = inject(UserService);
  prodSvc = inject(ProductService);
  toast   = inject(ToastService);

  orders  = 1234;
  revenue = 56789;

  totalUsers    = computed(() => this.userSvc.activeUsers().length);
  totalProducts = computed(() => this.prodSvc.activeProducts().length);

  newUser: Omit<User, 'id' | 'archived'>       = { name: '', email: '', status: 'active' };
  newProduct: Omit<Product, 'id' | 'archived'> = { name: '', stock: 0 };

  editingUserId?: number;
  editingProductId?: number;

  userSearchTerm     = '';
  userStatusFilter   = '';
  productSearchTerm  = '';
  productStockFilter = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userSearchTerm     = params['userSearch']   ?? '';
      this.userStatusFilter   = params['userStatus']   ?? '';
      this.productSearchTerm  = params['prodSearch']   ?? '';
      this.productStockFilter = params['prodStock']    ?? '';
    });
  }

  updateQueryParams() {
    this.router.navigate([], {
      queryParams: {
        userSearch:   this.userSearchTerm     || null,
        userStatus:   this.userStatusFilter   || null,
        prodSearch:   this.productSearchTerm  || null,
        prodStock:    this.productStockFilter || null
      },
      queryParamsHandling: 'merge'
    });
  }

  createUser() {
    if (this.editingUserId) {
      this.saveUser();
      return;
    }
    this.userSvc.addUser(this.newUser);
    this.toast.show('User added!', 'success', 2500);
    this.newUser = { name: '', email: '', status: 'active' };
  }

  startEditUser(u: User) {
    this.editingUserId = u.id;
    this.newUser = { name: u.name, email: u.email, status: u.status };
  }

  saveUser() {
    if (!this.editingUserId) return;
    this.userSvc.updateUser(this.editingUserId, this.newUser);
    this.toast.show('User updated!', 'success', 2500);
    this.cancelEditUser();
  }

  cancelEditUser() {
    this.editingUserId = undefined;
    this.newUser = { name: '', email: '', status: 'active' };
  }

  createProduct() {
    if (this.editingProductId) {
      this.saveProduct();
      return;
    }
    this.prodSvc.addStock(this.newProduct.name, this.newProduct.stock);
    this.toast.show('Product added/updated!', 'success', 2500);
    this.newProduct = { name: '', stock: 0 };
  }

  startEditProduct(p: Product) {
    this.editingProductId = p.id;
    this.newProduct = { name: p.name, stock: p.stock };
  }

  saveProduct() {
    if (!this.editingProductId) return;
    this.prodSvc.updateProduct(this.editingProductId, {
      name: this.newProduct.name,
      stock: this.newProduct.stock,
    });
    this.toast.show('Product updated!', 'success', 2500);
    this.cancelEditProduct();
  }

  cancelEditProduct() {
    this.editingProductId = undefined;
    this.newProduct = { name: '', stock: 0 };
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
