import pg from 'pg';
import dotenv from 'dotenv'
import { existsSync } from 'node:fs';

const { Pool } = pg
// Cargar variables de entorno
if (existsSync('.env')) {
    console.log('📁 Archivo .env encontrado, cargando...');
    const result = dotenv.config();
    
    if (result.error) {
        console.error('❌ Error cargando .env:', result.error);
    } else {
        console.log('✅ .env cargado correctamente');
    }
} else {
    console.log('⚠️ No se encontró archivo .env');
}
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432
});

