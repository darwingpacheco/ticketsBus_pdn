import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service.service';

@Component({
  selector: 'app-create-account-components',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule ],
  templateUrl: './create-account-components.component.html',
  styleUrl: './create-account-components.component.css'
})
export class CreateAccountComponentsComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  register() {
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
      alert('Formulario inválido');
    }
  }
}
