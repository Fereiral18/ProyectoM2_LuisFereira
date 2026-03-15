import express from 'express';
import  * as authorRoutes  from '../controllers/authorControllers.js';


const router = express.Router();

// GET todos los autores
router.get('/', authorRoutes.getAuthors);

// GET autor por ID
router.get('/:id', authorRoutes.getAuthorId);

// POST nuevo autor
router.post('/', authorRoutes.postAuthor);

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