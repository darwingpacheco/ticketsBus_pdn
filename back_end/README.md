# ticketsBus_pdn

Sistema web para la venta de pasajes intermunicipales, desarrollado con Spring Boot y Angular.

## 🚀 Descripción del Proyecto

El objetivo de este proyecto es proporcionar una plataforma en línea para la compra de boletos de autobús intermunicipales, permitiendo a los usuarios autenticarse con Google y almacenar la información en una base de datos no relacional con MongoDB.

## 👥 Integrantes del Proyecto

- **Darwin Gómez** - 191967
- **Stefanny Paez**

## 🛠️ Tecnologías Utilizadas

| Tecnología  | Versión |
|-------------|---------|
| Java        | x.x.x   |
| Spring Boot | x.x.x   |
| Angular     | x.x.x   |
| Firebase    | x.x.x   |
| MongoDB     | x.x.x   |
| Node.js     | x.x.x   |

## 📌 Características Principales

- Autenticación con Google mediante Firebase.
- Compra de pasajes en línea.
- Gestión de horarios y rutas.
- Pago seguro y confirmación de boletos.
- Panel de administración para gestión de viajes y usuarios.

## 📁 Estructura del Proyecto

```bash
/ticketsBus_pdn
│── backend/      # Backend con Spring Boot
│── frontend/     # Frontend con Angular
│── docs/         # Documentación del proyecto
│── README.md     # Archivo de documentación principal
```

## 🔧 Instalación y Configuración

### Backend (Spring Boot)
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/usuario/ticketsBus_pdn.git
   ```
2. Acceder al directorio del backend:
   ```sh
   cd backend
   ```
3. Configurar el archivo `application.properties` con la conexión a MongoDB y Firebase.
4. Compilar y ejecutar el proyecto:
   ```sh
   mvn spring-boot:run
   ```

### Frontend (Angular)
1. Acceder al directorio del frontend:
   ```sh
   cd frontend
   ```
2. Instalar dependencias:
   ```sh
   npm install
   ```
3. Ejecutar la aplicación:
   ```sh
   ng serve
   ```

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|--------|---------|-------------|
| GET    | `/api/rutas` | Obtener todas las rutas |
| POST   | `/api/boletos` | Comprar un boleto |
| GET    | `/api/usuarios` | Obtener la información del usuario |

_(Próximamente se agregarán más detalles)_

## 📜 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto con los integrantes del proyecto.

