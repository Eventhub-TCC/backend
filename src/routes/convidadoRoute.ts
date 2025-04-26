import express from 'express';
import ConvidadoController from '../controllers/ConvidadoController';
import { validarTokenAutenticacao } from '../middlewares/validarToken';

const route = express.Router();

const convidadoController = new ConvidadoController();

route.get('/obter-convidados/:idEvento', validarTokenAutenticacao, async (req, res) => {
    await convidadoController.obterConvidados(req, res);
  });
route.put('/atualizar-status-convidado/:idConvidado', validarTokenAutenticacao, convidadoController.atualizarStatusConvidadoController);


export default route;