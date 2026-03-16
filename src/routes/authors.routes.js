import express from "express";
import * as authorRoutes from "../controllers/index.js";
import { validateAuthorData, validateAuthorId } from "../middleware/validationMiddleware.js";

const router = express.Router();
const { getAuthors, getAuthorId, postAuthor, updateAuthor, deleteAuthor } = authorRoutes;
// GET todos los autores
router.get("/", getAuthors);

// GET autor por ID
router.get("/:id",validateAuthorId, getAuthorId);

// POST nuevo autor
router.post("/",validateAuthorData, postAuthor);

// PUT actualizar autor
router.put("/:id",validateAuthorId, updateAuthor);

// DELETE borrar autor
router.delete("/:id",validateAuthorId, deleteAuthor);

export default router;
