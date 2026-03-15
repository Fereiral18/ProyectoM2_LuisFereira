import { createAuthor, getAllAuthors, getAuthorById } from "../services/authors_services.js";

export const getAuthors = async (req, res, next) => {
  try {
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
};

export const getAuthorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await getAuthorById(id);

    if (!author) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }

    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};


export const postAuthor = async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "El nombre no puede estar vacío" });
    }

    if (!email || email.trim() === "") {
      return res.status(400).json({ error: "El correo electrónico es obligatorio" });
    }

    const author = await createAuthor({ name, email, bio });
    res.status(201).json(author);

  } catch (error) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(400).json({ error: "El correo electrónico ya existe" });
    }
    next(error);
  }
};