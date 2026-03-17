import { describe, test, expect, afterAll } from 'vitest';
import { createAuthors, deleteAuthors, getAllAuthors, updateAuthors } from '../../src/services/authors_services.js';


describe('Authors Service - Unit Tests (DB Real)', () => {
  let tempAuthorId;

  test('createAuthorService debe insertar un autor y devolverlo', async () => {
    const nuevo = { name: "Unit Test", email: `unit_${Date.now()}@gmail.com`, bio: "Bio" };
    const author = await createAuthors(nuevo);
    
    tempAuthorId = author.id;
    expect(author).toHaveProperty('id');
    expect(author.name).toBe(nuevo.name);
  });

  test('createAuthorService debe lanzar error si el email ya existe', async () => {
    const duplicado = { name: "Otro", email: "repetido@test.com", bio: "Bio" };
    
    try { await createAuthors(duplicado); } catch (e) {}
    
    await expect(createAuthors(duplicado)).rejects.toThrow("EMAIL_EXISTS");
  });

  test('getAllAuthorsService debe traer una lista de la DB', async () => {
    const authors = await getAllAuthors();
    expect(Array.isArray(authors)).toBe(true);
    expect(authors.length).toBeGreaterThan(0);
  });

  test('updateAuthorService debe retornar null si el ID no existe', async () => {
    const result = await updateAuthors(999999, { name: "X", email: "x@x.com", bio: "X" });
    expect(result).toBeNull();
  });

  test('deleteAuthorService debe retornar true si borra con éxito', async () => {
    const result = await deleteAuthors(tempAuthorId);
    expect(result).toBe(true);
  });

    
  afterAll(async () => {
    // Limpieza de seguridad
    if (tempAuthorId) {
      await deleteAuthors(tempAuthorId);
    }
    
    const allAuthors = await getAllAuthors();
    const duplicado = allAuthors.find(a => a.email === "repetido@test.com");
    if (duplicado) {
      await deleteAuthors(duplicado.id);
    }
    
    console.log("🧹 Base de datos de autores limpia.");
  });
});