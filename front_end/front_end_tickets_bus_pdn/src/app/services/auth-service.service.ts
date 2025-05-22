import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { fetchSignInMethodsForEmail, linkWithCredential } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { serverTimestamp } from '@angular/fire/firestore';

import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signOut,
  user,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getAuth
} from '@angular/fire/auth';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  Firestore,
  doc,
  setDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private baseUrl = 'http://localhost:8080/api/users';
  private baseUrlFirebase = 'http://localhost:8080/tests/google';
  private baseUrlGithub = 'http://localhost:8080/tests/github';

  constructor(private http: HttpClient) {}

  // Login con Google usando popup y envía token al backend
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(this.auth, provider);
      const idToken = await result.user.getIdToken();

      return this.http.post(this.baseUrlFirebase, { token: idToken }).toPromise();
    } catch (error) {
      console.error('Error en el login con Google', error);
      throw error;
    }
  }

  // Logout
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Observable del usuario autenticado
  getUser(): Observable<any> {
    return user(this.auth);
  }

register(userData: any): Observable<any> {
  const { email, password, name, last_name, document, phone } = userData;

  const promise = createUserWithEmailAndPassword(this.auth, email, password)
    .then(async (userCredential) => {
      const uid = userCredential.user?.uid;
      if (!uid) throw new Error('UID no disponible');

      try {
        await setDoc(doc(this.firestore, 'users', uid), {
          name,
          last_name,
          email,
          document,
          phone,
          createdAt: serverTimestamp(),
        });
      } catch (firestoreError) {
        console.error('Firestore setDoc error:', firestoreError);
        throw firestoreError;
      }

      return { success: true };
    });

  return from(promise);
}

  // Login con email y contraseña
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Enviar correo para recuperar contraseña
  sendPasswordResetEmail(email: string): Observable<any> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  // Obtener usuarios por proveedor
  getUsersByProvider(provider: string) {
    return this.http.get<any[]>(`http://localhost:8080/tests/listUsersProvider/${provider}`);
  }

  getFirebaseUsersByProvider(provider: string) {
    return this.http.get<any[]>(`http://localhost:8080/tests/listUsersProvider/${provider}`);
  }

  // Obtener todos los usuarios locales
  getLocalUsers() {
    return this.http.get<any[]>(`http://localhost:8080/tests/allUsers`);
  }

  // Eliminar usuario por documento
  deleteUser(document: string) {
    return this.http.delete(`${this.baseUrl}/${document}`);
  }

  // Actualizar usuario
  updateUser(user: any) {
    return this.http.put(`${this.baseUrl}/${user.document}`, user);
  }

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
  
  
    

}
