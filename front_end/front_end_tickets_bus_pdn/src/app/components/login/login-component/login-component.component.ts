import { HttpClientModule } from '@angular/common/http';
import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service.service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})

export class LoginComponentComponent {
  private authService = inject(AuthService);
  user = signal<any | null>(null);
    loginForm: FormGroup;
  
    constructor(private fb: FormBuilder, private userService: AuthService, private router: Router) {
      this.authService.getUser().subscribe(u => this.user.set(u));
      this.loginForm = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
      });
    }
  
    send() {
      console.log("presionaste login")
      console.log(this.loginForm.value)
      if (this.loginForm.valid) {
        this.userService.login(this.loginForm.value).subscribe(
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

    loginGoogle(event: Event){
      this.authService.loginWithGoogle()
        .then(userCredentials => {
          alert("Inicio de sesion exitoso ")
        })
        .catch(err => {
          alert("Ha ocurrido un error " + err)
        })
    }
  
    loginFacebook(){
      this.authService.loginWithFacebook()
        .then(userCredentials => {
          alert("Inicio de sesion exitoso ")
        })
        .catch(err => {
          alert("Ha ocurrido un error " + err)
        })
    }
  
  goToRegister(event: Event) {
    event.preventDefault(); 
    this.router.navigate(['/createAccount']);
  }
}
