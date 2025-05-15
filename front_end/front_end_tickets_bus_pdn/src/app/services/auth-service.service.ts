import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut, user, getAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private baseUrl = 'http://localhost:8080/api/users';
  private baseUrlFirebase = 'http://localhost:8080/tests/google';
   private baseUrlFirebaseFacebook = 'http://localhost:8080/tests/facebook';

  constructor(private http: HttpClient) { }

  async loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // Obtiene el token de Firebase

      // Envía el token al backend
      return this.http.post(this.baseUrlFirebase, { token: idToken }).toPromise();
    } catch (error) {
      console.error('Error en el login con Google', error);
      throw error;
    }
  }

  async loginWithFacebook() {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // Obtiene el token de Firebase

      // Envía el token al backend
      return this.http.post(this.baseUrlFirebaseFacebook, { token: idToken }).toPromise();
    } catch (error) {
      console.error('Error en el login con Facebook', error);
      throw error;
    }
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getUser(): Observable<any> {
    return user(this.auth);
  }

  register(user: any) {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

}
