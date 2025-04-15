import express from "express";
import EventoController from "../controllers/EventoController";
import upload from "../config/multer";

const route = express.Router()

const eventoController = new EventoController()

route.post('/:idUsuario/events',upload.single("file"), eventoController.cadastrarEvento);
route.get('/events/:emailUsu', eventoController.listarEventos);
route.get('/:idUsuario/events/:idEvento', eventoController.buscarEventoporId);
route.put('/:idUsuario/events/:idEvento', eventoController.editarEvento);
route.delete('/:idUsuario/events/:idEvento', eventoController.deletarEvento);

export default route;