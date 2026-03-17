import { describe, it, expect, vi, beforeEach } from 'vitest'


import { validateAuthorData, validateAuthorId, validatePostAuthorIdExists } from '../../src/middleware/validationMiddleware.js'
import { pool } from '../../src/config.js'

// Mock del pool
vi.mock('../../../config.js', () => ({
  pool: {
    query: vi.fn()
  }
}))

describe('Validation Middlewares', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    next = vi.fn()
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('validateAuthorData', () => {
    it('debería rechazar si falta el nombre', () => {
      req.body = { email: 'test@test.com', bio: 'bio' }
      
      validateAuthorData(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: "El nombre es obligatorio y no puede estar vacío"
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('debería rechazar si el nombre está vacío', () => {
      req.body = { name: '   ', email: 'test@test.com' }
      
      validateAuthorData(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('debería rechazar si falta el email', () => {
      req.body = { name: 'Test Author', bio: 'bio' }
      
      validateAuthorData(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: "El correo electrónico es obligatorio"
      })
    })

    it('debería rechazar email con formato inválido', () => {
      req.body = { 
        name: 'Test Author', 
        email: 'email-invalido',
        bio: 'bio'
      }
      
      validateAuthorData(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: "El formato del correo electrónico no es válido"
      })
    })

    it('debería rechazar nombre con menos de 3 caracteres', () => {
      req.body = { 
        name: 'Te', 
        email: 'test@test.com',
        bio: 'bio'
      }
      
      validateAuthorData(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: "El nombre debe tener al menos 3 caracteres"
      })
    })

    it('debería aceptar datos válidos', () => {
      req.body = { 
        name: 'Test Author', 
        email: 'test@test.com',
        bio: 'Esta es una biografía válida'
      }
      
      validateAuthorData(req, res, next)
      
      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
    })
  })

  describe('validateAuthorId', () => {
    it('debería rechazar ID no numérico', async () => {
      req.params.id = 'abc'
      
      await validateAuthorId(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: "El ID debe ser un número positivo válido"
      })
    })

    it('debería rechazar ID negativo', async () => {
      req.params.id = '-5'
      
      await validateAuthorId(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('debería rechazar ID cero', async () => {
      req.params.id = '0'
      
      await validateAuthorId(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('debería manejar cuando el autor no existe', async () => {
      req.params.id = '999'
      pool.query.mockResolvedValue({ rows: [], rowCount: 0 })
      
      await validateAuthorId(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: "No se encontró ningún autor con ese id"
      })
    })

    it('debería pasar si el autor existe', async () => {
      req.params.id = '1'
      const mockAuthor = { id: 1, name: 'Test Author' }
      pool.query.mockResolvedValue({ 
        rows: [mockAuthor], 
        rowCount: 1 
      })
      
      await validateAuthorId(req, res, next)
      
      expect(req.authorData).toEqual(mockAuthor)
      expect(next).toHaveBeenCalled()
    })

    it('debería manejar errores de PostgreSQL', async () => {
      req.params.id = '1'
      const error = new Error('Invalid input')
      error.code = '22P02'
      pool.query.mockRejectedValue(error)
      
      await validateAuthorId(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: "Formato de ID no válido"
      })
    })
  })

  describe('validatePostAuthorIdExists', () => {
    it('debería rechazar si falta author_id', async () => {
      req.body = {}
      
      await validatePostAuthorIdExists(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'author_id es requerido'
      })
    })

    it('debería rechazar si el author no existe', async () => {
      req.body = { author_id: 999 }
      pool.query.mockResolvedValue({ rows: [] })
      
      await validatePostAuthorIdExists(req, res, next)
      
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Author no encontrado',
        message: 'El author con id 999 no existe'
      })
    })

    it('debería pasar si el author existe', async () => {
      req.body = { author_id: 1 }
      const mockAuthor = { id: 1, name: 'Test Author' }
      pool.query.mockResolvedValue({ rows: [mockAuthor] })
      
      await validatePostAuthorIdExists(req, res, next)
      
      expect(req.author).toEqual(mockAuthor)
      expect(next).toHaveBeenCalled()
    })
  })
})