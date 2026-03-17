import { afterAll, beforeAll, vi } from 'vitest'
import { pool } from '../src/config.js'

// Mock de la base de datos o configuraciones globales
beforeAll(async () => {
 vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterAll(async () => {
  // Cerrar conexiones
  await pool.end()
})

// Limpiar mocks después de cada test
afterEach(async () => {
 await pool?.end()
})