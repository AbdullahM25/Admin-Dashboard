import { Component, computed }       from '@angular/core';
import { UserService }               from '../../services/user.service';
import { ProductService }            from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  orders   = 1234;
  revenue  = 56789;

  totalUsers    = computed(() => this.userSvc.users().length);
  totalProducts = computed(() => this.prodSvc.products().length);

  constructor(
    public userSvc: UserService,
    public prodSvc: ProductService
  ) {}
}
