import express from 'express';
import ConviteController from '../controllers/ConviteController';

const route = express.Router();

const conviteController = new ConviteController();

route.get('/obter-convites/:idEvento', async (req, res) => {
    await conviteController.obterConvite(req, res);
  });

route.post('/gerar-convite/:idEvento', async (req, res) => {
    await conviteController.gerarConvite(req, res);
});

route.delete('/deletar-convite/:idConvite', async (req, res) => {
    await conviteController.deletarConvite(req, res);
});




export default route;