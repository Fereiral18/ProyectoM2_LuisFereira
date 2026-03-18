...
# API REST - Gestión de Autores y Posts

API RESTful desarrollada con Node.js, Express y PostgreSQL para la gestión de autores y publicaciones. Diseñada para ser desplegada en Railway.

## 📋 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **PostgreSQL** - Base de datos relacional
- **node-postgres (pg)** - Cliente PostgreSQL
- **Vitest** - Framework de testing
- **Swagger** - Documentación de API
- **Railway** - Plataforma de despliegue

## 📁 Estructura del Proyecto
```bash

ProyectoM2_LuisFereira/
├── .env.example                  # Variables de entorno de ejemplo
├── .gitignore                    # Ignora node_modules, .env, etc
├── package.json                  # Dependencias y scripts
├── package-lock.json             # Versiones exactas de dependencias
├── README.md                     # Documentación del proyecto
├── db/
│   ├── schema.sql                # CREATE TABLE + constraints (FKs, índices)
│   └── seed.sql                  # INSERT de prueba para autores y posts
├── src/
│   ├── app.js                    # Configuración de Express y middlewares globales
│   ├── server.js                 # Arranca el servidor (listen)
│   ├── config.js                 # Pool de PostgreSQL usando variables de entorno
│   ├── routes/
│   │   ├── authors.routes.js     # Rutas CRUD para autores
│   │   └── post.routes.js        # Rutas CRUD para posts
│   ├── controllers/
│   │   ├── authorControllers.js  # Manejadores de peticiones de autores
│   │   ├── postControllers.js    # Manejadores de peticiones de posts
│   │   └── index.js              # Exportación centralizada de controladores
│   ├── services/
│   │   ├── authors_services.js   # Lógica de negocio y consultas SQL de autores
│   │   └── post_services.js      # Lógica de negocio y consultas SQL de posts
│   └── middleware/
│       └── validationMiddleware.js # Validación de datos de entrada
├── test/
│   ├── unit/                     # Tests unitarios
│   │   └── servicesAuthors.test.js # Tests de servicios de autores
│   ├── services/                  # Tests de servicios
│   │   ├── authors_services.test.js
│   │   └── posts_services.test.js
│   ├── middleware/
│   │   └── validationMiddleware.test.js # Tests de validaciones
│   └── setup.js                   # Configuración global para tests
├── swagger/                       # Documentación OpenAPI/Swagger
│   └── openapi.yaml               # Especificación de la API
└── docs/                          # Documentación adicional (opcional)
```
## 🚀 Configuración Local

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

### Pasos de Instalación

```bash
1. **Clonar el repositorio**
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
Instalar dependencias

bash
npm install
Configurar variables de entorno

bash
cp .env.example .env
Edita el archivo .env con tus credenciales locales:

env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_bd
Crear la base de datos

bash
# Accede a PostgreSQL
psql -U postgres

# Crea la base de datos
CREATE DATABASE nombre_bd;

# Sal de psql
\q

# Ejecuta los scripts de creación y seed desde la carpeta db
psql -U postgres -d nombre_bd -f db/schema.sql
psql -U postgres -d nombre_bd -f db/seed.sql
Iniciar el servidor

bash
# Modo desarrollo (con hot-reload)
npm run dev

# Modo producción
npm start
El servidor estará disponible en http://localhost:3000
```
📚 Documentación de la API (Swagger)
```bash
La documentación interactiva de la API está disponible a través de Swagger UI:

URL local: http://localhost:3000/api-docs

Archivo OpenAPI: /swagger/openapi.yaml

Endpoints Principales
Autores
GET /api/authors - Obtener todos los autores

GET /api/authors/:id - Obtener autor por ID

POST /api/authors - Crear nuevo autor

PUT /api/authors/:id - Actualizar autor

DELETE /api/authors/:id - Eliminar autor

Posts
GET /api/posts - Obtener todos los posts

GET /api/posts/:id - Obtener post por ID

GET /api/authors/:authorId/posts - Obtener posts de un autor

POST /api/posts - Crear nuevo post

PUT /api/posts/:id - Actualizar post

DELETE /api/posts/:id - Eliminar post

Ejemplos de Uso
Crear autor:

bash
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Gabriel García Márquez", "email": "gabo@example.com", "bio": "Escritor colombiano"}'
Crear post:

bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Cien años de soledad", "content": "Muchos años después...", "author_id": 1}'
```
🧪 Tests
```bash
El proyecto utiliza Vitest para pruebas unitarias y de integración.

Estructura de Tests
text
test/
├── middleware/
│   └── validationMiddleware.test.js  # Tests de validaciones
├── services/
│   ├── authors_services.test.js      # Tests de servicios de autores
│   └── posts_services.test.js        # Tests de servicios de posts
├── unit/
│   └── servicesAuthors.test.js       # Tests unitarios adicionales
└── setup.js                          # Configuración global de tests
Ejecutar tests
bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ver cobertura de tests
npm run test:coverage

# Ejecutar tests específicos
npm test -- test/services/authors_services.test.js
Tests Implementados
✅ CRUD de autores

✅ CRUD de posts

✅ Validaciones de datos (middleware)

✅ Manejo de errores

✅ Relaciones entre tablas

✅ Casos borde y validaciones
```
🗄️ Esquema de Base de Datos
Archivo: db/schema.sql
sql
-- Tabla de autores
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_authors_email ON authors(email);

