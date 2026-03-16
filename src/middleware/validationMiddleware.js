// middlewares/validationMiddleware.js
export const validateAuthorData = (req, res, next) => {
  const { name, email, bio } = req.body;

  // Validar nombre
  if (!name || name.trim() === "") {
    return res.status(400).json({ 
      error: "El nombre es obligatorio y no puede estar vacío" 
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

  // Validar longitud del nombre
  if (name.length < 3) {
    return res.status(400).json({ 
      error: "El nombre debe tener al menos 3 caracteres" 
    });
  }

  // Si todo está bien, continuar
  next();
};

// Middleware para validar ID
export const validateAuthorId = (req, res, next) => {
  const { id } = req.params;
  
  // Validar que el ID sea un número válido
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ 
      error: "ID de autor no válido" 
    });
  }

  next();
};