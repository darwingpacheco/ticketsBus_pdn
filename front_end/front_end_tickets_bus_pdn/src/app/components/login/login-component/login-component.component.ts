import { Component } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})

export class LoginComponentComponent {
  constructor(
    private router: Router
  ) {}
  goToRegister(event: Event) {
    event.preventDefault();
    this.router.navigate(['/register']);
  }
}




