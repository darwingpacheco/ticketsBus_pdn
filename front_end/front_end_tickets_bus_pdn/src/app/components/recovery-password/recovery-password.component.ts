import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.css'
})

export class RecoveryPasswordComponent {
email: string = '';
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.recoverPassword(this.email)
      .then(() => {
        this.successMessage = 'Correo de recuperación enviado. Revisa tu bandeja de entrada.';
      })
      .catch(error => {
        console.error(error);
        switch (error.code) {
          case 'auth/user-not-found':
            this.errorMessage = 'No hay ningún usuario con ese correo.';
            break;
          case 'auth/invalid-email':
            this.errorMessage = 'Correo electrónico inválido.';
            break;
          default:
            this.errorMessage = 'Ocurrió un error. Intenta nuevamente.';
            break;
        }
      });
  }
}

