import express from "express";
import ServicoController from '../controllers/ServicoController';
import upload from "../config/multer";
import { validarTokenAutenticacao } from "../middlewares/validarToken";

const route = express.Router()

const servicoController = new ServicoController()

route.post('/services', validarTokenAutenticacao, upload.array('files',6) ,servicoController.cadastrarServico)
route.get('/:idUsuario/services/:idServico', validarTokenAutenticacao, servicoController.obterServico);

export default route;