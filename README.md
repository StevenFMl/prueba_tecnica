# Prueba Técnica — Gestión de Tareas

Aplicación fullstack de gestión de tareas con autenticación JWT, desarrollada como prueba técnica.

## Tecnologías

### Backend
- **NestJS** (Framework Node.js)
- **TypeORM** (ORM)
- **MySQL** (Base de datos, via XAMPP)
- **Passport + JWT** (Autenticación)
- **bcrypt** (Encriptación de contraseñas)
- **class-validator** (Validación de datos)
- **Jest** (Testing)

### Frontend
- **React 19** (Vite)
- **Axios** (Peticiones HTTP con interceptor Bearer)
- **Vitest + Testing Library** (Testing)

## Instrucciones de Instalación

### Requisitos previos
- Node.js v18+
- XAMPP con MySQL corriendo
- Crear base de datos `test_db` en phpMyAdmin

### Backend
```bash
cd backend
npm install
npm run start:dev
```
El servidor corre en `http://localhost:3000`. Las tablas se crean automáticamente (`synchronize: true`).

### Frontend
```bash
cd frontend
npm install
npm run dev
```
La app corre en `http://localhost:5173`.

### Tests
```bash
# Backend (Jest)
cd backend
npm test

# Frontend (Vitest)
cd frontend
npm test
```

## Endpoints de la API

### Auth (públicos)
| Método | Ruta             | Descripción              |
|--------|------------------|--------------------------|
| POST   | `/auth/register` | Registrar usuario        |
| POST   | `/auth/login`    | Login (devuelve JWT)     |

### Usuarios (protegido con JWT)
| Método | Ruta        | Descripción              |
|--------|-------------|--------------------------|
| GET    | `/users/me` | Perfil del usuario auth  |

### Tareas (protegidas con JWT)
| Método | Ruta          | Descripción                  |
|--------|---------------|------------------------------|
| GET    | `/tasks`      | Listar tareas del usuario    |
| GET    | `/tasks/:id`  | Obtener tarea por ID         |
| POST   | `/tasks`      | Crear tarea                  |
| PUT    | `/tasks/:id`  | Actualizar tarea             |
| DELETE | `/tasks/:id`  | Eliminar tarea (Soft Delete) |

## Payloads de ejemplo

### Registro
```json
POST /auth/register
{
  "name": "Juan",
  "email": "juan@email.com",
  "password": "123456"
}
```

### Login
```json
POST /auth/login
{
  "email": "juan@email.com",
  "password": "123456"
}
// Respuesta: { "access_token": "eyJhbG..." }
```

### Crear tarea
```json
POST /tasks
Authorization: Bearer <token>
{
  "title": "Mi primera tarea"
}
```

### Completar tarea
```json
PUT /tasks/1
Authorization: Bearer <token>
{
  "completed": true
}
```

## Base de Datos

### Diseño
- **users**: id, name, email (unique), password (bcrypt hash)
- **tasks**: id, title, completed, userId (FK → users), deletedAt (soft delete)

### Consultas SQL
Las consultas requeridas están en `database/queries.sql`:
1. Obtener tareas por usuario
2. Contar tareas completadas por usuario

## Estructura del Proyecto
```
prueba_tecnica/
├── backend/
│   └── src/
│       ├── auth/        # Módulo de autenticación (JWT, bcrypt)
│       ├── users/       # Módulo de usuarios
│       ├── tasks/       # Módulo de tareas (CRUD + Soft Delete)
│       ├── app.module.ts
│       └── main.ts
├── frontend/
│   └── src/
│       ├── App.tsx      # Componente principal (Register/Login/Tasks)
│       ├── api.ts       # Axios con interceptor Bearer
│       └── Login.test.tsx
├── database/
│   └── queries.sql      # DDL + consultas requeridas
└── README.md
```
