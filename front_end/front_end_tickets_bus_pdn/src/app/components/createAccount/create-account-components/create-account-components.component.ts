import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-account-components',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule ],
  templateUrl: './create-account-components.component.html',
  styleUrl: './create-account-components.component.css'
})
export class CreateAccountComponentsComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: AuthService, private location: Location) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      document: ['', Validators.required],
      phone: ['', Validators.required],
    },
    { validator: this.passwordsMatchValidator }
   );
  }

  passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordValidators : true };
  }

  validatePassword() {
    console.log("presionaste agregar");
    console.log("registerForm", this.registerForm.value);
    console.log("Formulario válido:", this.registerForm.valid);

    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe(
        response => {
          alert('Registro exitoso');
        },
        error => {
          alert('Error al registrar usuario: ' + error.error);
        }
      );
    } else {
      if (this.registerForm.errors?.['passwordValidators']) {
        alert('Las contraseñas no coinciden');
      } else {
        alert('Formulario inválido');
      }
    }
  }

  goBack() {
    this.location.back(); // Regresa a la página anterior
  }
}
