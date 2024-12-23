import { Request, Response } from "express";
import EventoDao from "../dao/EventoDao";

export default class EventoController {

    private eventoDao = new EventoDao();

    public cadastrarEvento = async (req: Request, res: Response) =>{
        try{
            const { localEvento, horaInicio, horaFim, nomeEvento, dataEvento, idTipoEvento, idUsuario } = req.body;
            await this.eventoDao.cadastrarEvento(localEvento, horaInicio, horaFim, nomeEvento, dataEvento, idTipoEvento, idUsuario)
            res.status(201).json({ message: 'Evento cadastrado com sucesso!'});
        }
        catch(error){
            console.error('Erro ao cadastrar evento', error);
            res.status(500).json({mensagem: "Erro ao cadastrar evento"});
        }
    }

    public deletarEvento = async (req: Request, res: Response) => {
        try{
            const { idEvento } = req.params; 
        
            await this.eventoDao.deletarEvento(idEvento)
            res.status(200).json({mensagem: "Evento deletado com sucesso"});
        }
        catch (error) {
            console.error('Erro ao deletar evento', error);
            res.status(500).json({ mensagem: "Erro ao deletar evento" });
        }
    }
}