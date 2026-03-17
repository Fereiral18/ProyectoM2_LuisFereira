import {
  createPostService,
  deletePostService,
  getAllPostService,
  getPostByIdService,
  getPostsByAuthorService,
  updatePostService,
} from "../services/post_services.js";

export const _getPost = async (req, res, next) => {
  try {
    const posts = await getAllPostService();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const _getPostId = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const _getPostsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    
    // Validar que el authorId sea un número válido
    if (isNaN(authorId) || parseInt(authorId) <= 0) {
      return res.status(400).json({ 
        error: 'El ID del autor debe ser un número válido' 
      });
    }

    const posts = await getPostsByAuthorService(parseInt(authorId));
    
    if (posts.length === 0) {
      return res.status(404).json({ 
        message: 'No se encontraron posts para este autor',
        author_id: parseInt(authorId)
      });
    }
    
    res.json({
      author_id: parseInt(authorId),
      total: posts.length,
      posts: posts
    });
  } catch (error) {
    console.error('Error al obtener posts por autor:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
}


export const _createPost = async (req, res, next) => {
  try {
    const post = await createPostService(req.body);
    res.status(201).json({
      message: 'Post creado exitosamente',
      post: post
    });
  } catch (error) {
    next(error);
  }
};

export const _updatePost = async (req, res, next) => {
  try {
    const post = await updatePostService(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const _deletePost = async (req, res, next) => {
  try {
    const deleted = await deletePostService(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Post no encontrado" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
