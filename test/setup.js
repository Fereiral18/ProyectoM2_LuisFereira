import { afterAll, beforeAll, vi } from 'vitest'
import { pool } from '../src/config.js'

// Mock de la base de datos o configuraciones globales
beforeAll(async () => {
 vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterAll(async () => {
   // Limpieza de seguridad
    if (tempAuthorId) {
      await deleteAuthorService(tempAuthorId);
    }
    
    const allAuthors = await getAllAuthorsService();
    const duplicado = allAuthors.find(a => a.email === "repetido@test.com");
    if (duplicado) {
      await deleteAuthorService(duplicado.id);
    }
    
    console.log("🧹 Base de datos de autores limpia.");
  // Cerrar conexiones
  await pool.end()
})

// Limpiar mocks después de cada test
afterEach(async () => {
 await pool?.end()
})