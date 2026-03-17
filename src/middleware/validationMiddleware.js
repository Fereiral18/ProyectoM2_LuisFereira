import { pool } from "../config.js";

// middlewares/validationMiddleware.js
export const validateAuthorData = (req, res, next) => {
  const { name, email, bio } = req.body;

  // Validar nombre
  if (!name || name.trim() === "") {
    return res.status(400).json({ 
      error: "El nombre es obligatorio y no puede estar vacío" 
    });
  }

  // Validar longitud del nombre (después de validar que existe)
  if (name.length < 3) {
    return res.status(400).json({ 
      error: "El nombre debe tener al menos 3 caracteres" 
    });
  }

  // Validar email
  if (!email || email.trim() === "") {
    return res.status(400).json({ 
      error: "El correo electrónico es obligatorio" 
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: "El formato del correo electrónico no es válido" 
    });
  }

  // Si todo está bien, continuar
  next();
};
// Middleware para validar ID
export const validateAuthorId = async (req, res, next) => {
  const { id } = req.params;
  
  // Validar que el ID sea un número válido
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ 
      error: "El ID debe ser un número positivo válido" 
    });
  }

  try {
    // Consulta parametrizada para PostgreSQL (usa $1, $2, etc.)
    const query = 'SELECT id, name FROM authors WHERE id = $1';
    const values = [id];
    
    const result = await pool.query(query, values);
    
    // Verificar si existe el usuario
    if (result.rowCount === 0) { // También puedes usar result.rows.length === 0
      return res.status(404).json({
        error: `No se encontró ningún autor con ese id`
      });
    }

    // Guardar la información del autor en el objeto req para usarla después
    req.authorData = result.rows[0];
    
    // Continuar con la siguiente función middleware
    next();
    
  } catch (error) {
    console.error(`Error en validateAuthorId para ID ${id}:`, error);
    
    // Manejar errores específicos de PostgreSQL
    if (error.code === '22P02') { // Error de tipo de dato inválido
      return res.status(400).json({
        error: "Formato de ID no válido"
      });
    }
  }}

  export const validatePostAuthorIdExists = async (req, res, next) => {
  const author_id = req.body.author_id || req.params.author_id;
  
  if (!author_id) {
    return res.status(400).json({ error: 'author_id es requerido' });
  }
  
  try {
    const result = await pool.query(
      'SELECT id, name FROM authors WHERE id = $1',
      [author_id]

    
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Author no encontrado',
        message: `El author con id ${author_id} no existe`
      });
    }
    
    // Opcional: agregar el author al request para uso posterior
    req.author = result.rows[0];
    next();
    
  } catch (error) {
    console.error('Error validando author:', error);
    res.status(500).json({ error: 'Error validando author' });
  }
};


