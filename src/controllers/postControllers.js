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

export const _getPostsByAuthor = async (req, res, next) => {
  try {
    const posts = await getPostsByAuthorService(req.params.authorId);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const _createPost = async (req, res, next) => {
  try {
    const post = await createPostService(req.body);
    res.status(201).json(post);
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
