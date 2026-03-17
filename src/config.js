import fs from 'fs';
import process from 'node:process';
import pg from 'pg';

// Solo carga el .env si estás en local (desarrollo)
if (fs.existsSync('.env')) {
  process.loadEnvFile('.env');
}

// Configuración para Railway usando DATABASE_URL si existe
// pero dando prioridad a las variables individuales si existen (para tests)
const poolConfig = {
  // Si existen las variables individuales, úsalas
  ...(process.env.DBUSER && { user: process.env.DBUSER }),
  ...(process.env.DBHOST && { host: process.env.DBHOST }),
  ...(process.env.DBDATABASE && { database: process.env.DBDATABASE }),
  ...(process.env.DBPASSWORD && { password: process.env.DBPASSWORD }),
  ...(process.env.DBPORT && { port: parseInt(process.env.DBPORT) }),
  
  // Si no hay variables individuales pero sí DATABASE_URL (Railway), úsala
  ...((!process.env.DBUSER || !process.env.DBHOST) && process.env.DATABASE_URL && { 
    connectionString: process.env.DATABASE_URL 
  }),
  
  // Configuración SSL
  ssl: (process.env.DBHOST && process.env.DBHOST !== 'localhost') || process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
};

// Limpiar propiedades undefined
Object.keys(poolConfig).forEach(key => 
  poolConfig[key] === undefined && delete poolConfig[key]
);

// Si no hay user/configuración específica pero hay DATABASE_URL, asegurar connectionString
if (!poolConfig.user && !poolConfig.connectionString && process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
}

export const pool = new pg.Pool(poolConfig);
