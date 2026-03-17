import express from 'express';
import * as postRoutes from '../controllers/index.js'
import { validatePostAuthorIdExists } from '../middleware/validationMiddleware.js';

const router = express.Router();
const {_getPost,_getPostId,_updatePost,_deletePost, _getPostsByAuthor,_createPost} = postRoutes
// GET todos los posts
router.get('/', _getPost);

// GET post por ID
router.get('/:id', _getPostId);

//GET del posts por authorID
router.get("/author/:authorId",validatePostAuthorIdExists,_getPostsByAuthor)

// POST nuevo post
router.post('/',validatePostAuthorIdExists, _createPost);

// PUT actualizar post
router.put('/:id', _updatePost);

// DELETE post
router.delete('/:id',_deletePost);

export default router