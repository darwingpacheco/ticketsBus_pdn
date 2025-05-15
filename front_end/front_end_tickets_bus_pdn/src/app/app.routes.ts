import { Routes } from '@angular/router';
import { LoginComponentComponent } from './components/login/login-component/login-component.component';
import { CreateAccountComponentsComponent } from './components/createAccount/create-account-components/create-account-components.component';
import { MenuComponentComponent } from './components/menu-component/menu-component.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponentComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'register',
        component: CreateAccountComponentsComponent
      },
      {
        path: 'menu',
        component: MenuComponentComponent
      }
];
