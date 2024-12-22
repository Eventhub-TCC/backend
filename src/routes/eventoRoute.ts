import express from "express";
import EventoController from "../controllers/EventoController";

const route = express.Router()

const eventoController = new EventoController()

route.post('/', eventoController.cadastrarEvento)

export default route;