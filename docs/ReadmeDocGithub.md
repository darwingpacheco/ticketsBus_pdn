# 🔐 Sistema de Autenticación con GitHub

## 📋 Descripción General

Este proyecto implementa un sistema de autenticación completo con GitHub utilizando Firebase Auth en una aplicación Angular con backend Spring Boot. El sistema permite a los usuarios iniciar sesión con sus credenciales de GitHub, manejar casos de cuentas existentes con diferentes proveedores, y vincular múltiples métodos de autenticación.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│                 │ ──────────────► │                 │
│  Frontend       │                 │  Backend        │
│  (Angular)      │                 │  (Spring Boot)  │
│                 │ ◄────────────── │                 │
└─────────────────┘                 └─────────────────┘
         │                                   │
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│  Firebase Auth  │                 │ Firebase Admin  │
│  (Client SDK)   │                 │     (SDK)       │
└─────────────────┘                 └─────────────────┘
```

### 🎯 Componentes Principales

- **Frontend (Angular)**: Interfaz de usuario y lógica de autenticación
- **Backend (Spring Boot)**: API REST y verificación de tokens
- **Firebase Auth**: Proveedor de autenticación y gestión de usuarios
- **GitHub OAuth**: Proveedor de identidad para autenticación

## 🚀 Implementación del Frontend

### 📁 Estructura de Archivos

```
src/
├── app/
│   ├── services/
│   │   └── auth-service.service.ts
│   └── components/
│       └── login/
│           ├── login-component.component.html
│           └── login-component.component.ts
```

### 🔧 Configuración del Servicio de Autenticación

El servicio `AuthService` maneja toda la lógica de autenticación con GitHub:

```typescript
// Configuración de URLs del backend
private baseUrlGithub = 'http://localhost:8080/tests/github';

