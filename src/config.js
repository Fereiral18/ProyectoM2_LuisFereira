import fs from 'fs';
import process from 'node:process';
import pg from 'pg';

// Solo carga el .env si estás en local (desarrollo)
if (fs.existsSync('.env')) {
  process.loadEnvFile('.env');
}

// Usar DATABASE_URL si existe, sino usar variables individuales
const poolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false  // Railway requiere SSL
      }
    }
  : {
      user: process.env.DBUSER,
      host: process.env.DBHOST,
      database: process.env.DBDATABASE,
      password: process.env.DBPASSWORD,
      port: process.env.DBPORT,
      ssl: process.env.DBHOST !== 'localhost' ? { rejectUnauthorized: false } : false
    };

export const pool = new pg.Pool(poolConfig);
