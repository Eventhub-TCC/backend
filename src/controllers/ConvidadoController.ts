import { Request, Response } from 'express';
import ConvidadoDao from "../dao/ConvidadoDao";
import EventoDao from '../dao/EventoDao';
import gerarListaDeConvidados from '../utils/gerarListaDeConvidados';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export default class ConvidadoController {

  private convidadoDao = new ConvidadoDao();
  private eventoDao = new EventoDao();
  
  public obterConvidados = async (req: Request, res: Response) => {
    try {
      const { idEvento } = req.params;
      const convidados = await this.convidadoDao.listarConvidados(idEvento);
      if (convidados.length === 0) {
        return res.status(404).json({ mensagem: 'Nenhum convidado encontrado.' });
      }
      res.status(200).json(convidados);
    } catch (error) {
      console.error('Erro ao obter convidados:', error);
      res.status(500).json({ mensagem: 'Erro interno ao obter convidados.' });
    }
  };

  public buscarStatusConvidadoPorConvite = async (req: Request, res: Response) => {
    const { idConvite } = req.params;
    try {
      const convidado = await this.convidadoDao.buscarConvidadoPorConvite(idConvite);
      if (!convidado) {
        return res.status(404).json({ mensagem: 'Convidado não encontrado.' });
      }
      res.status(200).json({status: convidado.status});
    } 
    catch (error) {
      console.error('Erro ao buscar convidado por convite:', error);
      res.status(500).json({ mensagem: 'Erro interno ao buscar convidado.' });
    }
  }

  public atualizarStatusConvidadoController = async (req: Request, res: Response) => {
    const { idConvidado } = req.params;
    const { status } = req.body; 
  
    try {
      await this.convidadoDao.atualizarStatusConvidadoDAO(idConvidado, status);
      res.status(200).json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
      console.error('Erro no controller ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  };

  public gerarListaConvidados = async (req: AuthenticatedRequest, res: Response) => {
    const { idEvento } = req.params;
    const codigoUsu = req.user!.id.toString();

    try {
      const evento = await this.eventoDao.buscarEventoPorId(idEvento, codigoUsu);
      if(!evento) {
        return res.status(404).json({ mensagem: 'Evento não encontrado' });
      }

      const convidados = await this.convidadoDao.listarConvidados(idEvento);
      const convidadosConfirmados = convidados.filter((convidado) => convidado.status === 'Confirmado');
      if (convidadosConfirmados.length === 0) {
        return res.status(400).json({ mensagem: 'O evento não possui nenhum convidado confirmado' });
      }

      const pdf = await gerarListaDeConvidados(evento, convidadosConfirmados);
      if (!pdf) {
        return res.status(500).json({ mensagem: 'Erro ao gerar lista' });
      }
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=lista_de_convidados.pdf`,
        'Content-Length': pdf.length,
      });
      res.end(pdf);
    } 
    catch (error) {
      console.error('Erro ao gerar lista de convidados:', error);
      res.status(500).json({ mensagem: 'Erro ao gerar lista de convidados' });
    }
  }
}
