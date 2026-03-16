import { pool } from "../config.js";

//Trae toda la informacion en la base de datos
export const getAllAuthors = async () => {
  const client = await pool.connect();

  try {
    // Tu consulta SQL
    const result = await client.query("SELECT * FROM authors ORDER BY id");
    return result.rows;
  } catch (error) {
    console.error("Error en la consulta:", error);
    throw error;
  } finally {
    // SIEMPRE liberar el cliente
    client.release();
  }
};
//Trae toda la informacion del autor segun su ID
export const getAuthorById = async (id) => {
  const result = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);

  return result.rows[0];
};

//Añade un autor nuevo a la base de datos
export const createAuthors = async ({ name, email, bio }) => {
  const result = await pool.query(
    `INSERT INTO authors (name, email, bio)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [name, email, bio],
  );

  return result.rows[0];
};
//Modifica los valores deseados del autor en la base de datos
export const updateAuthors = async (id, { name, email, bio }) => {
  const { rows } = await pool.query(
    "UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *",
    [name, email, bio, id],
  );
  return rows[0] || null;
};
//Elimina un autor de la base de datos
export const deleteAuthors = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM authors WHERE id = $1", [
    id,
  ]);
  return rowCount > 0;
};
