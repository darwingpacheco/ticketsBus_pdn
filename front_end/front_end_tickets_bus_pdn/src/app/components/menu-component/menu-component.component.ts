import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-component',
  standalone: true,
  imports: [ ReactiveFormsModule,  CommonModule, FormsModule],
  templateUrl: './menu-component.component.html',
  styleUrl: './menu-component.component.css'
})
export class MenuComponentComponent {
  selectedAuthMethod: string = 'google';
  users: any[] = [];

  constructor(private authService: AuthService) {}

  async login() {
    try {
      const response = await this.authService.loginWithProvider(this.selectedAuthMethod);
      this.users = response || [];
    } catch (error) {
      console.error('Error en login:', error);
    }
  }
  
onAuthMethodChange() {
  if (this.selectedAuthMethod === 'local') {
    this.authService.getLocalUsers().subscribe(users => this.users = users);
  } else {
    this.users = [];
  }
}


  deleteUser(document: string) {
    this.authService.deleteUser(document).subscribe(() => {
      this.users = this.users.filter(user => user.document !== document);
    });
  }

  editUser(user: any) {
    // Lógica para editar (puede abrir un modal, o formulario aparte)
    console.log('Editar usuario', user);
  }
}