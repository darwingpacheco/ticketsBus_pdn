import { Routes } from '@angular/router';
import { LoginComponentComponent } from './components/login/login-component/login-component.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponentComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      }
];
