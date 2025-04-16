import express from 'express';
import ConvidadoController from '../controllers/ConvidadoController';

const route = express.Router();

const convidadoController = new ConvidadoController();

route.get('/obter-convidados/:idEvento', async (req, res) => {
    await convidadoController.obterConvidados(req, res);
  });


export default route;