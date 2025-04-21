import { Component, computed, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../data/toast.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  toast = inject(ToastService);
  userSvc = inject(UserService);
  prodSvc = inject(ProductService);
  orders = 1234;
  revenue = 56789;

  totalUsers = computed(() => this.userSvc.users().length);
  totalProducts = computed(() => this.prodSvc.products().length);

  showProductToast() {
    this.toast.show('Here are your products!', 'neutral', 3000);
  }
}
