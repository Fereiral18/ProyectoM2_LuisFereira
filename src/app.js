import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';  
import authorRoutes from './routes/authors.routes.js'
import postRoutes from './routes/post.routes.js'

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocs = (req, res, next) => {
  const swaggerDocument = YAML.load(join(__dirname, '../swagger/openapi.yaml'))
   return swaggerUi.setup(swaggerDocument)(req, res, next);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// Middlewares

console.log('Variables de entorno cargadas:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '✓ definida' : '✗ NO definida');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('Tipo de DB_PASSWORD:', typeof process.env.DB_PASSWORD);

// Usar rutas
app.use('/openapi', swaggerUi.serve, swaggerDocs);
app.use('/api/authors', authorRoutes);
app.use('/api/posts', postRoutes);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app