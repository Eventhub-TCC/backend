import express from "express";
import PedidoController from "../controllers/PedidoController";
import { validarTokenAutenticacao } from "../middlewares/validarToken";

const route = express.Router();
const pedidoController = new PedidoController();
route.post('/pedidos',validarTokenAutenticacao, pedidoController.finalizarPedido);
route.get('/listar-pedidos', validarTokenAutenticacao, pedidoController.listarPedidos);
route.get('/listar-itens-pedido/:idPedido', validarTokenAutenticacao, pedidoController.listarItensPedido);
route.get('/listar-pedidos-prestador', validarTokenAutenticacao, pedidoController.listarPedidosPrestador);
route.get('/listar-itens-pedido-prestador/:idPedido', validarTokenAutenticacao, pedidoController.listarItensPedidoPrestador);

export default route;
