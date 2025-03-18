import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponentComponent } from './app/components/login/login-component/login-component.component';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateAccountComponentsComponent } from './app/components/createAccount/create-account-components/create-account-components.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


  const routes: Routes = [
    { path: 'login', component: LoginComponentComponent },
    { path: 'createAccount', component: CreateAccountComponentsComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  ];
  
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(),
      importProvidersFrom( ReactiveFormsModule),
    
    ]
  }).catch(err => console.error(err));