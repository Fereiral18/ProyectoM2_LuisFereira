import { createAuthors, getAllAuthors, getAuthorById, updateAuthors, deleteAuthors } from "../services/authors_services.js";


//Trae todos los autores
export const getAuthors = async (req, res, next) => {
  try {
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
};
//Trae los autores por ID
export const getAuthorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await getAuthorById(id);

    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};

//Crea un nuevo autor
export const postAuthor = async (req, res, next) => {
  try {
    const author = await createAuthors(req.body);
      res.status(200).json({ 
      message: "Autor Creado exitosamente",
      content: author 
    });

  } catch (error) {
    next(error);
  }
};

//Modificar un autor segun el id seleccionado
export const updateAuthor = async (req, res, next) => {
  try {
    const author = await updateAuthors(req.params.id, req.body);
      res.status(200).json({ 
      message: "El autor ha sido modificado exitoramente!",
      id: req.params.id 
    });
  } catch (error) { next(error); }
};
//Elimina un autor segun el id
export const deleteAuthor = async (req, res, next) => {
  try {
    const ok = await deleteAuthors(req.params.id);
      res.status(200).json({ 
      message: "authors eliminado exitosamente",
      id: req.params.id 
    });
  } catch (error) { next(error); }
};