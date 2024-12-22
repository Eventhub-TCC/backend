import express from 'express';
import UsuarioController from '../controllers/UsuarioController';

const route = express.Router();

const usuarioController = new UsuarioController();

route.post('/signup', usuarioController.cadastrarUsuario);
route.post("/signin", usuarioController.fazerLogin)

export default route;