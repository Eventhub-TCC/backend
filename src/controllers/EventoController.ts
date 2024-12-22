import { Request, Response } from "express";
import EventoDao from "../dao/EventoDao";
import Evento from "../models/Evento";

export default class EventoController {

    private eventoDao = new EventoDao();

    public cadastrarEvento = async (req: Request, res: Response) =>{
        try{
            const { numeroConvidados, localEvento, horaInicio, horaFim, nomeEvento, dataEvento, idTipoEvento, idUsuario } = req.body;
            await this.eventoDao.cadastrarEvento(numeroConvidados, localEvento, horaInicio, horaFim, nomeEvento, dataEvento, idTipoEvento, idUsuario)
            res.status(201).json({ message: 'Evento cadastrado com sucesso!'});
        }
        catch(error){
            console.error('Erro ao cadastrar evento', error);
            res.status(500).json({mensagem: "Erro ao cadastrar evento"});
        }
    }
}