-- Tabla de posts
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_author_id ON posts(author_id);
Archivo: db/seed.sql
sql
-- Datos de prueba
INSERT INTO authors (name, email, bio) VALUES
    ('Autor 1', 'autor1@example.com', 'Bio del autor 1'),
    ('Autor 2', 'autor2@example.com', 'Bio del autor 2');

INSERT INTO posts (title, content, author_id) VALUES
    ('Post 1', 'Contenido del post 1', 1),
    ('Post 2', 'Contenido del post 2', 1),
    ('Post 3', 'Contenido del post 3', 2);
🚢 Despliegue en Railway
```bash
Pasos para el deploy
Preparar el proyecto

Verifica que package.json tenga el script start configurado

Asegúrate que server.js es el punto de entrada

Crear cuenta en Railway

Regístrate en railway.app

Desplegar

Opción A: Usando GitHub

Conecta tu repositorio a Railway

Railway detectará automáticamente Node.js

Añade una base de datos PostgreSQL desde el dashboard

Configura las variables de entorno

Opción B: Usando CLI

bash
npm install -g @railway/cli
railway login
railway init
railway add postgresql
railway up
Variables de Entorno en Railway
Configura estas variables en el dashboard:

env
NODE_ENV=production
PORT=3000
DB_HOST=postgres.railway.internal
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=generado_por_railway
DB_NAME=railway
🛠️ Scripts Disponibles
bash
# Desarrollo
npm run dev           # Inicia servidor con nodemon
npm start             # Inicia servidor en producción

# Tests
npm test              # Ejecuta tests
npm run test:watch    # Tests en modo watch
npm run test:coverage # Tests con cobertura

# Base de datos
npm run db:create     # Crea la base de datos
npm run db:migrate    # Ejecuta schema.sql
npm run db:seed       # Ejecuta seed.sql
npm run db:reset      # Resetea la base de datos
🔒 Middleware de Validación
El proyecto incluye un middleware de validación (validationMiddleware.js) que verifica:

Autores: nombre requerido, email válido y único

Posts: título y contenido requeridos, author_id válido

IDs: validación de parámetros numéricos

Datos de entrada: sanitización básica
```
📊 Cobertura de Tests
Los tests cubren:

Servicios: 90%+ cobertura

Middleware: 95%+ cobertura

Casos de error: Manejo de excepciones

Validaciones: Datos inválidos y bordes

🔐 Buenas Prácticas Implementadas
✅ Variables de entorno para configuración

✅ Validación de datos de entrada (middleware)

✅ Manejo centralizado de errores

✅ Códigos HTTP apropiados

✅ Tests unitarios y de integración

✅ Documentación Swagger/OpenAPI

✅ Gitignore para archivos sensibles

✅ Scripts SQL versionados

✅ Separación de concerns (controllers, services, routes)

📝 Notas Importantes
Seguridad: Nunca subas archivos .env al repositorio

Base de datos: Los scripts SQL están en db/ para fácil versionado

Tests: Ejecuta siempre los tests antes de hacer deploy

Documentación: Mantén actualizada la documentación Swagger

Railway: La plataforma provee SSL automático y backups
🤝 Contribución
```bash
Fork el proyecto

Crea tu rama (git checkout -b feature/NuevaCaracteristica)

Commit tus cambios (git commit -m 'Add nueva característica')

Push a la rama (git push origin feature/NuevaCaracteristica)

Abre un Pull Request

📄 Licencia
ISC

📧 Contacto
Para preguntas o soporte, contacta al equipo de desarrollo.
```