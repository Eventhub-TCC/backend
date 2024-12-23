import { Transaction } from "sequelize";
import Evento from "../models/Evento";

export default class EventoDao{
    public cadastrarEvento = async (localEvento:string,horaInicio:Date,horaFim:Date,nomeEvento:string,dataEvento:Date,idTipoEvento:number,idUsuario:string, transaction: Transaction | null = null)=>{
       const evento: Evento = await Evento.create({
            localEvento,
            horaInicio,
            horaFim,
            nomeEvento,
            dataEvento,
            idTipoEvento,
            idUsuario
        }, transaction ? {transaction} : {});
        return evento;
    }

    public listarEventos = async (idUsuario: string):Promise<Evento[]> =>{
        const eventos: Evento[] = await Evento.findAll({
            where: {
                idUsuario
            }
        });
        return eventos;
    }

    public buscarEventoporId = async (idEvento: string):Promise<Evento | null> =>{
        const evento: Evento | null = await Evento.findByPk(idEvento);
        return evento;
    }

    public deletarEvento = async (idUsuario:string) => {
        await Evento.destroy({
            where: {
                idUsuario 
            }
        })
    }
}

