import express from "express";
import * as authorRoutes from "../controllers/authorControllers.js";

const router = express.Router();
const { getAuthors, getAuthorId, postAuthor, updateAuthor, deleteAuthor } = authorRoutes;
// GET todos los autores
router.get("/", getAuthors);

// GET autor por ID
router.get("/:id", getAuthorId);

// POST nuevo autor
router.post("/", postAuthor);

// PUT actualizar autor
router.put("/:id", updateAuthor);

// DELETE borrar autor
router.delete("/:id", deleteAuthor);

export default router;
