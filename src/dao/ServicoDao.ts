import { Transaction } from "sequelize";
import Servico from '../models/Servico';

export default class ServicoDao{
    public cadastrarServico = async (idUsuario: string, idTipoServico: number, nomeServico:string, descricaoServico:string, unidadeCobranca: string, valorServico:number, qntMinima: number, qntMaxima:number, imagem1:string, imagem2:string | null, imagem3:string | null,imagem4:string | null, imagem5:string | null, imagem6:string | null, transaction: Transaction | null = null)=>{
        const servico: Servico = await Servico.create({
            idUsuario,
            idTipoServico,
            nomeServico,
            descricaoServico,
            unidadeCobranca,
            valorServico,
            qntMinima,
            qntMaxima,
            imagem1,
            imagem2,
            imagem3,
            imagem4,
            imagem5,
            imagem6 
        }, transaction ? {transaction} : {});
        return servico;
    }
}