// Método principal de autenticación con GitHub
async loginWithGitHub() {
    // Obtiene la instancia de autenticación de Firebase
    const auth = getAuth();
    
    // Crea el proveedor de GitHub para la autenticación
    const provider = new GithubAuthProvider();
    
    // Añade el scope 'user:email' para obtener acceso al email del usuario
    // Esto es necesario porque GitHub no proporciona el email por defecto
    provider.addScope('user:email');
}
```

**📝 Explicación detallada:**
- `getAuth()`: Obtiene la instancia de Firebase Auth configurada en la aplicación
- `GithubAuthProvider()`: Crea un proveedor específico para autenticación con GitHub
- `addScope('user:email')`: Solicita permisos específicos a GitHub. Sin este scope, no podríamos acceder al email del usuario, que es fundamental para nuestro sistema

### 🔄 Flujo de Autenticación Básico

El proceso de autenticación sigue estos pasos:

1. **Popup de GitHub**: Se abre una ventana popup para que el usuario se autentique
2. **Obtención del Token**: Se obtiene el ID token de Firebase
3. **Envío al Backend**: El token se envía al backend para validación

```typescript
try {
    // Abre una ventana popup con el formulario de login de GitHub
    // El usuario ingresa sus credenciales de GitHub en esta ventana
    const result = await signInWithPopup(auth, provider);
    
    // Una vez autenticado exitosamente, obtenemos el ID token
    // Este token contiene información encriptada del usuario y es seguro
    // Firebase genera este token automáticamente después de la autenticación
    const idToken = await result.user.getIdToken();
    
    // Enviamos el token al backend Spring Boot para su validación
    // El backend verificará que el token sea válido y no haya expirado
    // También extraerá la información del usuario (email, UID, etc.)
    return this.http.post(this.baseUrlGithub, { token: idToken }).toPromise();
    
} catch (error) {
    // Si algo falla en cualquier paso, capturamos el error
    // Esto incluye: usuario cancela el popup, credenciales incorrectas,
    // problemas de red, tokens inválidos, etc.
    console.error('Error en el login con GitHub:', error);
    throw error;
}
```

**📊 Explicación paso a paso:**

1. **`signInWithPopup(auth, provider)`**: 
   - Abre una ventana emergente con la página de login de GitHub
   - El usuario ingresa sus credenciales directamente en GitHub (más seguro)
   - Firebase maneja toda la comunicación OAuth con GitHub

2. **`result.user.getIdToken()`**: 
   - Firebase genera un token JWT (JSON Web Token) único
   - Este token está firmado digitalmente y contiene la información del usuario
   - Es seguro enviarlo al backend porque solo Firebase puede verificarlo

3. **`this.http.post(...)`**: 
   - Realiza una petición HTTP POST al backend
   - Envía el token en el cuerpo de la petición
   - El backend verificará el token y responderá con información del usuario

### 🔗 Manejo de Cuentas Duplicadas

Una característica importante del sistema es el manejo de cuentas que ya existen con diferentes proveedores:

```typescript
// Este código se ejecuta cuando Firebase detecta que el email ya existe
// con un proveedor diferente (por ejemplo, ya se registró con Google)
if (error.code === 'auth/account-exists-with-different-credential') {
    
    // Extraemos la credencial pendiente de GitHub que falló
    // Esta credencial contiene la información de autenticación que intentamos usar
    const pendingCred = GithubAuthProvider.credentialFromError(error);
    
    // Obtenemos el email del error, que es el email que ya existe en el sistema
    const email = error.customData?.email;
    
    if (email) {
        // Consultamos a Firebase qué métodos de autenticación están 
        // ya vinculados a este email (google.com, github.com, etc.)
        const methods = await fetchSignInMethodsForEmail(auth, email);
        
        // Si encontramos que ya está registrado con Google
        if (methods.includes('google.com')) {
            
            // Creamos un proveedor de Google para la re-autenticación
            const googleProvider = new GoogleAuthProvider();
            
            try {
                // Primero, el usuario debe autenticarse con Google
                // Esto confirma que es el propietario de la cuenta existente
                const googleResult = await signInWithPopup(auth, googleProvider);
                
                // Ahora vinculamos la credencial de GitHub a la cuenta de Google
                // Esto permite que el usuario use tanto Google como GitHub
                if (pendingCred) {
                    const linkResult = await linkWithCredential(googleResult.user, pendingCred);
                    
                    // Obtenemos el nuevo token que incluye ambos proveedores
                    const idToken = await linkResult.user.getIdToken();
                    
                    // Enviamos el token actualizado al backend
                    return this.http.post(this.baseUrlGithub, { token: idToken }).toPromise();
                }
                
            } catch (linkError) {
                console.error('Error al vincular la cuenta de GitHub:', linkError);
                throw linkError;
            }
            
        } else {
            // Si el email está registrado con otro proveedor que no manejamos
            // (como  Twitter, etc.), mostramos un mensaje informativo
            console.warn(`El email ${email}, ya está registrado con otro proveedor: ${methods.join(', ')}`);
            throw new Error(`El email ${email} ya está registrado con otro proveedor.`);
        }
    }
}
```

### 🖱️ Integración en el Componente

En el HTML del componente de login:

```html
<!-- Botón de GitHub en la interfaz de usuario -->
<span (click)="loginGithub($event)" class="hidden-xs hidden-sm">GITHUB</span>
```

**En el componente TypeScript:**
```typescript
// Método que se ejecuta cuando el usuario hace clic en el botón de GitHub
loginGithub(event: Event) {
    // Previene el comportamiento por defecto del enlace
    event.preventDefault();
    
    // Llama al método de autenticación del servicio
    this.authService.loginWithGitHub()
        .then(response => {
            // Maneja la respuesta exitosa del backend
            console.log('Login exitoso:', response);
            // Aquí podrías redirigir al usuario o actualizar el estado de la aplicación
        })
        .catch(error => {
            // Maneja errores de autenticación
            console.error('Error en login:', error);
            // Mostrar mensaje de error al usuario
        });
}
```

## 🖥️ Implementación del Backend

### 📁 Estructura de Archivos

```
src/main/java/com/example/demo/
├── controllers/
│   └── controllerFirebase.java
└── services/
    └── FirebaseUserService.java
