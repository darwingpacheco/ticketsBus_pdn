import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, user, getAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { fetchSignInMethodsForEmail, GithubAuthProvider, linkWithCredential } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';


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

  async loginWithGitHub() {
    const auth = getAuth();
    const provider = new GithubAuthProvider();
    provider.addScope('user:email');
  
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
  
      // Envía el token al backend
      return this.http.post(this.baseUrlGithub, { token: idToken }).toPromise();
  
    } catch (error: any) {
      // Si el correo ya existe con otro proveedor
      if (error.code === 'auth/account-exists-with-different-credential') {
        const pendingCred = GithubAuthProvider.credentialFromError(error);
        const email = error.customData?.email;
  
        if (email) {
          // Obtenemos los métodos de autenticación vinculados a ese correo
          const methods = await fetchSignInMethodsForEmail(auth, email);
  
          // Si ya se registró con Google
          if (methods.includes('google.com')) {
            const googleProvider = new GoogleAuthProvider();
  
            try {
              // Autenticamos con Google
              const googleResult = await signInWithPopup(auth, googleProvider);
  
              // Vinculamos la credencial pendiente (GitHub)
              if (pendingCred) {
               const linkResult = await linkWithCredential(googleResult.user, pendingCred);
  
  
                const idToken = await linkResult.user.getIdToken();
                return this.http.post(this.baseUrlGithub, { token: idToken }).toPromise();
              }
            } catch (linkError) {
              console.error('Error al vincular la cuenta de GitHub:', linkError);
              throw linkError;
            }
          } else {
            console.warn(`El email ${email} , ya está registrado con otro proveedor: ${methods.join(', ')}`);
            throw new Error(`El email ${email} ya está registrado con otro proveedor.`);
          }
        }
      }
  
      console.error('Error en el login con GitHub:', error);
      throw error;
    }
  }
  
  
    private baseUrlGithub = 'http://localhost:8080/tests/github';

  
}
