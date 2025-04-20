import { Component } from '@angular/core';
import { SidebarComponent }   from './components/sidebar/sidebar.component';
import { HeaderComponent }    from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    DashboardComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
