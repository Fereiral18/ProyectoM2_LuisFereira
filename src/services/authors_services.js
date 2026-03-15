import { pool } from "../config.js";


export const getAllAuthors = async () => {
   const client = await pool.connect();
    
    try {
        // Tu consulta SQL
        const result = await client.query('SELECT * FROM authors ORDER BY id');
        return result.rows;
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    } finally {
        // SIEMPRE liberar el cliente
        client.release();
    }
};

export const getAuthorById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM authors WHERE id = $1",
    [id]
  );

  return result.rows[0];
};


export const createAuthor = async ({ name, email, bio }) => {

  const result = await pool.query(
    `INSERT INTO authors (name, email, bio)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [name, email, bio]
  );

  return result.rows[0];
};
