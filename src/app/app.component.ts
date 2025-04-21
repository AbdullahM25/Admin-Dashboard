import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    DashboardComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private toast: ToastService) {}

  ngOnInit() {
    // this will fire as soon as the app loads
    this.toast.show('Welcome to Admin Dashboard!', 'success', 4000);
  }
}
