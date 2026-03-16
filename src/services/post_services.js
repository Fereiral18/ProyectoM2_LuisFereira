import { pool } from "../config.js";

//Trae todos los post de la base de datos
export const getAllPostService = async () => {
  const { rows } = await pool.query(`
    SELECT posts.*, authors.name as author_name
    FROM posts
    JOIN authors ON posts.author_id = authors.id
    ORDER BY posts.id
  `);
  return rows;
};
//Trae los posts por ID
export const getPostByIdService = async (id) => {
  const { rows } = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  return rows[0];
};
//Trae los post de cada autor en base a su id
export const getPostsByAuthorService = async (authorId) => {
  const { rows } = await pool.query(`
    SELECT posts.*, authors.name as author_name
    FROM posts
    JOIN authors ON posts.author_id = authors.id
    WHERE authors.id = $1
  `, [authorId]);
  return rows;
};
//Crea un nuevo post 
export const createPostService = async ({ title, content, author_id, published }) => {
  const { rows } = await pool.query(
    `INSERT INTO posts (title, content, author_id, published)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, content, author_id, published ?? true]
  );
  return rows[0];
};
//Modifica el post en base a su id
export const updatePostService = async (id, { title, content, author_id, published }) => {
  const { rows } = await pool.query(
    `UPDATE posts
     SET title=$1, content=$2, author_id=$3, published=$4
     WHERE id=$5
     RETURNING *`,
    [title, content, author_id, published, id]
  );
  return rows[0] || null;
};
//Elimina el post en base a su id
export const deletePostService = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM posts WHERE id=$1", [id]);
  return rowCount > 0;
};