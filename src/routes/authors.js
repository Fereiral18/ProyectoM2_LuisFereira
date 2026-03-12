import express from 'express';
const router = express.Router();

// GET todos los autores
router.get('/', (req, res) => {
  res.json({ 
    authors: [
      { id: 1, nombre: 'Autor 1' },
      { id: 2, nombre: 'Autor 2' }
    ] 
  });
});

// GET autor por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ author: { id, nombre: `Autor ${id}` } });
});

// POST nuevo autor
router.post('/', (req, res) => {
  const { nombre, email } = req.body;
  res.status(201).json({ 
    mensaje: 'Autor creado',
    author: { nombre, email }
  });
});

// PUT actualizar autor
router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ mensaje: `Autor ${id} actualizado` });
});

// DELETE autor
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ mensaje: `Autor ${id} eliminado` });
});

export default router;