import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../data/users';
import { Product } from '../../data/products';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  // services
  userSvc = inject(UserService);
  prodSvc = inject(ProductService);
  toast = inject(ToastService);

  // stats
  orders = 1234;
  revenue = 56789;

  // only non‑archived counts
  totalUsers = computed(() => this.userSvc.activeUsers().length);
  totalProducts = computed(() => this.prodSvc.activeProducts().length);

  // form models now omit both 'id' and 'archived'
  newUser: Omit<User, 'id' | 'archived'> = {
    name: '',
    email: '',
    status: 'active',
  };
  newProduct: Omit<Product, 'id' | 'archived'> = { name: '', stock: 0 };

  // edit state
  editingUserId?: number;
  editingProductId?: number;

  // CREATE or UPDATE User
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

  // CREATE or UPDATE Product
  createProduct() {
    if (this.editingProductId) {
      this.saveProduct();
      return;
    }
    this.prodSvc.upsertProduct(this.newProduct);
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

  // SOFT DELETE (archive)
  deleteUser(id: number) {
    this.userSvc.deleteUser(id);
    this.toast.show('User deleted (archived)', 'warning', 2500);
  }

  deleteProduct(id: number) {
    this.prodSvc.deleteProduct(id);
    this.toast.show('Product deleted (archived)', 'warning', 2500);
  }

  // Toast helper
  showProductToast() {
    this.toast.show('Here are your products!', 'neutral', 3000);
  }
}
