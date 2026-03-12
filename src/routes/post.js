import express from 'express';
const router = express.Router();

// GET todos los posts
router.get('/', (req, res) => {
  res.json({ 
    posts: [
      { id: 1, titulo: 'Post 1', contenido: 'Contenido del post 1' },
      { id: 2, titulo: 'Post 2', contenido: 'Contenido del post 2' }
    ] 
  });
});

// GET post por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ post: { id, titulo: `Post ${id}`, contenido: 'Contenido del post' } });
});

// POST nuevo post
router.post('/', (req, res) => {
  const { titulo, contenido } = req.body;
  res.status(201).json({
    mensaje: 'Post creado',
    post: { titulo, contenido }
  });
});

// PUT actualizar post
router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ mensaje: `Post ${id} actualizado` });
});

// DELETE post
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ mensaje: `Post ${id} eliminado` });
});

export default router;