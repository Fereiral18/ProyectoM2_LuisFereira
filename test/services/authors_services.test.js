import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  getAllAuthors, 
  getAuthorById, 
  createAuthors, 
  updateAuthors, 
  deleteAuthors 
} from '../../src/services/authors_services.js'
import { pool } from '../../src/config.js'

vi.mock('../../src/config.js', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn()
  }
}))

describe('Authors Services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllAuthors', () => {
    it('debería retornar todos los autores', async () => {
      const mockAuthors = [
        { id: 1, name: 'Author 1', email: 'author1@test.com' },
        { id: 2, name: 'Author 2', email: 'author2@test.com' }
      ]
      
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: mockAuthors }),
        release: vi.fn()
      }
      
      pool.connect.mockResolvedValue(mockClient)
      
      const result = await getAllAuthors()
      
       expect(result).toEqual(mockAuthors)
      expect(pool.connect).toHaveBeenCalled()
      expect(mockClient.query).toHaveBeenCalledWith("SELECT * FROM authors ORDER BY id")
      expect(mockClient.release).toHaveBeenCalled()
    })

    it('debería retornar array vacío cuando no hay autores', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn()
      }
      
      pool.connect.mockResolvedValue(mockClient)
      
      const result = await getAllAuthors()
      
      expect(result).toEqual([])
      expect(mockClient.release).toHaveBeenCalled()
    })

    it('debería lanzar error si la consulta falla', async () => {
      const mockClient = {
        query: vi.fn().mockRejectedValue(new Error('DB Error')),
        release: vi.fn()
      }
      
      pool.connect.mockResolvedValue(mockClient)
      
      await expect(getAllAuthors()).rejects.toThrow('DB Error')
      expect(mockClient.release).toHaveBeenCalled()
    })
  })

  describe('getAuthorById', () => {
    it('debería retornar un autor por ID', async () => {
      const mockAuthor = { id: 1, name: 'Author 1', email: 'author1@test.com' }
      pool.query.mockResolvedValue({ rows: [mockAuthor] })
      
      const result = await getAuthorById(1)
      
      expect(result).toEqual(mockAuthor)
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM authors WHERE id = $1',
        [1]
      )
    })

    it('debería retornar undefined si el autor no existe', async () => {
      pool.query.mockResolvedValue({ rows: [] })
      
      const result = await getAuthorById(999)
      
      expect(result).toBeUndefined()
    })
  })

  describe('createAuthors', () => {
    const newAuthor = {
      name: 'New Author',
      email: 'new@test.com',
      bio: 'New bio'
    }

    it('debería crear un nuevo autor', async () => {
      const mockCreatedAuthor = { id: 1, ...newAuthor }
      pool.query.mockResolvedValue({ rows: [mockCreatedAuthor] })
      
      const result = await createAuthors(newAuthor)
      
      expect(result).toEqual(mockCreatedAuthor)
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO authors'),
        [newAuthor.name, newAuthor.email, newAuthor.bio]
      )
    })

    it('debería lanzar error EMAIL_EXISTS si el email está duplicado', async () => {
      const error = new Error('Duplicate email')
      error.code = '23505'
      error.constraint = 'authors_email_key'
      pool.query.mockRejectedValue(error)
      
      await expect(createAuthors(newAuthor)).rejects.toThrow('EMAIL_EXISTS')
    })

    it('debería relanzar otros errores de BD', async () => {
      const error = new Error('Other DB error')
      error.code = '12345'
      pool.query.mockRejectedValue(error)
      
      await expect(createAuthors(newAuthor)).rejects.toThrow('Other DB error')
    })
  })

  describe('updateAuthors', () => {
    const updateData = {
      name: 'Updated Author',
      email: 'updated@test.com',
      bio: 'Updated bio'
    }

    it('debería actualizar un autor existente', async () => {
      const mockUpdatedAuthor = { id: 1, ...updateData }
      pool.query.mockResolvedValue({ rows: [mockUpdatedAuthor] })
      
      const result = await updateAuthors(1, updateData)
      
      expect(result).toEqual(mockUpdatedAuthor)
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE authors'),
        [updateData.name, updateData.email, updateData.bio, 1]
      )
    })

    it('debería retornar null si el autor no existe', async () => {
      pool.query.mockResolvedValue({ rows: [] })
      
      const result = await updateAuthors(999, updateData)
      
      expect(result).toBeNull()
    })
  })

  describe('deleteAuthors', () => {
    it('debería eliminar un autor existente', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 })
      
      const result = await deleteAuthors(1)
      
      expect(result).toBe(true)
      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM authors WHERE id = $1',
        [1]
      )
    })

    it('debería retornar false si el autor no existe', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 })
      
      const result = await deleteAuthors(999)
      
      expect(result).toBe(false)
    })
  })
})