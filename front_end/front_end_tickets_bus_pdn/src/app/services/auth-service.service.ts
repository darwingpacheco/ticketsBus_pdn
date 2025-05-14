import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, user, getAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private baseUrl = 'http://localhost:8080/api/users';
  private baseUrlFirebase = 'http://localhost:8080/tests/google';

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
<<<<<<< Updated upstream
=======

loginWithProvider(provider: string) {
  console.log('Iniciando login con proveedor:', provider);

  const auth = getAuth();
  let authProvider;

  switch (provider) {
    case 'google':
      authProvider = new GoogleAuthProvider();
      break;
    case 'facebook':
      authProvider = new FacebookAuthProvider();
      break;
    case 'github':
      authProvider = new GithubAuthProvider();
      break;
    default:
      console.error('Proveedor no soportado:', provider);
      throw new Error('Proveedor no soportado');
  }

  return signInWithPopup(auth, authProvider)
    .then(result => {
      console.log('Autenticación exitosa con Firebase:', result.user.email);
      return this.http.get<any[]>(`http://localhost:8080/tests/listUsersProvider/${provider}`).toPromise();
    })
    .then(data => {
      console.log('Respuesta del backend:', data);
      return data;
    })
    .catch(error => {
      console.error('Error en loginWithProvider:', error);
      throw error;
    });
}

  getFirebaseUsersByProvider(provider: string) {
  return this.http.get<any[]>(`http://localhost:8080/tests/listUsersProvider/${provider}`);
}
  
  getLocalUsers() {
    return this.http.get<any[]>('http://localhost:8080/api/users/allUsers');
  }
  
  deleteUser(document: string) {
    return this.http.delete(`http://localhost:8080/api/users/${document}`);
  }
>>>>>>> Stashed changes
}