```

### 🎯 Controlador REST

El controlador `controllerFirebase` maneja las peticiones de autenticación:

```java
@PostMapping("/github")
public ResponseEntity<?> authenticateWithGitHub(@RequestBody TokenRequests tokenRequest) {
    
    // Logging para rastrear el inicio del proceso de autenticación
    logger.info(">>> Iniciando autenticación con GitHub...");
    
    // Log de debug que muestra el token recibido 
    // En producción, este log debería estar deshabilitado por seguridad
    logger.debug("Token recibido: {}", tokenRequest.getToken());

    try {
        // PASO CRÍTICO: Verificación del token con Firebase Admin SDK
        // FirebaseAuth.getInstance() obtiene la instancia del Admin SDK
        // verifyIdToken() verifica que el token sea válido, no haya expirado,
        // y haya sido firmado por Firebase
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(tokenRequest.getToken());
        
        // Extracción de información del usuario desde el token decodificado
        // UID: Identificador único del usuario en Firebase (nunca cambia)
        String uid = decodedToken.getUid();
        
        // Email: Dirección de correo del usuario obtenida de GitHub
        String email = decodedToken.getEmail();

        // Log confirmando la autenticación exitosa
        logger.info(">>> Usuario autenticado con GitHub. UID: {}, Email: {}", uid, email);

        // Creación de la respuesta exitosa
        Map<String, String> response = new HashMap<>();
        response.put("message", "Usuario autenticado con GitHub");
        response.put("email", email);
        // Nota: No incluimos el UID en la respuesta por seguridad
        // Solo lo usamos internamente y para logs

        // Retorna HTTP 200 (OK) con la información del usuario
        return ResponseEntity.ok(response);
        
    } catch (Exception e) {
        // Manejo de errores: token inválido, expirado, malformado, etc.
        logger.error(">>> Error al verificar token de GitHub: {}", e.getMessage(), e);
        
        // Respuesta de error estructurada
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Token inválido o expirado.");
        
        // Retorna HTTP 401 (Unauthorized) indicando falla de autenticación
        return ResponseEntity.status(401).body(errorResponse);
    }
}
```


### 📦 Manejo de Tokens

La clase `TokenRequests` encapsula el token recibido:

```java
// Clase DTO (Data Transfer Object) para recibir el token del frontend
class TokenRequests {
    private String token;
    
    // Getter: Permite acceder al token desde el controlador
    // Spring Boot usa este método durante la deserialización JSON
    public String getToken() { 
        return token; 
    }
    
    // Setter: Permite a Spring Boot asignar el valor del JSON al campo
    // Se ejecuta automáticamente cuando llega la petición HTTP
    public void setToken(String token) { 
        this.token = token; 
    }
}
```


**📊 Ejemplo de petición HTTP:**
```json
POST /tests/github
Content-Type: application/json

{
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4M2E5..."
}
```


### 👥 Listado de Usuarios por Proveedor

El sistema incluye funcionalidad para obtener usuarios filtrados por proveedor:

```java
@GetMapping("/listUsersProvider/{provider}")
public ResponseEntity<List<Map<String, Object>>> getUsersByProvider(@PathVariable String provider) {
    
    // Log de auditoría: registra qué proveedor se está consultando
    logger.info(">>> Endpoint /listUsersProvider/{} invocado", provider);

    try {
        // Delegamos la lógica de negocio al servicio especializado
        // Esto mantiene el controlador limpio y enfocado solo en manejar HTTP
        List<Map<String, Object>> filteredUsers = firebaseUserService.getUsersByProvider(provider);
        
        // Log de resultados para monitoreo y debugging
        logger.info(">>> Usuarios obtenidos: {}", filteredUsers);
        
        // Retorna HTTP 200 con la lista de usuarios encontrados
        return ResponseEntity.ok(filteredUsers);
        
    } catch (Exception e) {
        // Log detallado del error incluyendo el proveedor que causó el problema
        logger.error(">>> Error al obtener usuarios por proveedor '{}': {}", provider, e.getMessage(), e);
        
        // Retorna HTTP 500 (Internal Server Error)
        // No exponemos detalles del error al cliente por seguridad
        return ResponseEntity.internalServerError().build();
    }
}
```


**📋 Pasos detallados:**

1. **Usuario hace clic en "GITHUB"** en la interfaz
2. **Se abre popup de GitHub** para autenticación
3. **Usuario se autentica** en GitHub
4. **Firebase obtiene el ID token**
5. **Token se envía al backend** Spring Boot
6. **Backend verifica el token** con Firebase Admin SDK
7. **Se retorna respuesta** con información del usuario
8. **Frontend procesa la respuesta** y actualiza el estado de autenticación


### 🔧 Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication > Sign-in method > GitHub
3. Configurar OAuth App en GitHub Developer Settings
4. Agregar las credenciales de GitHub en Firebase

### 📦 Dependencias Frontend

```json
{
  "dependencies": {
    "@angular/fire": "^7.0.0",
    "firebase": "^9.0.0",
    "@angular/common": "^15.0.0"
  }
}
```

## 📚 Recursos Adicionales

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Spring Boot Security](https://spring.io/guides/gs/securing-web/)
- [Angular Fire](https://github.com/angular/angularfire)
