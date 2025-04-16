import { Transaction } from "sequelize";
import Evento from "../models/Evento";
import Usuario from "../models/Usuario";

export default class EventoDao{
    public cadastrarEvento = async (descricaoEvento:String, imagemEvento:String|null, cepLocal:String, enderecoLocal:String, numeroLocal:String, complementoLocal:String, bairroLocal:String, cidadeLocal:String, ufLocal:String,horaInicio:Date,horaFim:Date,nomeEvento:string,dataEvento:Date,idTipoEvento:number,idUsuario:string, transaction: Transaction | null = null)=>{
       const evento: Evento = await Evento.create({
            descricaoEvento,
            imagemEvento,
            cepLocal, 
            enderecoLocal, 
            numeroLocal, 
            complementoLocal, 
            bairroLocal, 
            cidadeLocal, 
            ufLocal,
            horaInicio,
            horaFim,
            nomeEvento,
            dataEvento,
            idTipoEvento,
            idUsuario
        }, transaction ? {transaction} : {});
        return evento;
    }

    public listarEventos = async (emailUsu: string):Promise<Evento[]> =>{
        const usuario: Usuario | null = await Usuario.findOne({
            where: {
                emailUsu
            }
        });
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        const idUsuario = usuario?.codigoUsu;

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

    public editarEvento = async (idEvento: string, localEvento: string, horaInicio: Date, horaFim: Date, nomeEvento: string, dataEvento: Date, idTipoEvento: number, idUsuario: string, transaction: Transaction | null = null): Promise<[number, Evento[]]> => {
        const resultado = await Evento.update({
            localEvento, 
            horaInicio, 
            horaFim, 
            nomeEvento, 
            dataEvento, 
            idTipoEvento, 
            idUsuario
        }, {
            where: { idEvento }, 
            transaction,
            returning: true 
        }); 
        return resultado; 
    }


    public deletarEvento = async (idUsuario:string) => {
        await Evento.destroy({
            where: {
                idUsuario 
            }
        })
    }
}

