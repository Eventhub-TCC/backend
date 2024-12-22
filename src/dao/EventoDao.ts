import Evento from "../models/Evento";

export default class EventoDao{
    cadastrarEvento = async (numeroConvidados:number,localEvento:string,horaInicio:Date,horaFim:Date,nomeEvento:string,dataEvento:Date,idTipoEvento:number,idUsuario:string)=>{
       const evento: Evento = await Evento.create({
            numeroConvidados,
            localEvento,
            horaInicio,
            horaFim,
            nomeEvento,
            dataEvento,
            idTipoEvento,
            idUsuario
        });
        return evento;
    }
}