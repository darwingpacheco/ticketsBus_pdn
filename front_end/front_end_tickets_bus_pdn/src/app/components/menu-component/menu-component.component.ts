import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

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

onAuthMethodChange() {
  if (this.selectedAuthMethod === 'local') {
    this.authService.getLocalUsers().subscribe(users => this.users = users);
  } else {
    this.authService.getUsersByProvider(this.selectedAuthMethod).subscribe(
      users => this.users = users,
      error => {
        console.error('Error al obtener usuarios por proveedor:', error);
        this.users = [];
      }
    );
  }
}


  deleteUser(document: string) {
    this.authService.deleteUser(document).subscribe(() => {
      this.users = this.users.filter(user => user.document !== document);
    });
  }

  editingUser: any = null;

editUser(user: any) {
  this.editingUser = user; // No hagas copia
}

cancelEdit() {
  this.editingUser = null;
  this.onAuthMethodChange(); // recarga usuarios para descartar cambios
}

saveUser(user: any) {
  this.authService.updateUser(user).subscribe(
    updatedUser => {
      this.editingUser = null;
      this.onAuthMethodChange(); // recarga lista
    },
    error => {
      console.error('Error al actualizar el usuario:', error);
    }
  );
}

}