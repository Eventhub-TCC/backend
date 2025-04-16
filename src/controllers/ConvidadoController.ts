import { Request, Response } from 'express';
import ConvidadoDao from "../dao/ConvidadoDao";;



export default class ConvidadoController {

  private convidadoDao = new ConvidadoDao();
  
  
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
}
