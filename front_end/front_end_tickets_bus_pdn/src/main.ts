import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponentComponent } from './app/components/login/login-component/login-component.component';
import { CreateAccountComponentsComponent } from './app/components/createAccount/create-account-components/create-account-components.component';
import { environment } from './environments/environments';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { MenuComponentComponent } from './app/components/menu-component/menu-component.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

import { importProvidersFrom } from '@angular/core';

  const routes: Routes = [
    { path: 'login', component: LoginComponentComponent },
    { path: 'createAccount', component: CreateAccountComponentsComponent },
    { path: 'menu', component: MenuComponentComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  ];
  
bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(ReactiveFormsModule),
  ],
}).catch(err => console.error(err));
